/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { GenericResourceRedirect } from "../../components/GenericResourceRedirect";
import { imageQueryOptions } from "../../modules/image/imageQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<ImageRedirect />} />;

export const ImageRedirect = () => {
  const { id, selectedLanguage } = useParams<"id" | "selectedLanguage">();
  const parsedId = Number(id);
  const queryResult = useQuery({
    ...imageQueryOptions({ id: parsedId, language: selectedLanguage }),
    enabled: !!parsedId,
  });
  return <GenericResourceRedirect queryResult={queryResult} />;
};
