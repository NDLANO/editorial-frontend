/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
    const wrappedContent = `<html>${element.content}</html>`;
    const buffer = Buffer.from(wrappedContent);
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
        const strippedResponse = res.replace("<html>", "").replace("</html>", "");
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
