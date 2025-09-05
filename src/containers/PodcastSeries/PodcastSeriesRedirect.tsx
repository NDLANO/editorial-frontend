/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router";
import { GenericResourceRedirect } from "../../components/GenericResourceRedirect";
import { useSeries } from "../../modules/audio/audioQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<PodcastSeriesRedirect />} />;

export const PodcastSeriesRedirect = () => {
  const { id, selectedLanguage } = useParams<"id" | "selectedLanguage">();
  const parsedId = Number(id);
  const queryResult = useSeries({ id: parsedId, language: selectedLanguage }, { enabled: !!parsedId });
  return <GenericResourceRedirect queryResult={queryResult} />;
};
