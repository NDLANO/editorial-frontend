/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { ISeries } from '@ndla/types-audio-api';
import { AudioFormikType } from '../../containers/AudioUploader/components/AudioForm';

export interface PodcastFormValues extends AudioFormikType {
  filepath: '';
  audioType?: 'podcast';
  introduction: Descendant[];
  coverPhotoId?: string;
  metaImageAlt?: string;
  metaImageUrl?: string;
  series: ISeries | null;
  seriesId?: number;
}

export interface AudioSearchParams {
  'audio-type'?: string;
  'page-size'?: number;
  language?: string;
  page?: number;
  query?: string;
  sort?: string;
}

export interface SeriesSearchParams {
  query?: string;
  page?: number;
  'page-size'?: number;
  language?: string;
}
