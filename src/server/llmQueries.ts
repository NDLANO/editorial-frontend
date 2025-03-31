/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

interface SummaryVariables {
  type: "summary";
  text: string;
  title: string;
}

interface AlttextVariables {
  type: "alttext";
  image: {
    fileType: string;
    base64: string;
  };
}

interface ReflectionVariables {
  type: "reflection";
  text: string;
}

interface MetaDescriptionVariables {
  type: "metaDescription";
  text: string;
  title: string;
}

interface AlternativePhrasingVariables {
  type: "alternativePhrasing";
  text: string;
  excerpt: string;
}

export type PromptVariables =
  | SummaryVariables
  | AlttextVariables
  | ReflectionVariables
  | MetaDescriptionVariables
  | AlternativePhrasingVariables;

type LanguageCode = "nn" | "nb" | "en";

type ArticleSummaryQuery = Record<LanguageCode, (text: string, title: string) => string>;

const ARTICLE_SUMMARY_QUERY: ArticleSummaryQuery = {
  nb: (text: string, title: string) => `<draft> ${text} </draft>
        <Instructions>
          Du har lang erfaring fra utdanningssektoren.
          Du har spesialisert deg i å oppsummere fagartikler for å gjøre dem mer tilgjengelige for et bredere publikum.
          Du har fått som oppdrag å hjelpe med å forbedre læringsopplevelsen for elevene.
          For å gjøre dette må du lese gjennom og lage en oppsummering av artikler sånn at videregåendestudentene lett kan få et inntrykk av de viktigste poengene i artikkelen.
          Du har fått som oppdrag å lese gjennom artikkelen i <draft> med tittel "${title}" og skrive en oppsummering på NB. Oppsummeringen skal være på mindre enn 300 ord.
          Svaret skal leveres med refleksjoner på hvorfor du har valgt å inkludere de punktene du har valgt først, så selve oppsummeringen skrevet i en <answer>-tag.
          Om du ikke klarer å levere svaret på formatet <answer> som er spesifisert skal første linje i responsen være <ERROR>-tag.
        </Instructions>`,
  en: (text: string, title: string) => `<draft>${text}</draft>
        <Instructions>
          You have an extensive experience from the educational sector.
          You are specialized in summarizing educational articles to make them more accessible for a wider audience.
          Your task is to help improving the learning experience for the students.
          To achieve this you have to read and summarize articles in a way that high school students can easily gain an impression of the most important points in the article.
          Your task is to read through the article in <draft> with title "${title}" and write a summary in EN. The summary must be in less than 300 words.
          The response must be given with reflections as to why you have chosen to include the selected points first, then the summary in an <answer>-tag.
          If you cannot deliver the answer in the given format <answer>, the first line in the response should be <ERROR>-tag.
        </Instructions>`,
  nn: (text: string, title: string) => `<draft>${text}</draft>
          <Instructions>
          Du har lang erfaring frå utdanningssektoren.
          Du har spesialisert deg i å oppsummere fagartiklar for å gjere dei meir tilgjengeleg for eit større publikum.
          Du har fått som oppdrag å hjelpe med å forbetre læringsopplevelsen for elevane.
          For å gjere dette må du lese igjennom og lage ei oppsummering av artiklar så vidaregåandestudentane lett kan få eit inntrykk av dei viktigaste poenga i artikkelen.
          Du har fått i oppgåve å lese gjennom artikkelen i <draft> med tittel "${title}" og skrive ei oppsummering på NN. Oppsummeringa skal vere på mindre enn 300 ord.
          Svaret skal leverast med refleksjonar på kvifor du har valt å inkludere dei punkta du har valt først, så sjølve oppsummeringa skrive i ein <answer>-tag.
          Om du ikkje klarar å levere svaret på formatet <answer> som er spesifisert skal fyrste linje i responsen vere <ERROR>-tag.
        </Instructions>`,
};

type MetaDescriptionQuery = Record<LanguageCode, (text: string, title: string) => string>;

