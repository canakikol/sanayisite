import fs from "fs/promises";
import path from "path";
import { DEFAULT_CONTENT } from "./defaultContent";
import { ContactSubmission, SiteContent } from "@/types/content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...DEFAULT_CONTENT,
      ...parsed,
      brand: { ...DEFAULT_CONTENT.brand, ...(parsed.brand || {}) },
      hero: { ...DEFAULT_CONTENT.hero, ...(parsed.hero || {}) },
      aboutSection: {
        ...DEFAULT_CONTENT.aboutSection,
        ...(parsed.aboutSection || {}),
      },
      presidentSection: {
        ...DEFAULT_CONTENT.presidentSection,
        ...(parsed.presidentSection || {}),
      },
      boardSection: {
        ...DEFAULT_CONTENT.boardSection,
        ...(parsed.boardSection || {}),
      },
      missionVision: {
        ...DEFAULT_CONTENT.missionVision,
        ...(parsed.missionVision || {}),
        mission: {
          ...DEFAULT_CONTENT.missionVision.mission,
          ...(parsed.missionVision?.mission || {}),
        },
        vision: {
          ...DEFAULT_CONTENT.missionVision.vision,
          ...(parsed.missionVision?.vision || {}),
        },
      },
      statsSection: {
        ...DEFAULT_CONTENT.statsSection,
        ...(parsed.statsSection || {}),
      },
      membershipSection: {
        ...DEFAULT_CONTENT.membershipSection,
        ...(parsed.membershipSection || {}),
      },
      newsSection: {
        ...DEFAULT_CONTENT.newsSection,
        ...(parsed.newsSection || {}),
      },
      aboutPage: {
        ...DEFAULT_CONTENT.aboutPage,
        ...(parsed.aboutPage || {}),
      },
      contactSection: {
        ...DEFAULT_CONTENT.contactSection,
        ...(parsed.contactSection || {}),
      },
    };
  } catch {
    await ensureDir();
    await fs.writeFile(
      CONTENT_FILE,
      JSON.stringify(DEFAULT_CONTENT, null, 2),
      "utf8"
    );
    return DEFAULT_CONTENT;
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  await ensureDir();
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf8");
}

export async function readSubmissions(): Promise<ContactSubmission[]> {
  try {
    const raw = await fs.readFile(SUBMISSIONS_FILE, "utf8");
    return JSON.parse(raw) as ContactSubmission[];
  } catch {
    return [];
  }
}

export async function writeSubmissions(
  items: ContactSubmission[]
): Promise<void> {
  await ensureDir();
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(items, null, 2), "utf8");
}

