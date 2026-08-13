"use client";

import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false }) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

let blotsRegistered = false;

async function registerCustomFormats() {
  if (blotsRegistered) return;
  const { default: Quill } = await import("quill");

  const Font = Quill.import("formats/font") as { whitelist?: string[] };
  Font.whitelist = ["sans-serif", "serif", "monospace", "display"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Quill.register(Font as any, true);

  const BlockEmbed = Quill.import("blots/block/embed") as any;

  class VideoEmbed extends BlockEmbed {
    static blotName = "customVideo";
    static tagName = "video";
    static create(value: { url: string }) {
      const node = super.create() as HTMLVideoElement;
      node.setAttribute("src", value.url);
      node.setAttribute("controls", "");
      node.setAttribute("class", "embedded-video");
      return node;
    }
    static value(node: HTMLVideoElement) {
      return { url: node.getAttribute("src") };
    }
  }

  class AudioEmbed extends BlockEmbed {
    static blotName = "customAudio";
    static tagName = "audio";
    static create(value: { url: string }) {
      const node = super.create() as HTMLAudioElement;
      node.setAttribute("src", value.url);
      node.setAttribute("controls", "");
      node.setAttribute("class", "embedded-audio");
      return node;
    }
    static value(node: HTMLAudioElement) {
      return { url: node.getAttribute("src") };
    }
  }

  class DocumentEmbed extends BlockEmbed {
    static blotName = "customDocument";
    static tagName = "a";
    static create(value: { url: string; name: string }) {
      const node = super.create() as HTMLAnchorElement;
      node.setAttribute("href", value.url);
      node.setAttribute("download", "");
      node.setAttribute("class", "embedded-document");
      node.setAttribute("contenteditable", "false");
      node.textContent = value.name;
      return node;
    }
    static value(node: HTMLAnchorElement) {
      return { url: node.getAttribute("href"), name: node.textContent };
    }
  }

  Quill.register(VideoEmbed);
  Quill.register(AudioEmbed);
  Quill.register(DocumentEmbed);
  blotsRegistered = true;
}

async function uploadFile(file: File): Promise<{ url: string; originalName: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Échec de l'upload.");
  return data;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    registerCustomFormats().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = containerRef.current;
    if (!root) return;

    const timer = window.setTimeout(() => {
      const titleMap: [string, string][] = [
        [".ql-bold", "Gras"],
        [".ql-italic", "Italique"],
        [".ql-underline", "Souligné"],
        [".ql-strike", "Barré"],
        [".ql-blockquote", "Citation"],
        [".ql-link", "Lien"],
        [".ql-image", "Insérer une image"],
        [".ql-customVideo", "Insérer une vidéo"],
        [".ql-customAudio", "Insérer un audio"],
        [".ql-customDocument", "Insérer un document téléchargeable"],
        [".ql-clean", "Effacer la mise en forme"],
        ['.ql-list[value="ordered"]', "Liste numérotée"],
        ['.ql-list[value="bullet"]', "Liste à puces"],
        [".ql-header", "Type de titre"],
        [".ql-font", "Police"],
        [".ql-size", "Taille du texte"],
        [".ql-color", "Couleur du texte"],
        [".ql-background", "Couleur de fond"],
        [".ql-align", "Alignement du texte"],
      ];
      titleMap.forEach(([selector, label]) => {
        root.querySelectorAll(selector).forEach((el) => el.setAttribute("title", label));
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [ready]);

  function triggerUpload(accept: string, kind: "image" | "customVideo" | "customAudio" | "customDocument") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { url, originalName } = await uploadFile(file);
        const editor = quillRef.current?.getEditor?.();
        if (!editor) return;
        const range = editor.getSelection(true) || { index: editor.getLength() };
        if (kind === "image") {
          editor.insertEmbed(range.index, "image", url, "user");
        } else if (kind === "customDocument") {
          editor.insertEmbed(range.index, "customDocument", { url, name: originalName }, "user");
        } else {
          editor.insertEmbed(range.index, kind, { url }, "user");
        }
        editor.setSelection(range.index + 1, 0, "user");
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(err instanceof Error ? err.message : "Échec de l'ajout du fichier.");
      }
    };
    input.click();
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          [{ font: [] }, { size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }, "blockquote", "link"],
          ["image", "customVideo", "customAudio", "customDocument"],
          ["clean"],
        ],
        handlers: {
          image: () => triggerUpload("image/*", "image"),
          customVideo: () => triggerUpload("video/*", "customVideo"),
          customAudio: () => triggerUpload("audio/*", "customAudio"),
          customDocument: () => triggerUpload("", "customDocument"),
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "blockquote",
    "link",
    "image",
    "customVideo",
    "customAudio",
    "customDocument",
  ];

  if (!ready) {
    return (
      <div className="rounded-lg border border-navy/20 p-4 text-sm text-navy/40">
        Chargement de l&apos;éditeur…
      </div>
    );
  }

  return (
    <div className="rich-editor" ref={containerRef}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
