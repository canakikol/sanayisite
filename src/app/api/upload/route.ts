import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MTSD_DIR = path.join(process.cwd(), "public", "mtsd");

const ALLOWED_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
  ".gif",
]);

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const images: { url: string; name: string; folder: string }[] = [];

  for (const [dir, prefix] of [
    [UPLOAD_DIR, "/uploads"],
    [MTSD_DIR, "/mtsd"],
  ] as const) {
    try {
      const files = await fs.readdir(dir);
      for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        if (ALLOWED_EXT.has(ext)) {
          images.push({
            url: `${prefix}/${f}`,
            name: f,
            folder: prefix === "/uploads" ? "Yüklenenler" : "Varsayılan",
          });
        }
      }
    } catch {
      // ignore missing dir
    }
  }

  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Dosya bulunamadı." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json(
        { error: "Sadece JPG, PNG, WEBP, GIF veya SVG yüklenebilir." },
        { status: 400 }
      );
    }

    const safeBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 48);
    const filename = `${Date.now()}-${safeBase || "image"}${ext}`;

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);

    return NextResponse.json({ url: `/uploads/${filename}`, filename });
  } catch {
    return NextResponse.json(
      { error: "Dosya yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

