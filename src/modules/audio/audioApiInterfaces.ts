/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { ISeriesDTO } from "@ndla/types-backend/audio-api";
import { AudioFormikType } from "../../containers/AudioUploader/components/AudioForm";

export interface PodcastFormValues extends AudioFormikType {
  filepath: "";
  audioType?: "podcast";
  introduction: Descendant[];
  coverPhotoId?: string;
  metaImageAlt?: string;
  metaImageUrl?: string;
  series: ISeriesDTO | null;
  seriesId?: number;
}
