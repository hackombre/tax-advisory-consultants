import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { isAuthenticated } from "@/lib/auth";
import {
  syncUploadToGitHub,
} from "@/lib/github-storage";

export async function POST(
  req: NextRequest
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      {
        error: "Non autorisé.",
      },
      { status: 401 }
    );
  }

  try {
    const formData =
      await req.formData();

    const file =
      formData.get("file") as
        | File
        | null;

    if (!file) {
      return NextResponse.json(
        {
          error:
            "Aucun fichier fourni.",
        },
        { status: 400 }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    /*
     * On limite l'extension afin d'éviter
     * des noms de fichiers dangereux.
     */
    const originalExt =
      path.extname(file.name);

    const safeExt =
      originalExt
        .replace(/[^a-zA-Z0-9.]/g, "")
        .slice(0, 10);

    const filename =
      `${Date.now()}-` +
      `${Math.random()
        .toString(36)
        .slice(2, 8)}` +
      safeExt;

    /*
     * Sauvegarde locale immédiate.
     * Cela permet au fichier d'être disponible
     * sans attendre un éventuel redéploiement.
     */
    const uploadsDir =
      path.join(
        process.cwd(),
        "public",
        "uploads"
      );

    if (
      !fs.existsSync(
        uploadsDir
      )
    ) {
      fs.mkdirSync(
        uploadsDir,
        {
          recursive: true,
        }
      );
    }

    const localPath =
      path.join(
        uploadsDir,
        filename
      );

    fs.writeFileSync(
      localPath,
      buffer
    );

    /*
     * Chemin dans le dépôt GitHub.
     *
     * IMPORTANT :
     * ce chemin est relatif à la racine
     * du dépôt GitHub.
     */
    const githubPath =
      `front/public/uploads/${filename}`;

    try {
      await syncUploadToGitHub(
        githubPath,
        buffer,
        `Ajout du document ${filename}`
      );
    } catch (githubError) {
      console.error(
        "Erreur upload GitHub:",
        githubError
      );

      /*
       * On supprime le fichier local si GitHub
       * n'a pas pu le sauvegarder.
       *
       * Ainsi on ne donne pas l'impression
       * que le fichier est durable alors qu'il
       * risque de disparaître au redémarrage.
       */
      try {
        if (
          fs.existsSync(localPath)
        ) {
          fs.unlinkSync(
            localPath
          );
        }
      } catch {
        // Rien à faire si le nettoyage échoue.
      }

      return NextResponse.json(
        {
          error:
            "Le fichier n'a pas pu être sauvegardé durablement sur GitHub.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url:
        `/uploads/${filename}`,

      originalName:
        file.name,

      persisted:
        true,
    });
  } catch (error) {
    console.error(
      "Erreur upload:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de téléverser le fichier.",
      },
      { status: 500 }
    );
  }
}
