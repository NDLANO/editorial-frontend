/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { grepUrl, resolveJsonOrRejectWithError } from '../../util/apiHelpers';
import handleError from '../../util/handleError';

interface Tekst {
  tekst: Title[];
}
interface Title {
  spraak: string;
  verdi: string;
}
const getTitlesObject = (titles: Tekst | Title[] | undefined): Title[] => {
  return (titles as Tekst)?.tekst || titles || [];
};

const getDefaultLang = (titles: Title[]) =>
  titles?.find(t => t.spraak === 'default')?.verdi;

const fetchKjerneelementer = async (code: string) =>
  fetch(grepUrl(`/kjerneelementer-lk20/${code}`));

const fetchKompetansemaal = async (code: string) =>
  fetch(grepUrl(`/kompetansemaal-lk20/${code}`));

const fetchTverrfagligeTemaer = async (code: string) =>
  fetch(grepUrl(`/tverrfaglige-temaer-lk20/${code}`));

const fetchKompetansemaalsett = async (code: string) =>
  fetch(grepUrl(`/kompetansemaalsett-lk20/${code}`));

const fetchLaereplaner = async (code: string) =>
  fetch(grepUrl(`/laereplaner-lk20/${code}`));

const doGrepCodeRequest = async (code: string) => {
  if (code.startsWith('KE')) {
    return fetchKjerneelementer(code);
  } else if (code.startsWith('KM')) {
    return fetchKompetansemaal(code);
  } else if (code.startsWith('TT')) {
    return fetchTverrfagligeTemaer(code);
  } else if (code.startsWith('KV')) {
    return fetchKompetansemaalsett(code);
  } else {
    return fetchLaereplaner(code);
  }
};

export const fetchGrepCodeTitle = async (grepCode: string) => {
  const res = await doGrepCodeRequest(grepCode);
  console.log(res);
  try {
    if (res?.status === 404) {
      console.log(grepCode, 'finnes ikke');
      return null;
    }
    const jsonResponse = await resolveJsonOrRejectWithError(res);
    const titlesObj = getTitlesObject(jsonResponse?.tittel);
    const titleInLanguage = getDefaultLang(titlesObj);
    return titleInLanguage;
  } catch (error) {
    handleError(error);
  }
};
