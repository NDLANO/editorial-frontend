/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const DEBUG_INSTRUCTION = {
  nb: "Utenfor <answer>-taggen skal du levere refleksjoner på hvorfor du har valgt å inkludere de punktene du har valgt",
  nn: "Utanfor <answer>-taggen skal du levere refleksjonar på kvifor du har valt å inkludere dei punkta du har valt først.",
  en: "Outside of the <answer> tag you are to write reflections as to why you have chosen to include the selected points first.",
};

const ERROR_INSTRUCTION = {
  nb: "Om du ikke klarer å levere svaret på det spesifiserte <answer>-formatet skal grunnen skrives i en <ERROR>-tag.",
  nn: "Om du ikkje klarar å levere svaret på det spesifiserte <answer>-formatet skal grunnen skrivast i ein <ERROR>-tag.",
  en: "If you cannot deliver the answer in the given format <answer>, the reasoning should be written inside an <ERROR> tag.",
};

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
  nb: (text: string, title: string) => `
        <draft> ${text} </draft>
        <Instructions>
          Du har lang erfaring fra utdanningssektoren.
          Du har spesialisert deg i å oppsummere fagartikler for å gjøre dem mer tilgjengelige for et bredere publikum.
          Du har fått som oppdrag å hjelpe med å forbedre læringsopplevelsen for elevene.
          For å gjøre dette må du lese gjennom og lage en oppsummering av artikler sånn at videregåendestudentene lett kan få et inntrykk av de viktigste poengene i artikkelen.
          Du har fått som oppdrag å lese gjennom og skrive en oppsummering til artikkelen i <draft>-taggen. 
          Tittelen til artikkelen er "${title}". 
          Oppsummeringen skal være på NB.
          Oppsummeringen skal være på mindre enn 300 ord, og skrives i en <answer>-tag.
          Oppsummeringen skal ikke være en liste og skal ikke inkludere tittelen.
          ${DEBUG_INSTRUCTION.nb}
          ${ERROR_INSTRUCTION.nb}
        </Instructions>`,
  en: (text: string, title: string) => `
        <draft>${text}</draft>
        <Instructions>
          You have an extensive experience from the educational sector.
          You are specialized in summarizing educational articles to make them more accessible for a wider audience.
          Your task is to help improving the learning experience for the students.
          To achieve this you have to read and summarize articles in a way that high school students can easily gain an impression of the most important points in the article.
          Your task is to read through and write a summary of the article within the <draft> tag.
          The title of the article is "${title}". 
          The summary must be written in EN.
          The summary must be less than 300 words, and written inside an <answer> tag.
          The summary should not be given as a list and should not include the title.
          ${DEBUG_INSTRUCTION.en}
          ${ERROR_INSTRUCTION.en}
        </Instructions>`,
  nn: (text: string, title: string) => `
          <draft>${text}</draft>
          <Instructions>
          Du har lang erfaring frå utdanningssektoren.
          Du har spesialisert deg i å oppsummere fagartiklar for å gjere dei meir tilgjengeleg for eit større publikum.
          Du har fått som oppdrag å hjelpe med å forbetre læringsopplevelsen for elevane.
          For å gjere dette må du lese gjennom og lage ei oppsummering av artiklar så vidaregåandestudentane lett kan få eit inntrykk av dei viktigaste poenga i artikkelen.
          Du har fått i oppgåve å lese gjennom og skrive ei oppsummering til artikkelen i <draft>-taggen.
          Tittelen til artikkelen er "${title}". 
          Oppsummeringa skal vere på NN.
          Oppsummeringa skal vere på mindre enn 300 ord, og skrives i ein <answer>-tag.
          Oppsummeringa skal ikkje vere ein liste og skal ikkje inkludera tittelen.
          ${DEBUG_INSTRUCTION.nn}
          ${ERROR_INSTRUCTION.nn}
        </Instructions>`,
};

type MetaDescriptionQuery = Record<LanguageCode, (text: string, title: string) => string>;

