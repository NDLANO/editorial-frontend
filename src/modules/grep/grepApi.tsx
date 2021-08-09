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

export interface UdirCoreType {
  id: string;
  kode: string;
  uri: string;
  'url-data': string;
  tittel: Title[];
  'grep-type': string;
}

export interface KjerneElementer extends UdirCoreType {
  rekkefoelge: number;
  tilhoerer_laereplan: {
    kode: string;
    uri: string;
    'url-data': string;
  };
}

export interface Laereplaner extends UdirCoreType {
  status: string;
}

export interface TverrfagligeTemaer extends UdirCoreType {
  rekkefoelge: number;
}

export interface KompetanseMaal extends UdirCoreType {
  status: string;
  rekkefoelge: number;
  tilhoerer_laereplan: {
    kode: string;
    uri: string;
    'url-data': string;
  };
}

export type KompetanseMaalsett = KompetanseMaal;

const getTitlesObject = (titles: Tekst | Title[] | undefined): Title[] => {
  return (titles as Tekst)?.tekst || titles || [];
};

// Uses nob, but falls back to default if missing.
const getTitle = (titles: Title[]): string | undefined => {
  const title = titles.find(t => t.spraak === 'nob') || titles.find(t => t.spraak === 'default');
  return title?.verdi;
};

const fetchKjerneelementer = async (code: string) =>
  fetch(grepUrl(`/kjerneelementer-lk20/${code}`));

const fetchKompetansemaal = async (code: string) => fetch(grepUrl(`/kompetansemaal-lk20/${code}`));

const fetchTverrfagligeTemaer = async (code: string) =>
  fetch(grepUrl(`/tverrfaglige-temaer-lk20/${code}`));

const fetchKompetansemaalsett = async (code: string) =>
  fetch(grepUrl(`/kompetansemaalsett-lk20/${code}`));

const fetchLaereplaner = async (code: string) => fetch(grepUrl(`/laereplaner-lk20/${code}`));

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

export const fetchGrepCodeTitle = async (grepCode: string): Promise<string | undefined | null> => {
  const res = await doGrepCodeRequest(grepCode);
  try {
    if (res?.status === 404) {
      return null;
    }
    const jsonResponse = await resolveJsonOrRejectWithError<UdirCoreType>(res);
    const titlesObj = getTitlesObject(jsonResponse?.tittel);
    const titleInLanguage = getTitle(titlesObj);
    return titleInLanguage;
  } catch (error) {
    handleError(error);
  }
};
