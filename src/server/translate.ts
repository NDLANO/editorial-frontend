/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheerioAPI, load } from "cheerio";
import FormData from "form-data";
import fetch from "node-fetch";
import queryString from "query-string";
import errorLogger from "./logger";
import config, { getEnvironmentVariabel } from "../config";
import { ApiTranslateType } from "../interfaces";

const baseUrl = config.translateServiceUrl;
const user = getEnvironmentVariabel("NDKM_USER", "");
const token = getEnvironmentVariabel("NDKM_TOKEN", "");
const textUrl = `${baseUrl}/translateText`;
const htmlUrl = `${baseUrl}/translateNHtml`;

interface TextResponse {
  responseData: {
    translatedText: string;
  };
  responseDetails: null;
  responseStatus: number;
}

interface ResponseType {
  key: string;
  value: string | string[];
}

const stilmal = "Intern nynorsk 4";
// Only header if props available
const headers = user
  ? {
      "x-user": user,
      "x-api-key": token,
    }
  : undefined;

const wrapAttribute = (html: CheerioAPI, element: any, attribute: string, selector: string) => {
  const value = html(element).attr(attribute) ?? "";
  if (!value) return;
  const innerHtml = load(value);
  innerHtml(selector).each((_, el) => {
    innerHtml(el).wrap("<ndlaskip></ndlaskip>");
  });
  html(element).attr(attribute, innerHtml("body").html());
};

const doFetch = (name: string, element: ApiTranslateType): Promise<ResponseType> => {
  if (element.type === "text") {
    const parsedContent = element.isArray ? element.content.join("|") : element.content;
    const params = {
      stilmal,
      q: parsedContent,
    };
    return fetch(`${textUrl}?${queryString.stringify(params)}`, {
      method: "POST",
      headers,
    })
      .then((res) => res.json())
      .then((json: TextResponse) => {
        const translated = json.responseData.translatedText;
        const content = element.isArray ? translated.split("|") : translated;
        return { key: name, value: content };
      });
  } else {
    const formData = new FormData();
    const html = load(`${element.content}`);
    html("span[lang]").each((_, el) => {
      html(el).wrap("<ndlaskip></ndlaskip>");
    });
    html("math").each((_, el) => {
      html(el).wrap("<ndlaskip></ndlaskip>");
    });
    html("ndlaembed").each((_, el) => {
      wrapAttribute(html, el, "data-caption", "span[lang]");
      wrapAttribute(html, el, "data-title", "span[lang]");
      wrapAttribute(html, el, "data-subtitle", "span[lang]");
      wrapAttribute(html, el, "data-description", "span[lang]");
      wrapAttribute(html, el, "data-url-text", "span[lang]");
    });
    // Our backend uses Jsoup to encode html. However, > is not encoded, and nynodata expects it to be. As such, we have to parse
    // the entire html string and reencode it using an xmlSerializer.
    const content = html.html({ xml: { xmlMode: false, decodeEntities: false } });
    //console.log(content);

    const buffer = Buffer.from(content);
    const params = { stilmal };

    formData.append("file", buffer, { filename: `${name}.html` });
    return fetch(`${htmlUrl}?${queryString.stringify(params)}`, {
      method: "POST",
      body: formData,
      headers,
    })
      .then((res) => res.blob())
      .then((res) => res.text())
      .then(async (res) => {
        //console.log(res);
        const response = load(res);
        response("ndlaskip").each((_, el) => {
          response(el).contents().unwrap();
        });
        const strippedResponse = response("body").unwrap().html() ?? "";
        //console.log(strippedResponse);
        return { key: name, value: strippedResponse };
      });
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
