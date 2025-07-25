/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SearchContainer from "./SearchContainer";
import { useSearchAudio } from "../../modules/audio/audioQueries";

export const AudioSearch = () => {
  return <SearchContainer type="audio" searchHook={useSearchAudio} />;
};
