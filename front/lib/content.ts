import type { Language } from "@/context/LanguageContext";

export const translations = {
  fr: {
    nav: {
      welcome: "Bienvenue",
      about: "À propos",
      whoWeAre: "Qui sommes-nous ?",
      strengths: "Nos atouts",
      services: "Nos services",
      references: "Nos références",
      team: "Équipe",
      news: "Actualités",
      publications: "Publications",
      documentation: "Documentation",
      contact: "Nous contacter",
    },
    hero: {
      eyebrow: "La référence fiscale dans l’espace CEMAC — particulièrement au Cameroun",
      ctaPrimary: "Découvrir nos services",
      ctaSecondary: "Nous contacter",
      subtitle: "Cabinet de conseil fiscal agréé CEMAC sous le numéro SCF 027 et inscrit à l’Ordre National des Conseils Fiscaux du Cameroun (ONCFC) sous le numéro 2213.",
    },
    about: {
      eyebrow: "Qui sommes-nous ?",
      title: "Un cabinet de conseil",
      titleItalic: "à votre chevet",
      intro: " est un cabinet de conseil fiscal agréé CEMAC sous le numéro SCF 027, inscrit à l’Ordre National des Conseils Fiscaux du Cameroun sous le numéro 2213.",
      body1: "Il offre des services spécialisés en droit fiscal et douanier, en droit des affaires et en droit de sécurité sociale. Nous avons acquis une expérience avérée dans le milieu des affaires au Cameroun depuis de nombreuses années, à travers de multiples missions réalisées auprès d’une clientèle nationale et sous-régionale.",
      body2: "Nous offrons une expertise personnalisée, des solutions innovantes et un engagement total pour l’accompagnement de nos clients.",
      stats: [
        { value: "SCF 027", label: "Agrément CEMAC" },
        { value: "2213", label: "N° ONCFC" },
        { value: "2021", label: "Date de création" },
      ],
      badge: "Engagement client",
    },
    atouts: {
      eyebrow: "Nos atouts",
      title: "Une assistance de proximité",
      titleItalic: "avec pour ambition d’être à vos côtés",
      intro: "Notre équipe technique se caractérise par :",
      items: [
        {
          title: "Sa stabilité",
          content:
            "La moyenne d’années passées au sein du cabinet TAX ADVISORY CONSULTANTS par les membres de l’équipe dédiée est d’au moins 04 ans. Cette statistique dénote la stabilité du personnel de la société, qui pour la grande majorité participe à sa croissance depuis plus de la moitié de son existence.",
        },
        {
          title: "Son expérience",
          content:
            "En raison de ses multiples interventions dans des secteurs distincts d’activité et sur des missions portant sur différents domaines de la fiscalité, de la douane, du juridique et du social, l’équipe de TAX ADVISORY CONSULTANTS jouit d’une expérience reconnue et établie.",
        },
        {
          title: "Sa qualification",
          content:
            "Dans le souci de procurer à ses clients une qualité de services irréprochable dans ses différents domaines d’intervention, la politique de recrutement de notre cabinet obéit aux standards internationaux. Tout le personnel technique est issu des meilleures universités du Cameroun et est titulaire de diplômes universitaires en Master de comptabilité et de fiscalité.",
        },
        {
          title: "Sa rigueur et son professionnalisme",
          content:
            "TAX ADVISORY CONSULTANTS est pleinement conscient du caractère sensible que constitue pour ses clients le conseil fiscal et met par conséquent un point d’honneur à délivrer des travaux ayant fait l’objet d’une analyse rigoureuse basée sur les dispositions légales, doctrinales et jurisprudences, ainsi que de plusieurs revues, offrant un gage de sécurité.",
        },
      ],
    },
    team: {
      eyebrow: "Notre équipe",
      title: "Des experts à votre service",
      intro: "Une équipe pluridisciplinaire dédiée à l’excellence fiscale et juridique au Cameroun et dans l’espace CEMAC.",
      members: [
        {
          role: "Associé gérant",
          detail: "Conseil Fiscal agréé CEMAC N° CF 314, ONCFC N° 22154",
        },
        {
          role: "Responsable de mission, comptable et fiscaliste",
          detail: "Conseil fiscal stagiaire",
        },
        {
          role: "Responsable de mission, comptable et fiscaliste",
          detail: "Conseil fiscal stagiaire",
        },
        {
          role: "Responsable de mission, comptable et fiscaliste",
          detail: "Conseil fiscal stagiaire",
        },
        {
          role: "Responsable de mission, comptable et fiscaliste",
          detail: "Conseil fiscal stagiaire",
        },
        {
          role: "Responsable de mission, comptable et fiscaliste",
          detail: "Conseil fiscal stagiaire",
        },
        {
          role: "Assistant",
          detail: "Collaborateur",
        },
      ],
    },
    services: {
      eyebrow: "Nos services",
      title: "L’excellence dans",
      titleItalic: "l’accompagnement des entrepreneurs",
      intro: "Tax Advisory Consultants s’engage à satisfaire sa clientèle à travers son professionnalisme avéré, son exigence et son engagement total. Nous vous proposons une multitude de services variés.",
      items: [
        {
          title: "Conseil fiscal & douanier",
          desc: "Expertise en droit fiscal et douanier pour optimiser votre charge fiscale et assurer la conformité de vos opérations avec la réglementation CEMAC.",
        },
        {
          title: "Droit des affaires",
          desc: "Accompagnement juridique complet dans la création, la structuration et le développement de vos activités commerciales au Cameroun et dans la zone CEMAC.",
        },
        {
          title: "Droit de sécurité sociale",
          desc: "Conseil et assistance en matière de sécurité sociale : cotisations, déclarations, contrôles et contentieux avec les organismes de protection sociale.",
        },
        {
          title: "Accompagnement entrepreneurial",
          desc: "Solutions personnalisées pour les entrepreneurs : audit fiscal, planification stratégique, assistance lors des contrôles fiscaux et représentation.",
        },
        {
          title: "Audit & conformité",
          desc: "Révision de vos déclarations fiscales, audit de conformité réglementaire et mise en place de procédures internes pour sécuriser vos risques fiscaux.",
        },
        {
          title: "Formation fiscale",
          desc: "Sessions de formation sur la législation fiscale camerounaise et CEMAC, destinées aux dirigeants, directeurs financiers et équipes comptables.",
        },
      ],
    },
    references: {
      eyebrow: "Nos références",
      title: "Ils nous font confiance",
      intro: "Des entreprises de référence nous accordent leur confiance pour les accompagner dans leurs démarches fiscales et juridiques.",
      footer: "Et bien d’autres partenaires à travers le Cameroun et la zone CEMAC",
    },
    sectors: {
      eyebrow: "Présentation juridique",
      title: "Un cadre juridique clair et transparent",
      objetSocial: "Objet social",
      secteurs: "Nos secteurs d’activités",
      zones: "Zones d’intervention",
      contactTitle: "Besoin d’un conseil ?",
      contactBody: "Notre équipe est disponible pour répondre à toutes vos questions fiscales et juridiques.",
      cta: "Prendre contact",
      objetSocialItems: [
        "L’exercice de toutes activités de conseil fiscal.",
        "L’exercice de certaines activités de conseil juridique.",
        "La conception des logiciels des DSF système minimal de trésorerie.",
        "La conception des logiciels des DSF système normal.",
        "La conception des logiciels des DSF système microfinance.",
      ],
      sectorItems: ["Assurance", "Banque", "Commerce général", "Forêt", "Microfinances"],
      zoneItems: ["Cameroun", "Tchad", "Gabon", "Congo Brazzaville", "Guinée Équatoriale", "République Centrafricaine"],
    },
    contact: {
      eyebrow: "Nous contacter",
      title: "Parlons de",
      titleItalic: "votre projet",
      intro: "Notre équipe est disponible pour vous accompagner dans toutes vos démarches fiscales et juridiques. N’hésitez pas à nous solliciter.",
      infoLabel: "Adresse",
      phoneLabel: "Téléphone",
      emailLabel: "E-mail",
      firstName: "Prénom",
      lastName: "Nom de famille",
      phone: "Téléphone",
      message: "Message",
      submit: "Envoyer le message",
      loading: "Envoi en cours...",
      success: "✓ Merci pour votre envoi ! Nous reviendrons vers vous rapidement.",
      error: "✕ Une erreur est survenue. Réessayez ou contactez-nous directement par téléphone.",
      placeholder: "+237",
    },
    footer: {
      navigation: "Navigation",
      contact: "Contact",
      copyright: "© {year} Tax Advisory Consultants. Tous droits réservés.",
      tagline: "La référence fiscale dans l’espace CEMAC",
    },
    language: {
      switchLabel: "FR",
      switchLabelAlt: "EN",
    },
  },
  en: {
    nav: {
      welcome: "Home",
      about: "About",
      whoWeAre: "Who are we?",
      strengths: "Our strengths",
      services: "Our services",
      references: "Our references",
      team: "Team",
      news: "News",
      publications: "Publications",
      documentation: "Documentation",
      contact: "Contact us",
    },
    hero: {
      eyebrow: "The tax reference in the CEMAC space — especially in Cameroon",
      ctaPrimary: "Discover our services",
      ctaSecondary: "Contact us",
      subtitle: "Tax consultancy firm accredited by CEMAC (No. SCF 027) and registered with the National Order of Tax Consultants of Cameroon (ONCFC) under No. 2213.",
    },
    about: {
      eyebrow: "Who we are ?",
      title: "A consulting firm",
      titleItalic: "at your side",
      intro: " is a CEMAC-approved tax advisory firm under registration number SCF 027, registered with the National Order of Tax Advisors of Cameroon under number 2213.",
      body1: "It provides specialized services in tax and customs law, business law, and social security law. We have built strong experience in the business environment in Cameroon over many years through numerous assignments for both national and subregional clients.",
      body2: "We offer personalized expertise, innovative solutions, and full commitment to supporting our clients.",
      stats: [
        { value: "SCF 027", label: "CEMAC accreditation" },
        { value: "2213", label: "N° ONCFC" },
        { value: "2021", label: "Creation date" },
      ],
      badge: "Client commitment",
    },
    atouts: {
      eyebrow: "Our strengths",
      title: "A close support approach",
      titleItalic: "with the ambition to stand by your side",
      intro: "Our technical team is characterized by:",
      items: [
        {
          title: "Its stability",
          content:
            "The average number of years spent within TAX ADVISORY CONSULTANTS by members of the dedicated team is at least 04 years. This statistic reflects the stability of the company's staff, most of whom have contributed to its growth for more than half of its existence.",
        },
        {
          title: "Its experience",
          content:
            "Because of its many interventions across different sectors and assignments covering various areas of taxation, customs, legal matters, and social security, the TAX ADVISORY CONSULTANTS team enjoys recognized and established experience.",
        },
        {
          title: "Its qualifications",
          content:
            "In order to provide clients with impeccable service quality across its fields of intervention, our firm's recruitment policy follows international standards. All technical staff come from the best universities in Cameroon and hold university degrees in Master's studies in accounting and taxation.",
        },
        {
          title: "Its rigor and professionalism",
          content:
            "TAX ADVISORY CONSULTANTS is fully aware of the sensitive nature of tax advisory for its clients and therefore takes great care to deliver work that has been rigorously analyzed based on legal, doctrinal, and jurisprudential provisions, as well as several reviews, providing a strong guarantee of security.",
        },
      ],
    },
    team: {
      eyebrow: "Our team",
      title: "Experts at your service",
      intro: "A multidisciplinary team dedicated to tax and legal excellence in Cameroon and the CEMAC region.",
      members: [
        {
          role: "Managing partner",
          detail: "CEMAC tax adviser No. CF 314, ONCFC No. 22154",
        },
        {
          role: "Mission leader, accountant, and tax specialist",
          detail: "Trainee tax adviser",
        },
        {
          role: "Mission leader, accountant, and tax specialist",
          detail: "Trainee tax adviser",
        },
        {
          role: "Mission leader, accountant, and tax specialist",
          detail: "Trainee tax adviser",
        },
        {
          role: "Mission leader, accountant, and tax specialist",
          detail: "Trainee tax adviser",
        },
        {
          role: "Mission leader, accountant, and tax specialist",
          detail: "Trainee tax adviser",
        },
        {
          role: "Assistant",
          detail: "Collaborator",
        },
      ],
    },
    services: {
      eyebrow: "Our services",
      title: "Excellence in",
      titleItalic: "supporting entrepreneurs",
      intro: "Tax Advisory Consultants is committed to satisfying its clients through proven professionalism, rigor, and total engagement. We offer a wide range of services.",
      items: [
        {
          title: "Tax and customs advisory",
          desc: "Expertise in tax and customs law to optimize your tax burden and ensure compliance of your operations with CEMAC regulations.",
        },
        {
          title: "Business law",
          desc: "Comprehensive legal support for the creation, structuring, and development of commercial activities in Cameroon and the CEMAC region.",
        },
        {
          title: "Social security law",
          desc: "Advice and assistance in social security matters: contributions, declarations, audits, and disputes with social protection bodies.",
        },
        {
          title: "Entrepreneurial support",
          desc: "Tailored solutions for entrepreneurs: tax audits, strategic planning, assistance during tax inspections, and representation.",
        },
        {
          title: "Audit & compliance",
          desc: "Review of your tax filings, regulatory compliance audits, and implementation of internal procedures to reduce your tax risks.",
        },
        {
          title: "Tax training",
          desc: "Training sessions on Cameroon and CEMAC tax legislation for directors, finance managers, and accounting teams.",
        },
      ],
    },
    references: {
      eyebrow: "Our references",
      title: "They trust us",
      intro: "Leading companies place their trust in us to support them in their tax and legal matters.",
      footer: "And many other partners across Cameroon and the CEMAC region",
    },
    sectors: {
      eyebrow: "Legal presentation",
      title: "A clear and transparent legal framework",
      objetSocial: "Corporate purpose",
      secteurs: "Our business sectors",
      zones: "Operational zones",
      contactTitle: "Need advice?",
      contactBody: "Our team is available to answer all your tax and legal questions.",
      cta: "Get in touch",
      objetSocialItems: [
        "The exercise of all tax advisory activities.",
        "The exercise of certain legal advisory activities.",
        "The design of DSF software for minimal treasury systems.",
        "The design of DSF software for standard systems.",
        "The design of DSF software for microfinance systems.",
      ],
      sectorItems: ["Insurance", "Banking", "General trade", "Forestry", "Microfinance"],
      zoneItems: ["Cameroon", "Chad", "Gabon", "Republic of the Congo", "Equatorial Guinea", "Central African Republic"],
    },
    contact: {
      eyebrow: "Contact us",
      title: "Let's talk about",
      titleItalic: "your project",
      intro: "Our team is available to support you in all your tax and legal matters. Feel free to reach out.",
      infoLabel: "Address",
      phoneLabel: "Phone",
      emailLabel: "E-mail",
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone",
      message: "Message",
      submit: "Send message",
      loading: "Sending...",
      success: "✓ Thank you for your message! We will get back to you shortly.",
      error: "✕ An error occurred. Please try again or contact us directly by phone.",
      placeholder: "+237",
    },
    footer: {
      navigation: "Navigation",
      contact: "Contact",
      copyright: "© {year} Tax Advisory Consultants. All rights reserved.",
      tagline: "The tax reference in the CEMAC space",
    },
    language: {
      switchLabel: "FR",
      switchLabelAlt: "EN",
    },
  },
} as const;

export function getText<T extends keyof typeof translations.fr>(section: T, lang: Language) {
  return translations[lang][section];
}