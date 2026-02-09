/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EmbedData } from "@ndla/types-embed";
import { keyBy } from "@ndla/util";
import { Cheerio, CheerioAPI, load } from "cheerio";
import he from "he";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import { getEnvironmentVariabel } from "../config";
import { ApiTranslateType } from "../interfaces";
import errorLogger from "./logger";

type KeysWithoutResource<U extends { resource: PropertyKey }> = {
  [R in U["resource"]]: Array<Exclude<keyof Extract<U, { resource: R }>, "resource">>;
};

const TRANSLATE_URL = "https://nynorsk.cloud/translate";

interface TranslationResponse<T extends string | string[] | object | object[]> {
  document: T;
}

const fetchTranslation = async <T extends string | string[] | object | object[]>(
  doc: T,
  translatableFields?: string[],
) => {
  const response = await fetch(TRANSLATE_URL, {
    method: "POST",
    body: JSON.stringify({
      token,
      fileType: translatableFields ? `json:${translatableFields.join(",")}` : "html",
      document: doc,
      lang_parameter_translate: "none",
      // NTB suggestions based on our old style guide
      prefs: {
        "apos_fot.teikn": true,
        "augne_auge.stav": true,
        "avskil_avskjed.syn": true,
        "banen_bana.n-m2f": [
          "bygning",
          "frysning",
          "kledning",
          "krusning",
          "ladning",
          "ledning",
          "munning",
          "spenning",
          "strekning",
          "demning",
          "festning",
        ],
        "blæs_blåser.vb": true,
        "brud_brur.stav": true,
        "byrje_begynne.syn": true,
        "elvar_elver.n-pl-e2a": true,
        "enkje_enke.kons-kj2k_gj2g": true,
        "fjøre_fjære.vok-ø2æ": true,
        "fornøgd_nøgd.syn": true,
        "fremje_fremme.kons-mj2mm": true,
        "følgje_følge.kons-lgj2lg": true,
        "førebels_foreløpig.syn": true,
        "gløymsle_gløymsel.kons-sel2sle": true,
        "håpa_håpte.vb-e2a": [
          "ape",
          "beite",
          "brøyte",
          "deise",
          "dreise",
          "feile",
          "fike",
          "fire",
          "fleipe",
          "fløyte",
          "gape",
          "geipe",
          "glime",
          "gruse",
          "huse",
          "hyre",
          "håpe",
          "ise",
          "kruse",
          "kule",
          "lade",
          "lave",
          "leike",
          "leite",
          "lóse",
          "love",
          "lute",
          "meie",
          "peike",
          "peise",
          "prise",
          "rane",
          "rape",
          "rose",
          "ruse",
          "ruve",
          "smeise",
          "snuse",
          "spleise",
          "sprute",
          "sprøyte",
          "stane",
          "stile",
          "strene",
          "streve",
          "sture",
          "sveise",
          "sveive",
          "sveve",
          "syre",
          "trene",
          "tøve",
          "tøyser",
          "veiver",
          "våge",
        ],
        "i-røynda_i-verkelegheita.syn": true,
        "lagnad_skjebne.syn": true,
        "lide_li.vb-inf": true,
        "medan_mens.syn": true,
        "medviten_bevisst.syn": true,
        "mengd_mengde.vok-2e": true,
        "nærare_nærmare.stav": true,
        "nærast_nærmast.stav": true,
        "også_og.syn": true,
        "oppmode_oppfordre.syn": true,
        "overta_ta-over.syn": true,
        "røyndom_verkelegheit.syn": true,
        "samd_einig.syn": true,
        "sitat.lastå": true,
        "sitat_tomme.teikn": true,
        "stove_stue.vok-u2o": true,
        "symje_svømme.stav": true,
        "tenkje-leggje.kons-kj2k_gj2g": true,
        "tryggleik_sikkerheit.syn": true,
        "vart-vorte_blei-blitt.vb-bli2verte": true,
        "voks_vaks.vok-o2a": true,
        infa_infe: true,
        itilfelle_ifall: true,
        language: "nob-nno",
        lét_let: true,
        me_vi: true,
        vit_vett: true,
      },
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then((res) => res.json() as Promise<TranslationResponse<T>>);

  return response.document;
};

const translatableFields: KeysWithoutResource<EmbedData> = {
  symbol: [],
  audio: [],
  brightcove: ["caption", "alt", "title"],
  "content-link": [],
  h5p: ["title", "alt"],
  image: ["alt", "caption"],
  "related-content": ["title"],
  concept: [],
  nrk: [],
  iframe: ["title", "caption", "alt"],
  external: ["title", "caption", "alt"],
  footnote: [],
  "code-block": ["title"],
  file: ["title"],
  pitch: ["title", "alt", "description"],
  "key-figure": ["title", "alt", "subtitle"],
  "contact-block": ["alt", "description", "jobTitle"],
  "campaign-block": ["description", "alt", "title", "urlText"],
  "link-block": ["title"],
  "uu-disclaimer": ["disclaimer"],
  copyright: ["title"],
  comment: [],
};

const token = getEnvironmentVariabel("NTB_TOKEN", "");

interface ResponseType {
  key: string;
  value: string | string[];
}

export interface CheerioEmbed {
  id: string;
  embed: Cheerio<any>;
  data: EmbedData;
}

// this is taken directly from graphql-api. The only difference is that we add an ID.
export const getEmbedsFromContent = (html: CheerioAPI): CheerioEmbed[] => {
  return html("ndlaembed", null, undefined)
    .toArray()
    .map((embed) => ({
      id: nanoid(16),
      embed: html(embed),
      // Cheerio automatically converts number-like strings to numbers, which in turn can break html-react-parser.
      // Seeing as article-converter expects to only receive strings for embed data, we need to convert all numbers to strings (again).
      data: Object.entries(html(embed).data()).reduce((acc, [key, value]) => {
        //@ts-expect-error - this is hard to type
        acc[key] = typeof value === "number" || typeof value === "boolean" ? `${value}` : value;
        return acc;
      }, {}) as EmbedData,
    }));
};

type TranslatableEmbedData = { id: string } & Record<string, any>;

/**
 * NTB does not permit querying for nested fields when translating, e.g `foo.bar`. This leaves us with two options:
 * 1. Partition embed datas by type and send multiple requests to NTB.
 * 2. Guarantee that fields belonging to different embed types have unique names, and send everything in a single request.
 *
 * We chose to go with option 2, as NTB claims that the startup time for a request is significant. This function strips redundant information
 * from the embed, and renmames fields to ensure uniqueness.
 */
const constructPayload = (embeds: CheerioEmbed[]) => {
  const jsonFields = new Set<string>();
  const payload: TranslatableEmbedData[] = [];
  embeds.forEach((embed) => {
    const fields = translatableFields[embed.data.resource];
    if (fields.length) {
      const transObject = fields.reduce<TranslatableEmbedData>(
        (acc, curr) => {
          const key = `${embed.data.resource}-${curr}`;
          jsonFields.add(key);
          acc[key] = embed.data[curr as keyof EmbedData];
          return acc;
        },
        { id: embed.id },
      );
      payload.push(transObject);
    }
  });

  return { payload, jsonFields: Array.from(jsonFields) };
};

const doFetch = async (name: string, element: ApiTranslateType): Promise<ResponseType> => {
  if (element.type === "text") {
    const result = await fetchTranslation(element.content);

    return { key: name, value: result };
  } else {
    // First, translate the entire document. This takes care of everything but attributes.
    const initialTranslation = await fetchTranslation(element.content);
    const html = load(initialTranslation, null, false);
    const ndlaEmbeds = getEmbedsFromContent(html);

    const { payload, jsonFields } = constructPayload(ndlaEmbeds);

    const translatedEmbeds = await fetchTranslation(payload, jsonFields);

    const keyedEmbeds = keyBy(translatedEmbeds, (embed) => embed.id);

    ndlaEmbeds.forEach((embed) => {
      if (!keyedEmbeds[embed.id]) return;
      // Make sure to omit the ID!
      const { id: _id, ...translatedData } = keyedEmbeds[embed.id];
      Object.entries(translatedData).forEach(([key, value]) => {
        // Map the key back to its original name
        const oldKey = key.replace(`${embed.data.resource}-`, "");
        const newKey = `data-${oldKey}`;
        if (embed.embed.attr(newKey)) {
          embed.embed.attr(newKey, he.encode(value));
        }
      });
    });

    return {
      key: name,
      value: he.decode(html.html()),
    };
  }
};

export const translateDocument = async (document: Record<string, ApiTranslateType>) => {
  try {
    const translations = await Promise.all(Object.keys(document).map((k) => doFetch(k, document[k])));
    return translations.reduce<Record<string, string | string[]>>((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});
  } catch (e) {
    errorLogger.error(e);
  }
};