const META_DESCRIPTION_QUERY: MetaDescriptionQuery = {
  nb: (text: string, title: string) => `<draft>${text}</draft>
        <Instructions>
          Du har lang erfaring fra utdanningssektoren.
          Du er spesialist i å finne gode måter å beskrive fagartikler på, slik at man fra en kort oppsummering klarer å forstå hva artiklene handler om.
          Du har fått som oppdrag å lese gjennom artikkelen i <draft> med tittel "${title}" og skrive en metabeskrivelse av artikkelen på NB. Metabeskrivelsen skal være på mindre enn 15 ord.
          Svaret skal leveres med refleksjoner på hvorfor du har valgt å inkludere de punktene du har valgt først, så selve metabeskrivelsen skrevet i en <answer>-tag.
          Om du ikke klarer å levere svaret på formatet <answer> som er spesifisert skal første linje i responsen være <ERROR>-tag.
        </Instructions>`,
  en: (text: string, title: string) => `<draft>${text}</draft>
        <Instructions>
          You have an extensive experience from the educational sector.
          You are specialized in finding good ways to describe educational articles, in a way that the reader can understand what the article is about from a very short summary.
          Your task is to read through the article in <draft> with title ${title} and write meta description in EN. The meta description must be in less than 15 words.
          The response must be given with reflections as to why you have chosen to include the selected points first, then the meta description in an <answer>-tag.
          If you can not deliver the answer in the given format <answer>, the first line in the response should be <ERROR>-tag.
        </Instructions>`,
  nn: (text: string, title: string) => `<draft> ${text} </draft>
        <Instructions>
          Du har lang erfaring frå utdanningssektoren.
          Du er spesialist i å finne gode måter å skildre fagartiklar på, slik at man frå ein kort oppsummering kan forstå kva artikkelen handlar om.
          Du har fått i oppgåve å lese igjennom artikkelen i <draft> med tittel ${title} og skrive ein metabeskriving av artikkelen på NN. Metabeskrivinga skal vere på mindre enn 15 ord.
          Svaret skal leverast med refleksjonar på kvifor du har valt å inkludere dei punktane du har valt først, så selve metabeskrivinga skreve i ein <answer>-tag. 
          Om du ikkje klarar å levere svaret på formatet <answer> som er spesifisert skal fyrste linje i responsen vere <ERROR>-tag.
        </Instructions>`,
};

type AlternativePhrasingQuery = Record<LanguageCode, (text: string, excerpt: string) => string>;

const ALTERNATIVE_PRHASING_QUERY: AlternativePhrasingQuery = {
  nb: (text: string, excerpt: string) => `<excerpt>${excerpt}</excerpt>
        <draft>${text}</draft>
        <Instructions>
          Du har lang erfaring fra utdanningssektoren. Du er spesialist i å renskrive fagartikler for å forbedre det tekstlige innholdet, med fokus på tydelighet og lesbarhet.
          Du har fått som oppdrag å foreslå en bedre formulering av teksten i <excerpt> på NB. Innholdet i <draft> kan brukes som kontekst, men skal ikke gjenbrukes som del av den foreslåtte omformuleringen.
          Du skal skal skrive refleksjoner på hvorfor du har valgt å inkludere de punktene du har valgt først. 
          Forslaget til en forbedret tekst skal være skrevet i en <answer>-tag.
          Om du ikke klarer å levere svaret på formatet <answer> som er spesifisert skal første linje i responsen være <ERROR>-tag.
        </Instructions>`,
  en: (text: string, excerpt: string) => `<excerpt>${excerpt}</excerpt>
        <draft>${text}</draft>
        <Instructions>
          You have an extensive experience from the educational sector. You are specialized in rewriting educational articles to improve its contents, with focus on clarity and readability.
          Your task is to suggest a better phrasing of the text in <excerpt> in EN. The content in <draft> can be used as context, but should not be reused as part of the suggested rephrasing.
          You are going to write reflections as to why you have chosen to include the selected points first.
          The suggested rephrasing is to be written inside a <answer>-tag.
          If you can not deliver the answer in the given format <answer>, the first line in the response should be <ERROR>-tag.
        </Instructions>`,
  nn: (text: string, excerpt: string) => `<excerpt>${excerpt}</excerpt>
        <draft>${text}</draft>
        <Instructions>
          Du har lang erfaring frå utdanningssektoren. Du er spesialist i å reinskrive fagartiklar for å gjere det tekstlige innhaldet betre, med fokus på klarleik og lesbarheit.
          Du har fått i oppgåve å foreslå ein betre formulering av teksten i <excerpt> på NN. Innhaldet i <draft> kan nyttast som kontekst, men skal ikkje gjenbrukast som deil av den føreslåtte omformuleringa.
          Du skal skrive refleksjonar på kvifor du har valt å inkludere dei punktane du har valt først.
          Forslaget til en betre formulering skal være skreve i ein <answer>-tag.
          Om du ikkje klarar å levere svaret på formatet <answer> som er spesifisert skal fyrste linje i responsen være <ERROR>-tag.
        </Instructions>`,
};

type AlttextQuery = Record<LanguageCode, string>;

