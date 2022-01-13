/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import queryString from 'query-string';
import config from '../../config';
import {
  brightcoveApiResourceUrl,
  fetchWithBrightCoveToken,
  resolveJsonOrRejectWithError,
} from '../../util/apiHelpers';

const baseBrightCoveUrlV3 = brightcoveApiResourceUrl(
  `/v1/accounts/${config.brightCoveAccountId}/videos`,
);

interface BrightcoveQueryParams {
  query?: string;
  offset?: number;
  limit?: number;
}

interface BrightcoveImage {
  src: string;
  sources: {
    src: string;
    width: number;
    height: number;
  }[];
}

//Best effort, inferred from API call.
export interface BrightcoveApiType {
  account_id: string | null;
  clip_source_video_id: string;
  ad_keys: string | null;
  complete: boolean;
  created_at: string;
  created_by: {
    type: string;
    id: string;
    email: string;
  };
  cue_points: {
    id: string;
    metadata: string;
    name: string;
    time: number;
    type: string;
  }[];
  custom_fields: Record<string, any>;
  delivery_type: string;
  description: string;
  digital_master_id: number;
  drm_disabled: boolean;
  duration: number;
  economics: string;
  folder_id: string;
  forensic_watermarking: string;
  geo: {
    countries: string[];
    exclude_countries: boolean;
    restricted: boolean;
  };
  has_digital_master: boolean;
  id: string;
  images: Record<string, BrightcoveImage>;
  labels: string[];
  link: {
    text: string;
    url: string;
  };
  long_description: string;
  name: string;
  offline_enabled: boolean;
  original_filename: string;
  playback_rights_id: string;
  projection?: string;
  published_at: string;
  reference_id: string;
  schedule: {
    ends_at: string;
    starts_at: string;
  };
  sharing: {
    by_external_acct: boolean;
    by_id: number;
    by_reference: boolean;
    source_id: boolean;
    to_external_acct: boolean;
  };
  state: string;
  tags: string[];
  text_tracks: {
    default: boolean;
    id: string;
    kind: string;
    label: string;
    mime_type: string;
    src: string;
    srclang: string;
  }[];
  updated_at: string;
  updated_by: {
    email: string;
    id: string;
    type: string;
  };
  variants: {
    language: string;
    name: string;
    description: string;
    long_description: string;
    custom_fields: Record<string, any>;
  }[];
}

export const searchBrightcoveVideos = (query: BrightcoveQueryParams) =>
  fetchWithBrightCoveToken(
    `${baseBrightCoveUrlV3}/?${queryString.stringify({
      q: query.query || '',
      offset: query.offset,
      limit: query.limit,
    })}`,
  ).then(r => resolveJsonOrRejectWithError<BrightcoveApiType>(r));

export const fetchBrightcoveVideo = (videoId: string) =>
  fetchWithBrightCoveToken(`${baseBrightCoveUrlV3}/${videoId}`).then(r =>
    resolveJsonOrRejectWithError<BrightcoveApiType>(r),
  );

export interface VideoSearchQuery extends BrightcoveQueryParams {
  start?: number;
}

export const searchVideos = async (query: VideoSearchQuery) => {
  return await searchBrightcoveVideos(query);
};
