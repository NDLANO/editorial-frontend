/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SearchContainer from "./SearchContainer";
import { useSearchSeries } from "../../modules/audio/audioQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<PodcastSeriesSearch />} />;

export const PodcastSeriesSearch = () => {
  return <SearchContainer type="podcast-series" searchHook={useSearchSeries} />;
};
