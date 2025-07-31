/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SearchContainer from "./SearchContainer";
import { useSearchWithCustomSubjectsFiltering } from "../../modules/search/searchQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<ContentSearch />} />;

export const ContentSearch = () => {
  return <SearchContainer type="content" searchHook={useSearchWithCustomSubjectsFiltering} />;
};
