// data.ts
export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&h=900&fit=crop&auto=format";

export const NAV_LINKS = [
  { label: "Bienvenue", href: "/#hero" },
  {
    label: "À propos",
    href: "#", // Non cliquable
    children: [
      { label: "Qui sommes-nous ?", href: "/#apropos", icon: "quisommesnous" }, // Modifié pour pointer vers #apropos
      { label: "Nos atouts", href: "/#atouts", icon: "atouts" },
      { label: "Équipe", href: "/#equipe", icon: "equipe" },
      { label: "Nos services", href: "/#services", icon: "services" },
      { label: "Nos références", href: "/#references", icon: "references" },
    ],
  },
  { label: "Actualités", href: "/actualites" },
  { label: "Publications", href: "/publications" },
  { label: "Documentation", href: "/documentation" },
  { label: "Nous contacter", href: "/#contact" },
];

export const ATOUTS = [
  {
    title: "Sa stabilité",
    content:
      "La moyenne d'années passées au sein du cabinet TAX ADVISORY CONSULTANTS par les membres de l'équipe dédiée est d'au moins 04 ans. Cette statistique dénote la stabilité du personnel de la société, qui pour la grande majorité participe à sa croissance depuis plus de la moitié de son existence.",
  },
  {
    title: "Son expérience",
    content:
      "En raison de ses multiples interventions dans des secteurs distincts d'activité et sur des missions portant sur différents domaines de la fiscalité, de la douane, du juridique et du social, l'équipe de TAX ADVISORY CONSULTANTS jouit d'une expérience reconnue et établie.",
  },
  {
    title: "Sa qualification",
    content:
      "Dans le souci de procurer à ses clients une qualité de services irréprochable dans ses différents domaines d'intervention, la politique de recrutement de notre cabinet obéit aux standards internationaux. Tout le personnel technique est issu des meilleures universités du Cameroun et est titulaire de diplômes universitaires en Master de comptabilité et de fiscalité.",
  },
  {
    title: "Sa rigueur et son professionnalisme",
    content:
      "TAX ADVISORY CONSULTANTS est pleinement conscient du caractère sensible que constitue pour ses clients le conseil fiscal et met par conséquent un point d'honneur à délivrer des travaux ayant fait l'objet d'une analyse rigoureuse basée sur les dispositions légales, doctrinales et jurisprudences, ainsi que de plusieurs revues, offrant un gage de sécurité.",
  },
];

export const SERVICES = [
  {
    num: "01",
    title: "Conseil fiscal & douanier",
    desc: "Expertise en droit fiscal et douanier pour optimiser votre charge fiscale et assurer la conformité de vos opérations avec la réglementation CEMAC.",
  },
  {
    num: "02",
    title: "Droit des affaires",
    desc: "Accompagnement juridique complet dans la création, la structuration et le développement de vos activités commerciales au Cameroun et dans la zone CEMAC.",
  },
  {
    num: "03",
    title: "Droit de sécurité sociale",
    desc: "Conseil et assistance en matière de sécurité sociale : cotisations, déclarations, contrôles et contentieux avec les organismes de protection sociale.",
  },
  {
    num: "04",
    title: "Accompagnement entrepreneurial",
    desc: "Solutions personnalisées pour les entrepreneurs : audit fiscal, planification stratégique, assistance lors des contrôles fiscaux et représentation.",
  },
  {
    num: "05",
    title: "Audit & conformité",
    desc: "Révision de vos déclarations fiscales, audit de conformité réglementaire et mise en place de procédures internes pour sécuriser vos risques fiscaux.",
  },
  {
    num: "06",
    title: "Formation fiscale",
    desc: "Sessions de formation sur la législation fiscale camerounaise et CEMAC, destinées aux dirigeants, directeurs financiers et équipes comptables.",
  },
];

