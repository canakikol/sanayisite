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

export const BOARD_MEMBERS: BoardMember[] = [
  {
    slug: "ahmet-azun",
    name: "Ahmet AZUN",
    role: "Onursal Başkanımız",
    bio: "Mardin tekstil sanayisinin gelişimine öncülük eden vizyoner liderliğiyle derneğimizin kurumsal mirasına yön vermektedir.",
    image: "/mtsd/board-1.jpeg",
  },
  {
    slug: "aziz-bakay",
    name: "Aziz BAKAY",
    role: "Yönetim Kurulu Başkanı",
    bio: "Mardin'in üretim gücünü ve 6. Bölge yatırım avantajlarını küresel tekstil pazarlarıyla buluşturan dernek çalışmalarımıza liderlik etmektedir.",
    image: "/mtsd/board-2.jpg",
  },
  {
    slug: "bayram-karadeniz",
    name: "Bayram KARADENİZ",
    role: "Yönetim Kurulu Bşk. Yrd.",
    bio: "Üyeler arası sektörel iş birliği, B2B organizasyonlar ve bölgesel istihdamın artırılması süreçlerini koordine etmektedir.",
    image: "/mtsd/board-3.jpg",
  },
  {
    slug: "muhammed-taha-duyan",
    name: "Muhammed Taha DUYAN",
    role: "Yönetim Kurulu Bşk. Yrd.",
    bio: "Yenilikçi üretim teknolojileri, dijital dönüşüm ve ihracat odaklı büyüme projelerinde aktif rol almaktadır.",
    image: "/mtsd/board-4.jpeg",
  },
  {
    slug: "mehmet-can-kezer",
    name: "Mehmet Can KEZER",
    role: "Yönetim Kurulu Genel Sekreteri",
    bio: "Dernek tüzüğü, resmi kurumlarla koordinasyon, üyelik kabul ve idari süreçlerin yürütülmesinden sorumludur.",
    image: "/mtsd/board-5.jpeg",
  },
  {
    slug: "ramazan-taskan",
    name: "Ramazan TAŞKAN",
    role: "Yönetim Kurulu Saymanı",
    bio: "Derneğin mali planlama, bütçe yönetimi ve sürdürülebilir kurumsal kaynak süreçlerini yönetmektedir.",
    image: "/mtsd/board-6.jpeg",
  },
];

export const MEMBERSHIP_STEPS: MembershipStep[] = [
  {
    step: "01",
    title: "Başvuru Formu",
    desc: "Üyelik ön başvuru formunu eksiksiz bir şekilde doldurun.",
    image: "/mtsd/mardin-hero.webp",
  },
  {
    step: "02",
    title: "Ön Değerlendirme",
    desc: "Başvurunuz, yönetim kurulumuz tarafından dernek tüzüğüne uygunluk açısından incelenir.",
    image: "/mtsd/page-title-bg.jpg",
  },
  {
    step: "03",
    title: "Evrak ve Kayıt",
    desc: "Onaylanan başvurular için gerekli resmi evraklar tamamlanır ve resmi kayıt açılır.",
    image: "/mtsd/iletisim-bg.jpg",
  },
  {
    step: "04",
    title: "Ağımıza Katılın",
    desc: "Artık derneğimizin bir parçasısınız. Etkinlikler, fuarlar ve sektörel işbirliklerinden faydalanmaya başlayın.",
    image: "/mtsd/mardin-portrait.jpg",
  },
];

export const SECTOR_STATS = [
  {
    title: "Aktif Üretim Tesisi",
    desc: "Mardin OSB ve çevre sanayi bölgelerinde yüksek kapasiteli tekstil ve hazır giyim tesisleri.",
    value: "6. Bölge",
  },
  {
    title: "Sağlanan İstihdam",
    desc: "Bölgesel kalkınmaya sürdürülebilir katkı sağlayan nitelikli genç ve kadın istihdamı.",
    value: "Güçlü Ağ",
  },
  {
    title: "İhracat Odaklı Üretim",
    desc: "Orta Doğu ve Avrupa pazarlarına yönelik yüksek katma değerli fason ve marka üretimi.",
    value: "Global",
  },
  {
    title: "Yeşil Mutabakat & AR-GE",
    desc: "Yenilikçi üretim teknolojileri ve çevre dostu sanayi standartlarına tam uyum.",
    value: "2026",
  },
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: "ramazan-ayinin-manevi-ikliminde-cesitli-yardimlarda-bulunmanin-mutlulugunu-yasadik",
    title:
      "Ramazan ayının manevi ikliminde, çeşitli yardımlarda bulunmanın mutluluğunu yaşadık.",
    excerpt:
      "Mardin Tekstil Sanayicileri Derneği olarak Ramazan ayının paylaşma ve dayanışma ruhuyla ihtiyaç sahiplerinin yanında yer aldık.",
    content:
      "Ramazan ayının manevi ikliminde, dernek üyelerimizin katkılarıyla gerçekleştirdiğimiz sosyal sorumluluk ve yardım çalışmalarıyla bölgemizdeki ailelerle dayanışma içinde olmanın mutluluğunu yaşadık.",
    category: "Genel",
    date: "26 Şubat 2026",
    image: "/mtsd/news-ramazan.jpg",
  },
  {
    slug: "azunlar-enerjinin-fuar-standini-ziyarette-bulunduk",
    title: "Azunlar Enerji’nin fuar standını ziyarette bulunduk",
    excerpt:
      "Sektör paydaşlarımızla iş birliklerini güçlendirmek adına Azunlar Enerji'nin fuar standını ziyaret ederek verimli görüşmeler gerçekleştirdik.",
    content:
      "Mardin Tekstil Sanayicileri Derneği yönetimi olarak enerji ve sanayi alanındaki iş birliklerini değerlendirmek üzere Azunlar Enerji'nin fuar standını ziyaret ettik.",
    category: "Genel",
    date: "26 Şubat 2026",
    image: "/mtsd/news-azunlar.jpeg",
  },
];
