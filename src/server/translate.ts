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
import { createDataAttributes } from "@ndla/editor";

type KeysWithoutResource<U extends { resource: PropertyKey }> = {
  [R in U["resource"]]: Array<Exclude<keyof Extract<U, { resource: R }>, "resource">>;
};

// TODO: We're doing something wrong when receiving responses including a code block. See http://localhost:3000/subject-matter/learning-resource/42563/edit/nb

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
      fileType: translatableFields ? `json:${translatableFields.join(",")}` : undefined,
      document: doc,
      lang_parameter_translate: "none",
    }),
    headers: {
      "Content-Type": "application/json",
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
  embed: Cheerio<any>;
  data: EmbedData;
}

export const getEmbedsFromContent = (html: CheerioAPI): CheerioEmbed[] => {
  return html("ndlaembed", null, undefined, { xml: { encodeEntities: false, decodeEntities: true } })
    .toArray()
    .map((embed) => ({
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

const doFetch = async (name: string, element: ApiTranslateType): Promise<ResponseType> => {
  if (element.type === "text") {
    const result = await fetchTranslation(element.content);

    return { key: name, value: result };
  } else {
    const initialTranslation = await fetchTranslation(element.content);

    const html = load(initialTranslation, {}, false);
    const ndlaEmbeds = getEmbedsFromContent(html);

    const embedsByResource = ndlaEmbeds.reduce<Record<EmbedData["resource"], CheerioEmbed[]>>(
      (acc, curr) => {
        if (translatableFields[curr.data.resource].length) {
          if (!acc[curr.data.resource]) {
            acc[curr.data.resource] = [curr];
          } else {
            acc[curr.data.resource].push(curr);
          }
        }
        return acc;
      },
      {} as Record<EmbedData["resource"], CheerioEmbed[]>,
    );

    const promises = Object.entries(embedsByResource).map(async ([embed, embeds]) => {
      const fields = embed in translatableFields ? translatableFields[embed as EmbedData["resource"]] : [];
      if (!fields.length) return;
      const data = await fetchTranslation(
        embeds.map((e) => e.data),
        fields,
      );

      embeds.forEach((embed, index) => {
        const newValues = translatableFields[embed.data.resource].reduce<Record<string, string>>((acc, curr) => {
          const dataResult = data?.[index]?.[curr as keyof EmbedData];
          acc[curr] = dataResult;
          return acc;
        }, {});

        const dataAttributes = createDataAttributes(newValues);
        Object.entries(dataAttributes).forEach(([key, value]) => {
          // embed.embed.opt = false;
          embed.embed.attr(key, value);
        });
      });
    });

    await Promise.all(promises);

    return {
      key: name,
      value: he.decode(html.html({ xml: { decodeEntities: true } })),
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
