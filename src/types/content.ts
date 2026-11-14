export interface BoardMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
}

export interface MembershipStep {
  step: string;
  title: string;
  desc: string;
  image: string;
}

export interface SectorStat {
  title: string;
  desc: string;
  value: string;
}

export interface SiteContent {
  brand: {
    siteTitle: string;
    siteDescription: string;
    logoDark: string;
    logoLight: string;
    phone: string;
    email: string;
    address: string;
    footerDesc: string;
    copyright: string;
    ctaLabel: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: string;
    imagePosition: string;
  };
  aboutSection: {
    eyebrow: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    buttonLabel: string;
    image: string;
    imagePosition: string;
  };
  presidentSection: {
    eyebrow: string;
    nameAndRole: string;
    message: string;
    buttonLabel: string;
    image: string;
  };
  boardSection: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    members: BoardMember[];
  };
  missionVision: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    mission: {
      eyebrow: string;
      title: string;
      description: string;
      image: string;
      imagePosition: string;
    };
    vision: {
      eyebrow: string;
      title: string;
      description: string;
      image: string;
      imagePosition: string;
    };
  };
  statsSection: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    items: SectorStat[];
  };
  membershipSection: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    steps: MembershipStep[];
  };
  newsSection: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    articles: NewsArticle[];
  };
  aboutPage: {
    heroEyebrow: string;
    heroTitle: string;
    heroHighlight: string;
    heroLead: string;
    bodyEyebrow: string;
    bodyTitle: string;
    bodyHighlight: string;
    paragraph1: string;
    paragraph2: string;
  };
  contactSection: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    image: string;
    topics: string[];
  };
}

export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  inquiry: string;
  message: string;
  createdAt: string;
  read: boolean;
}

