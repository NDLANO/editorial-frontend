/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Cheerio, CheerioAPI, load } from "cheerio";
import he from "he";
import fetch from "node-fetch";
import errorLogger from "./logger";
import { getEnvironmentVariabel } from "../config";
import { ApiTranslateType } from "../interfaces";
import { EmbedData } from "@ndla/types-embed";
import { nanoid } from "nanoid";
import { keyBy } from "@ndla/util";

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
  // footnote: ["title"],
  footnote: [],
  "code-block": ["title"],
  file: ["title"],
  pitch: ["title", "alt", "description"],
  "key-figure": ["title", "alt", "subtitle"],
  "contact-block": ["alt", "description", "jobTitle", "name"],
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

export const getEmbedsFromContent = (html: CheerioAPI): CheerioEmbed[] => {
  return html("ndlaembed", null, undefined, {
    xml: { encodeEntities: false, decodeEntities: true, selfClosingTags: false },
  })
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

const constructPayload = (embeds: CheerioEmbed[]) => {
  const jsonFields: string[] = [];
  const payload: TranslatableEmbedData[] = [];
  embeds.forEach((embed) => {
    const fields = translatableFields[embed.data.resource];
    if (fields.length) {
      const transObject = fields.reduce<TranslatableEmbedData>(
        (acc, curr) => {
          const key = `${embed.data.resource}-${curr}`;
          jsonFields.push(key);
          acc[key] = embed.data[curr as keyof EmbedData];
          return acc;
        },
        { id: embed.id },
      );
      payload.push(transObject);
    }
  });

  return { payload, jsonFields };
};

const doFetch = async (name: string, element: ApiTranslateType): Promise<ResponseType> => {
  if (element.type === "text") {
    const result = await fetchTranslation(element.content);

    return { key: name, value: result };
  } else {
    const initialTranslation = await fetchTranslation(element.content);

    const html = load(initialTranslation, null, false);
    const ndlaEmbeds = getEmbedsFromContent(html);

    const { payload, jsonFields } = constructPayload(ndlaEmbeds);

    const translatedEmbeds = await fetchTranslation(payload, jsonFields);

    const keyedEmbeds = keyBy(translatedEmbeds, (embed) => embed.id);

    ndlaEmbeds.forEach((embed) => {
      if (!keyedEmbeds[embed.id]) return;
      const { id: _id, ...translatedData } = keyedEmbeds[embed.id];
      Object.entries(translatedData).forEach(([key, value]) => {
        const oldKey = key.replace(`${embed.data.resource}-`, "");
        const newKey = `data-${oldKey}`;
        if (embed.embed.attr(newKey)) {
          embed.embed.attr(newKey, he.encode(value));
        }
      });
    });

    return {
      key: name,
      value: he.decode(html.html({ xml: { decodeEntities: true, selfClosingTags: false } })),
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
