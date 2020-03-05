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

export const fetchCompetenceTitle = async (competenceCode: string) => {
  let url;
  if (competenceCode.startsWith('KE')) {
    url = grepUrl(`/kjerneelementer-lk20/${competenceCode}`);
  } else if (competenceCode.startsWith('KM')) {
    url = grepUrl(`/kompetansemaal-lk20/${competenceCode}`);
  } else if (competenceCode.startsWith('KV')) {
    url = grepUrl(`/kompetansemaalsett-lk20/${competenceCode}`);
  }
  else {
    return null;
  }

  try {
    const res = await fetchAuthorized(url);
    if (res.status === 404) {
      return null;
    }

    const jsonResponse = await resolveJsonOrRejectWithError(res);
    const titles: { spraak: string; verdi: string }[] =
      jsonResponse?.tittel?.tekst;
    return titles?.find(t => t.spraak === 'default')?.verdi;
  } catch (error) {
    handleError(error);
  }
};