const META_DESCRIPTION_QUERY: MetaDescriptionQuery = {
  nb: (text: string, title: string) => `
        <draft>${text}</draft>
        <Instructions>
          Du har lang erfaring fra utdanningssektoren.
          Du er spesialist i å finne gode måter å beskrive fagartikler på, slik at man fra en kort oppsummering klarer å forstå hva artiklene handler om.
          Du har fått som oppdrag å lese gjennom artikkelen i <draft>-taggen og skrive en metabeskrivelse om den.
          Tittelen på artikkelen er "${title}".
          Metabeskrivelsen skal være skrevet på NB.
          Metabeskrivelsen skal være på mindre enn 15 ord, og skal skrives i en <answer>-tag.
          ${DEBUG_INSTRUCTION.nb}
          ${ERROR_INSTRUCTION.nb}
         </Instructions>`,
  en: (text: string, title: string) => `
        <draft>${text}</draft>
        <Instructions>
          You have an extensive experience from the educational sector.
          You are specialized in finding good ways to describe educational articles, in a way that the reader can understand what the article is about from a very short summary.
          Your task is to read through the article within the <draft> tag, and write a meta description about it.
          The title of the article is "${title}".
          The meta description must be written in EN.
          The meta description must be less than 15 words, and written inside an <answer> tag.
          ${DEBUG_INSTRUCTION.en}
          ${ERROR_INSTRUCTION.en}
         </Instructions>`,
  nn: (text: string, title: string) => `
        <draft> ${text} </draft>
        <Instructions>
          Du har lang erfaring frå utdanningssektoren.
          Du er spesialist i å finne gode måter å skildre fagartiklar på, slik at ein frå ei kort oppsummering kan forstå kva artikkelen handlar om.
          Du har fått i oppgåve å lese gjennom artikkelen i <draft>-taggen og skrive ein metabeskrivelse om den.
          Tittelen på artikkelen er "${title}".
          Metabeskrivinga skal vere skrevet på NN.
          Metabeskrivinga skal vere på mindre enn 15 ord, og skrives i ein <answer>-tag.
          ${DEBUG_INSTRUCTION.nn}
          ${ERROR_INSTRUCTION.nn}
         </Instructions>`,
};

type AlternativePhrasingQuery = Record<LanguageCode, (text: string, excerpt: string) => string>;

const ALTERNATIVE_PRHASING_QUERY: AlternativePhrasingQuery = {
  nb: (text: string, excerpt: string) => `
        <excerpt>${excerpt}</excerpt>
        <draft>${text}</draft>
        <Instructions>
          Du har lang erfaring fra utdanningssektoren.
          Du er spesialist i å renskrive fagartikler for å forbedre det tekstlige innholdet, med fokus på tydelighet og lesbarhet.
          Du har fått som oppdrag å foreslå en bedre formulering av teksten i <excerpt>-taggen.
          Innholdet i <draft>-taggen kan brukes som kontekst, men skal ikke gjenbrukes som del av den foreslåtte omformuleringen.
          Forslaget til en forbedret tekst skal være skrevet på NB.
          Forslaget til en forbedret tekst skal være skrevet i en <answer>-tag.
          ${DEBUG_INSTRUCTION.nb}
          ${ERROR_INSTRUCTION.nb}
        </Instructions>`,
  en: (text: string, excerpt: string) => `
        <excerpt>${excerpt}</excerpt>
        <draft>${text}</draft>
        <Instructions>
          You have an extensive experience from the educational sector.
          You are specialized in rewriting educational articles to improve its contents, with focus on clarity and readability.
          Your task is to suggest a better phrasing of the text in the <excerpt> tag.
          The content in the <draft> tag can be used as context, but should not be reused as part of the suggested rephrasing.
          The suggested rephrasing is to be written in EN.
          The suggested rephrasing is to be written inside an <answer> tag.
          ${DEBUG_INSTRUCTION.en}
          ${ERROR_INSTRUCTION.en}         
        </Instructions>`,
  nn: (text: string, excerpt: string) => `
        <excerpt>${excerpt}</excerpt>
        <draft>${text}</draft>
        <Instructions>
          Du har lang erfaring frå utdanningssektoren.
          Du er spesialist i å reinskrive fagartiklar for å gjere det tekstlige innhaldet betre, med fokus på klarleik og lesbarheit.
          Du har fått i oppgåve å foreslå ei betre formulering av teksten i <excerpt>-taggen.
          Innhaldet i <draft>-taggen kan nyttast som kontekst, men skal ikkje gjenbrukast som del av den føreslåtte omformuleringa.
          Forslaget til ein betre formulering skal vere skrive på NN.
          Forslaget til ein betre formulering skal vere skrive i ein <answer>-tag.
          ${DEBUG_INSTRUCTION.nn}
          ${ERROR_INSTRUCTION.nn}
        </Instructions>`,
};

