/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'cross-fetch';
import config from '../../config';
import { resolveJsonOrRejectWithError } from '../../util/resolveJsonOrRejectWithError';

const corsAnywhereUrl = `${
  config.ndlaEnvironment === 'local' ? 'https://cors-anywhere.herokuapp.com/' : ''
}`;

interface NRKMedia {
  airedDate: string;
  clipType: string;
  contributors: [];
  copyright: any | null;
  credits: any | null;
  duration: string;
  hyperlinks: {
    title: string;
    url: string;
  }[];
  images: {};
  iso8601Duration: string;
  levels: number[];
  mId: number;
  momentAired: string;
  objectives: string[];
  objectivesData: {
    code: string;
    learningProgramme: string;
    subjectName: string;
    subjectTitle: string;
    title: string;
  }[];
  program: string;
  psId: string;
  reporters: {
    name: string;
    role: string;
  }[];
  subject: string;
  summary: string;
  title: string;
}

export const fetchNrkMedia = async (mediaId: string | number) => {
  const baseUrl =
    process.env.NODE_ENV === 'unittest'
      ? 'http://nrk-api'
      : corsAnywhereUrl + 'https://nrkno-skole-prod.kube.nrk.no';

  const nrkMediaJson = await fetch(`${baseUrl}/skole/api/media/${mediaId}`);
  return resolveJsonOrRejectWithError<NRKMedia>(nrkMediaJson);
};