const ALT_TEXT_QUERY: AlttextQuery = {
  nb: `<Instructions>
          Du har lang erfaring fra utdanningssektoren. Du er spesialist i å skrive alternative tekster for bilder for å gjøre dem tilgjengelige for alle elever.
          Du har fått som oppdrag å skrive en alternativ tekst for bildet vedlagt på NB. Beskrivelsen skal være på maks 125 tegn.
          Svaret skal leveres med refleksjoner på hvorfor du har valgt å inkludere de punktene du har valgt først, så selve alternativteksten skrevet i en <answer>-tag.
          Om du ikke klarer å levere svaret på formatet <answer> som er spesifisert skal første linje i responsen være <ERROR>-tag.
        </Instructions>`,
  en: `<Instructions>
          You have an extensive experience from the educational sector. You are specialized in writing alternative texts for images to make them accessible for all students.
          Your task is to write an alternative text for the image in EN. The description must be at most 125 characters.
          The response must be given with reflections as to why you have chosen to include the selected points first, then the allternative text written in an <answer>-tag.
          If you can not deliver the answer in the given format <answer>, the first line in the response should be <ERROR>-tag.
        </Instructions>`,
  nn: `<Instructions>
          Du har lang erfaring frå utdanningssektoren. Du er spesialist i å skrive alternative tekstar for bilete for å gjere dei tilgjengelege for alle elevar.
          Du har fått som oppgåve å skrive ein alternativ tekst for bilete vedlagt på NO. Beskrivinga skal vere på maks 125 teikn.
          Svaret skal leverast med refleksjonar på kvifor du har valt å inkludere dei punktane du har valt først, så selve alternativteksten skreve i ein <answer>-tag.
          Om du ikkje klarar å levere svaret på formatet <answer> som er spesifisert skal fyrste linje i responsen vere <ERROR>-tag.
        </Instructions>`,
};

type ReflectionQuery = Record<LanguageCode, (text: string) => string>;

const REFLECTION_QUESTION_QUERY: ReflectionQuery = {
  nb: (text: string) => `<draft>${text}</draft>
        <Instructions>
          Du har lang erfaring fra utdanningssektoren. Du er spesialist i å analysere fagartikler for å finne gode refleksjonsspørsmål som får elevene til å tenke gjennom hva de har lest.
          Du har fått som oppdrag å lese gjennom artikkelen i <draft> og skrive fem refleksjonsspørsmål basert på artikkelen på NB. Spørsmålene skal være på et nivå som passer for elever på videregående skole.
          Svaret skal leveres med refleksjoner på hvorfor du har valgt å inkludere de punktene du har valgt først. Deretter skal refleksjonsspørsmålene gis som punktliste i en <answer>-tag.
          Om du ikke klarer å levere svaret på formatet <answer> som er spesifisert skal første linje i responsen være <ERROR>-tag.
        </Instructions>`,
  en: (text: string) => `<draft>${text}</draft>
        <Instructions>
          You have extensive experience from the educational sector. You are specialized in analyzing educational articles to find good reflection questions which enables the students to reflect on what they have read.
          Your task is to read through the article in <draft> and write five reflection questions based on the article in NB. The questions must be on a level which fits students in high school.
          The response must be given with reflections as to why you have chosen to include the selected bullet points first. Then, the reflection questions must be given as bulletpoints in an <answer>-tag.
          If you cannot deliver the answer in the given format <answer>, the first line in the response should be <ERROR>-tag.
        </Instructions>`,
  nn: (text: string) => `<draft>${text}</draft>
        <Instructions>
          Du har lang erfaring frå utdanningssektoren. Du er spesialist i å analysere fagartiklar for å finne gode refleksjonsspørsmål som får elevane til å tenkje igjennom kva de har lest.
          Du har fått i oppgåve å lese igjennom artikkelen i <draft> og skrive fem refleksjonsspørsmål basert på artikkelen på NN. Spørsmåla skal vere på eit nivå som passar elevar på vidaregåande skule.
          Svaret skal leverast med refleksjonar på kvifor du har valt å inkludere dei punktane du har valt først. Deretter skal refleksjonsspørmåla gjes som punktliste i ein <answer>-tag.
          Om du ikkje klarar å levere svaret på formatet <answer> som er spesifisert skal fyrste linje i responsen vere <ERROR>-tag.
        </Instructions>`,
};

const isSupportedLanguage = (lang: string): lang is LanguageCode => lang === "nb" || lang === "nn" || lang === "en";

export const getPromptQuery = (payload: PromptVariables, languageCode: string) => {
  const language = isSupportedLanguage(languageCode) ? languageCode : "nb";
  switch (payload.type) {
    case "alternativePhrasing":
      return ALTERNATIVE_PRHASING_QUERY[language](payload.text, payload.excerpt);
    case "metaDescription":
      return META_DESCRIPTION_QUERY[language](payload.text, payload.title);
    case "summary":
      return ARTICLE_SUMMARY_QUERY[language](payload.text, payload.title);
    case "reflection":
      return REFLECTION_QUESTION_QUERY[language](payload.text);
    case "alttext":
    default:
      return ALT_TEXT_QUERY[language];
  }
};