export const TEAM = [
  {
    name: "Boniface DJIMEGUE",
    role: "Associé gérant",
    detail: "Conseil Fiscal agréé CEMAC N° CF 314, ONCFC N° 22154",
    email: "bod@taxadvisoryconsultants.com",
    phone: "675 29 12 66 / 650 60 47 81",
    img: "/images/team/boniface.png"
  },
  {
    name: "Yvan NKAKLEU TIENTCHEU",
    role: "Responsable de mission, comptable et fiscaliste",
    detail: "Conseil fiscal stagiaire",
    email: "yvannkakleu@taxadvisoryconsultants.com",
    phone: "655 61 29 53",
    img: "/images/team/yvan.png"
  },
  {
    name: "Bertrand KOMBOU",
    role: "Responsable de mission, comptable et fiscaliste ",
    detail: "Conseil fiscal stagiaire",
    email: "bertrandkombou@taxadvisoryconsultants.com",
    phone: "690 22 60 33 / 677 33 33 58",
    img: "/images/team/bertrand.png"
  },
  {
    name: "Philippe DZITOUO NGOUAFONG",
    role: "Responsable de mission, comptable et fiscaliste",
    detail: "Conseil fiscal stagiaire",
    email: "philippedzitouo@taxadvisoryconsultants.com",
    phone: "693 65 09 02 / 676 05 43 21",
    img: "/images/team/philippe.png"
  },
  {
    name: "Christina Ornela WA DJIMEGUE",
    role: "Responsable de mission, comptable et fiscaliste",
    detail: "Conseil fiscal stagiaire",
    email: "christinawa@taxadvisoryconsultants.com",
    phone: "694 56 57 97 / 674 30 18 78",
    img: "/images/team/christina.png"
  },
  {
    name: "Williams NGOUNOU TANDJONG",
    role: "Responsable de mission, comptable et fiscaliste",
    detail: "Conseil fiscal stagiaire",
    email: "williamsngounou@taxadvisoryconsultants.com",
    phone: "690 22 60 33 / 677 33 33 58",
    img: "/images/team/williams.png"
  },
  {
    name: "Lionel TEMFACK",
    role: "Assistant",
    detail: "Collaborateur",
    email: "lioneltemfack@taxadvisoryconsultants.com",
    phone: "696 20 27 75",
    img: "/images/team/lionel.png"
  },
];

export const OBJET_SOCIAL = [
  "L'exercice de toutes activités de conseil fiscal.",
  "L'exercice de certaines activités de conseil juridique.",
  "La conception des logiciels des DSF système minimal de trésorerie.",
  "La conception des logiciels des DSF système normal.",
  "La conception des logiciels des DSF système microfinance.",
];

export const SECTEURS = [
  "Assurance",
  "Banque",
  "Commerce général",
  "Forêt",
  "Microfinances",
];

export const ZONES = [
  "Cameroun",
  "Tchad",
  "Gabon",
  "Congo Brazzaville",
  "Guinée Équatoriale",
  "République Centrafricaine",
];

export const REFERENCES = [
  { name: "Addax Petroleum", file: "addax-petroleum.png" },
  { name: "Afriassure", file: "afriassure.png" },
  { name: "Afrigroup", file: "afrigroup.png" },
  { name: "Afrilux", file: "afrilux.png" },
  { name: "AMT (Advanced Maritime Transports)", file: "amt.png" },
  { name: "Bechem Baiye", file: "bechem-baiye.png" },
  { name: "CCA Bank", file: "cca-bank.png" },
  { name: "CCA Bourse Capital Securities", file: "cca-bourse.png" },
  { name: "CCMM S.A", file: "ccmm.png" },
  { name: "Groupe Duval FFA", file: "groupe-duval-ffa.png" },
  { name: "Harvest Asset Management", file: "harvest-asset-management.png" },
  { name: "Intérima", file: "interima.png" },
  { name: "OCP", file: "ocp.png" },
  { name: "Oris Finance S.A", file: "oris-finance.png" },
  { name: "Red Brick", file: "red-brick.png" },
  { name: "Sefeccam", file: "sefeccam.png" },
  { name: "Smart Security Solutions", file: "smart-security.png" },
];

export function navLabelFor(label: string, t: { nav: Record<string, string> }): string {
  switch (label) {
    case "Bienvenue":
      return t.nav.welcome;
    case "À propos":
      return t.nav.about;
    case "Qui sommes-nous ?":
      return t.nav.whoWeAre || "Qui sommes-nous ?";
    case "Nos atouts":
      return t.nav.strengths;
    case "Nos services":
      return t.nav.services;
    case "Nos références":
      return t.nav.references;
    case "Équipe":
      return t.nav.team;
    case "Actualités":
      return t.nav.news;
    case "Publications":
      return t.nav.publications;
    case "Documentation":
      return t.nav.documentation;
    case "Nous contacter":
      return t.nav.contact;
    default:
      return label;
  }
}