type AlttextQuery = Record<LanguageCode, string>;

const ALT_TEXT_QUERY: AlttextQuery = {
  nb: `<Instructions>
          Du har lang erfaring fra utdanningssektoren. 
          Du er spesialist i å skrive alternative tekster for bilder for å gjøre dem tilgjengelige for alle elever.
          Du har fått som oppdrag å skrive en alternativ tekst for det vedlagte bildet. 
          Teksten skal være på NB.
          Beskrivelsen skal være på maks 125 tegn, og skrevet i en <answer>-tag.
          ${DEBUG_INSTRUCTION.nb}
          ${ERROR_INSTRUCTION.nb}
        </Instructions>`,
  en: `<Instructions>
          You have an extensive experience from the educational sector.
          You are specialized in writing alternative texts for images to make them accessible for all students.
          Your task is to write an alternative text for the image in EN.
          The description must be at most 125 characters, and written inside an <answer> tag.
          ${DEBUG_INSTRUCTION.en}
          ${ERROR_INSTRUCTION.en}
        </Instructions>`,
  nn: `<Instructions>
          Du har lang erfaring frå utdanningssektoren.
          Du er spesialist i å skrive alternative tekstar for bilete for å gjere dei tilgjengelege for alle elevar.
          Du har fått som oppgåve å skrive ein alternativ tekst for det vedlagte biletet.
          Teksta skal vere på NN.
          Beskrivinga skal vere på maks 125 teikn, og skrive i ein <answer>-tag.
          ${DEBUG_INSTRUCTION.nn}
          ${ERROR_INSTRUCTION.nn}
        </Instructions>`,
};

type ReflectionQuery = Record<LanguageCode, (text: string) => string>;

const REFLECTION_QUESTION_QUERY: ReflectionQuery = {
  nb: (text: string) => `
        <draft>${text}</draft>
        <Instructions>
          Du har lang erfaring fra utdanningssektoren. 
          Du er spesialist i å analysere fagartikler for å finne gode refleksjonsspørsmål som får elevene til å tenke gjennom hva de har lest.
          Du har fått som oppdrag å lese gjennom artikkelen i <draft>-taggen og skrive fem refleksjonsspørsmål basert på artikkelen. 
          Spørsmålene skal skrives på NB. 
          Spørsmålene skal være på et nivå som passer for elever på videregående skole.
          Spørsmålene gis som en punktliste inne i en <answer>-tag
          ${DEBUG_INSTRUCTION.nb}
          ${ERROR_INSTRUCTION.nb}
        </Instructions>`,
  en: (text: string) => `
        <draft>${text}</draft>
        <Instructions>
          You have extensive experience from the educational sector. 
          You are specialized in analyzing educational articles to find good reflection questions which enables the students to reflect on what they have read.
          Your task is to read through the article in the <draft> tag and write five reflection questions based on the article.
          The questions should be written in EN.
          The questions must be on a level which fits students in high school.
          The reflection questions must be given as bulletpoints in an <answer> tag.
          ${DEBUG_INSTRUCTION.en}
          ${ERROR_INSTRUCTION.en}
        </Instructions>`,
  nn: (text: string) => `
        <draft>${text}</draft>
        <Instructions>
          Du har lang erfaring frå utdanningssektoren. 
          Du er spesialist i å analysere fagartiklar for å finne gode refleksjonsspørsmål som får elevane til å tenkje gjennom kva dei har lest.
          Du har fått i oppgåve å lese gjennom artikkelen i <draft>-taggen og skrive fem refleksjonsspørsmål basert på artikkelen. 
          Spørsmåla skal skrivast på NN.
          Spørsmåla skal vere på eit nivå som passar elevar på vidaregåande skule.
          Spørsmåla gjes som ei punktliste inne i ein <answer>-tag.
          ${DEBUG_INSTRUCTION.nn}
          ${ERROR_INSTRUCTION.nn}
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
