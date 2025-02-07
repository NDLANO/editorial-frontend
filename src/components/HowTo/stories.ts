/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentType } from "react";
import { MarkdownExample } from "./MarkdownExample";

export interface Story {
  title?: string;
  lead?: string;
  body?: (ImageBody | ComponentBody | TextBody | LinkBody)[];
}

interface Body<Type extends string, Content> {
  type: Type;
  content: Content;
}

type ImageBody = Body<"image", string>;
type ComponentBody = Body<"component", ComponentType>;
type TextBody = Body<"text", string>;
type LinkBody = Body<"link", { href: string; text: string }>;

export type StoryType =
  | "Paragraph"
  | "FactAside"
  | "Table"
  | "FramedContent"
  | "Details"
  | "Images"
  | "Videos"
  | "Audios"
  | "Podcasts"
  | "H5P"
  | "ResourceFromLink"
  | "File"
  | "RelatedArticle"
  | "userAgreements"
  | "userLicense"
  | "MetaKeyword"
  | "MetaDescription"
  | "VisualElement"
  | "TaxonomyContentTypes"
  | "TaxonomySubjectConnections"
  | "TaxonomyTopicConnections"
  | "TaxonomySubjectFilters"
  | "Markdown"
  | "CodeBlock"
  | "Concept"
  | "ConceptList"
  | "Pitch"
  | "status"
  | "ContactBlock"
  | "Grid"
  | "KeyFigure"
  | "Gloss"
  | "Disclaimer"
  | "Comment";

