import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { readSubmissions, writeSubmissions } from "@/lib/contentStore";
import { ContactSubmission } from "@/types/content";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const items = await readSubmissions();
  return NextResponse.json({ submissions: items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, inquiry, message } = body as {
      name?: string;
      phone?: string;
      email?: string;
      inquiry?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Ad soyad ve e-posta zorunludur." },
        { status: 400 }
      );
    }

    const current = await readSubmissions();
    const item: ContactSubmission = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      phone: (phone || "").trim(),
      email: email.trim(),
      inquiry: (inquiry || "").trim(),
      message: (message || "").trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    await writeSubmissions([item, ...current]);
    return NextResponse.json({ ok: true, id: item.id });
  } catch {
    return NextResponse.json({ error: "Başvuru kaydedilemedi." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { id, read } = (await req.json()) as { id: string; read: boolean };
    const current = await readSubmissions();
    const updated = current.map((s) => (s.id === id ? { ...s, read } : s));
    await writeSubmissions(updated);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
    }
    const current = await readSubmissions();
    await writeSubmissions(current.filter((s) => s.id !== id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Silinemedi." }, { status: 400 });
  }
}

