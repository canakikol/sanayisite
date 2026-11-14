import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/contentStore";
import { SiteContent } from "@/types/content";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as SiteContent;
    if (!body || !body.brand || !body.hero) {
      return NextResponse.json(
        { error: "Geçersiz içerik verisi." },
        { status: 400 }
      );
    }

    await writeContent(body);
    revalidatePath("/", "layout");
    revalidatePath("/hakkimizda");
    revalidatePath("/yonetim-kurulumuz");
    revalidatePath("/haberler");
    revalidatePath("/iletisim");

    return NextResponse.json({ ok: true, content: body });
  } catch {
    return NextResponse.json(
      { error: "İçerik kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}