export const stories: Record<StoryType, Story> = {
  Paragraph: {
    title: "Paragraf",
    lead: "Dette lager en ny seksjon i teksten. Det skiller seg fra et hard linjeskrift..",
  },
  FactAside: {
    title: "Faktaboks",
    lead: "Les vår veiledning om bruk av faktaboks:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-faktaboks",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-faktaboks",
        },
      },
    ],
  },
  Table: {
    title: "Tabeller",
    lead: "Les vår veiledning om bruk av tabeller:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-tabell",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-tabell",
        },
      },
    ],
  },
  FramedContent: {
    title: "Tekst i ramme",
    lead: "Les vår veiledning om bruk av tektboks:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-tekst-i-ramme",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-tekst-i-ramme",
        },
      },
    ],
  },
  Details: {
    title: "Ekspanderbar boks",
    lead: "Les vår veiledning om bruk av ekspanderbar boks:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-ekspanderende-boks",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-ekspanderende-boks",
        },
      },
    ],
  },
  Images: {
    title: "Bilder",
    lead: "Les vår veiledning om bruk av bilder:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-bilde",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-bilde",
        },
      },
    ],
  },
  Videos: {
    title: "Video",
    lead: "Les vår veiledning om bruk av video fra Brightcove:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-video",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-video",
        },
      },
    ],
  },
  Audios: {
    title: "Lydfiler",
    lead: "Les vår veiledning om bruk av lyd:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-lyd",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-lyd",
        },
      },
    ],
  },
  Podcasts: {
    title: "Podkastepisoder",
    lead: "Les vår veiledning om bruk av podkast:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-podkastepisode",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-podkastepisode",
        },
      },
    ],
  },
  H5P: {
    title: "H5P",
    lead: "Les vår veiledning om bruk av H5P:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-h5p",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-h5p",
        },
      },
    ],
  },
  ResourceFromLink: {
    title: "Ressurs fra lenke?",
    lead: "Les vår veiledning om innbygging/lenkeplakat:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-ressurs-fra-lenke",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-ressurs-fra-lenke",
        },
      },
    ],
  },
  File: {
    title: "Last opp filer til artikkel:",
    lead: "Les vår veiledning om bruk av filer:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-fil",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-fil",
        },
      },
    ],
  },
  Disclaimer: {
    title: "Tilgjengelighetsinformasjon",
    lead: "Les vår veiledning om bruk av tilgjengelighetsknapp:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-kommentar",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-kommentar",
        },
      },
    ],
  },
  Gloss: {
    title: "Glosekort",
    lead: "Les vår veiledning om bruk av glosekort:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-glose",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-glose",
        },
      },
    ],
  },
  RelatedArticle: {
    title: "RelatedArticle",
    lead: "Les vår veiledning om bruk av relasjoner:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-relatert-innhold",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-relatert-innhold",
        },
      },
    ],
  },
  userAgreements: {
    title: "Avtaler",
    lead: "Avtaler beskriver lisensiering samt hvem som er rettighethavere, opphavspersoner m.m. for ressursen. I tilfeller hvor flere ressurser deler samme lisensiering anbefales det å bruke en avtale.",
    body: [
      {
        type: "text",
        content:
          'Du kan opprette nye avtaler ved å bruke hovedmenyen med pluss-tegnet oppe til venstre og så trykke på "avtale" knappen',
      },
    ],
  },
  userLicense: {
    title: "Lisenser",
    lead: "Alle ressurser skal merkes med en lisensiering. I NDLA ønsker vi å bidra til deling og gjenbruk. Vi bruker derfor åpne lisenser så langt det er mulig.",
    body: [
      {
        type: "text",
        content: "Vi skal også ivareta alle rettigheter til åndsverk. For mer informasjon se:",
      },
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/rammer-regler-og-lovverk/page/vi-bruker-cc-lisenser-pa-ndla",
          text: "https://kvalitet.ndla.no/books/rammer-regler-og-lovverk/page/vi-bruker-cc-lisenser-pa-ndla",
        },
      },
    ],
  },
  MetaKeyword: {
    title: "Nøkkelord",
    lead: "Nøkkelord hjelper søkemotorer og søk intern på ndla.no og finne relevant og riktig innhold. Et nyttig tips er å legge til synonymer for ord som brukt i teksten eller som er relevant for ressursen",
  },
  MetaDescription: {
    title: "Metabeskrivelse",
    lead: "Metabeskrivelsen gir kort informasjon om hva emnebeskrivelsen inneholder. Den skal brukes til utlisting både eksternt, i f.eks. Google og på sosiale medier, og i emnelister på ndla.no.",
    body: [
      {
        type: "text",
        content:
          "Den formuleres derfor slik at den er til hjelp både for de som søker på Internett, og for elevene våre når de orienterer seg på sidene våre og skaffer seg oversikt. Metabeskrivelsen bør beskrive essensen av innholdet og være en selvstendig tekst og er begrenset til 155 tegn.",
      },
    ],
  },
  VisualElement: {
    title: "Visuelt element",
    body: [
      {
        type: "text",
        content:
          "Visuelt element kan settes forskjellig for hvert språk. Dersom visuelt element ikke finnes vil det hentes automatisk fra et annet språk.",
      },
    ],
  },
  TaxonomyContentTypes: {
    title: "Innholdstyper",
    lead: "Alle ressurser må være merket med en innholdstype.",
  },
  TaxonomySubjectConnections: {
    title: "Emnetilknytninger",
    lead: "For at en ressurs skal bli tilgjengelig i meny må den tilknyttes et (eller flere) emne.",
  },
  TaxonomyTopicConnections: {
    title: "Emneplassering",
    lead: "Her kan du velge hvor emnet skal ligge i taksonomi.",
    body: [
      {
        type: "text",
        content:
          "OBS! Dersom du endrer plassering i taksonomi, vil ikke det gamle emnet slettes om det har underemner eller ressurser knyttet til seg.",
      },
    ],
  },
  TaxonomySubjectFilters: {
    title: "Fagfilter",
    lead: "Alle ressurser må ha ett eller fagfilter. Fagfilterene du kan velge mellom blir gitt utfra emnetilknytningen og derav faget det tilhører. Itillegg til å velge fagfilter kan velge om ressursen skal være tilleggsstoff og kjernestoff under hvert av fagfilterene.",
  },
  status: {
    title: "Forklaring for ulike statuser",
    lead: "I arbeid er en status der mange kan være involvert. Andre statuser er tiltenkt ulike aktører i ulike faser.",
  },
  Markdown: {
    title: "Markdown",
    body: [
      {
        type: "component",
        content: MarkdownExample,
      },
    ],
  },
  CodeBlock: {
    title: "CodeBlock",
    lead: "Les vår veiledning om bruk av kodeblokk:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-kodevisning",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-kodevisning",
        },
      },
    ],
  },
  Concept: {
    title: "Forklaring",
    lead: "Legg til forklaring.",
    body: [
      {
        type: "text",
        content: "Søk opp og legg til forklaring som blokkvisning i artikkel.",
      },
    ],
  },
  Comment: {
    title: "Kommentar",
    lead: "Les vår veiledning om bruk av kommentarer:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-kommentar-1",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-kommentar-1",
        },
      },
    ],
  },
  ConceptList: {
    title: "Forklaringsliste",
    lead: "Legg til forklaringsliste.",
    body: [
      {
        type: "text",
        content: "Legg til en liste av forklaringer som blokkvisning i artikkel.",
      },
    ],
  },
  Pitch: {
    title: "Pitch",
    lead: "Legg til en pitch",
    body: [
      {
        type: "text",
        content: "Lim inn lenke til artikkel og legg til tittel for å generere en pitch.",
      },
    ],
  },
  ContactBlock: {
    title: "Kontaktblokk",
    lead: "Legg til kontaktblokk",
    body: [
      {
        type: "text",
        content: "Lag en kontaktblokk ved å legge til tittel, beskrivelse og bilde.",
      },
    ],
  },
  Grid: {
    title: "Grid",
    lead: "Les vår veiledning om bruk av bildegrid:",
    body: [
      {
        type: "link",
        content: {
          href: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-grid",
          text: "https://kvalitet.ndla.no/books/produsere-innhold-i-ed/page/innholdsblokker-i-artikkel#bkmrk-grid",
        },
      },
    ],
  },
  KeyFigure: {
    title: "Nøkkeltall",
    lead: "Legg til nøkkeltall",
    body: [
      {
        type: "text",
        content: "Embed for å kunne legge til nøkkelinformasjon i form av bilde, tittel og deltittel.",
      },
    ],
  },
};
