/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from "node-fetch";
import { getEnvironmentVariabel } from "../config";
import { ApiTranslateType } from "../interfaces";
import errorLogger from "./logger";

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

const token = getEnvironmentVariabel("NTB_TOKEN", "");

interface ResponseType {
  key: string;
  value: string | string[];
}

const doFetch = async (name: string, element: ApiTranslateType): Promise<ResponseType> => {
  return {
    key: name,
    value: await fetchTranslation(element.content),
  };
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
