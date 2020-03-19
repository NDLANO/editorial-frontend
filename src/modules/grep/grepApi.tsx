/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  fetchAuthorized,
  grepUrl,
  resolveJsonOrRejectWithError,
} from '../../util/apiHelpers';
import handleError from '../../util/handleError';

interface Tekst {
  tekst: {
    spraak: string;
    verdi: string;
  }[];
}

interface Title {
  spraak: string;
  verdi: string;
}

const getTitles = async (titles: Tekst | Title[] | undefined) => {
  return (titles as Tekst)?.tekst
    ? (titles as Tekst)?.tekst.find(t => t.spraak === 'default')?.verdi
    : (titles as Title[])?.find(t => t.spraak === 'default')?.verdi;
};

export const fetchCompetenceTitle = async (competenceCode: string) => {
  let url;
  if (competenceCode.startsWith('KE')) {
    url = grepUrl(`/kjerneelementer-lk20/${competenceCode}`);
  } else if (competenceCode.startsWith('KM')) {
    url = grepUrl(`/kompetansemaal-lk20/${competenceCode}`);
  } else if (competenceCode.startsWith('TT')) {
    url = grepUrl(`/tverrfaglige-temaer-lk20/${competenceCode}`);
  } else {
    return null;
  }

  try {
    const res = await fetchAuthorized(url);
    if (res.status === 404) {
      return null;
    }
    const jsonResponse = await resolveJsonOrRejectWithError(res);
    return getTitles(jsonResponse?.tittel);
  } catch (error) {
    handleError(error);
  }
};
