import {
  NextRequest,
  NextResponse,
} from "next/server";

import fs from "fs";
import path from "path";

import { isAuthenticated } from "@/lib/auth";
import { syncUploadToGitHub } from "@/lib/github-storage";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE =
  20 * 1024 * 1024; // 20 MB

export async function POST(
  req: NextRequest
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      {
        error: "Non autorisé.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const formData = await req.formData();

    const file =
      formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          error:
            "Aucun fichier fourni.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Le fichier ne doit pas dépasser 20 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

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
     */
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    if (
      !fs.existsSync(uploadsDir)
    ) {
      fs.mkdirSync(
        uploadsDir,
        {
          recursive: true,
        }
      );
    }

    fs.writeFileSync(
      path.join(
        uploadsDir,
        filename
      ),
      buffer
    );

    /*
     * Sauvegarde permanente dans GitHub.
     */
    await syncUploadToGitHub(
      filename,
      buffer,
      `content: upload ${filename}`
    );

    return NextResponse.json({
      url: `/uploads/${filename}`,
      originalName: file.name,
      savedToGitHub: true,
    });
  } catch (error) {
    console.error(
      "Erreur upload:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Le fichier n'a pas pu être sauvegardé.",
        details:
          error instanceof Error
            ? error.message
            : "Erreur inconnue",
      },
      {
        status: 500,
      }
    );
  }
}
