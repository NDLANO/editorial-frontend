/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { AudioSearch } from "../SearchPage/AudioSearch";
import { ContentSearch } from "../SearchPage/ContentSearch";
import { ImageSearch } from "../SearchPage/ImageSearch";
import { PodcastSeriesSearch } from "../SearchPage/PodcastSeriesSearch";
import { SearchPageHeader } from "../SearchPage/SearchPageHeader";

const SearchPage = () => {
  return (
    <>
      <SearchPageHeader />
      <Routes>
        <Route path="content/*" element={<PrivateRoute component={<ContentSearch />} />} />
        <Route path="audio/*" element={<PrivateRoute component={<AudioSearch />} />} />
        <Route path="image/*" element={<PrivateRoute component={<ImageSearch />} />} />
        <Route path="podcast-series/*" element={<PrivateRoute component={<PodcastSeriesSearch />} />} />
      </Routes>
    </>
  );
};

export default SearchPage;
