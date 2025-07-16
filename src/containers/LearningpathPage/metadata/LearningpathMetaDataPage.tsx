/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router-dom";
import { PageContent, Spinner } from "@ndla/primitives";
import { LearningpathMetaDataForm } from "./LearningpathMetaDataForm";
import { useLearningpath } from "../../../modules/learningpath/learningpathQueries";
import NotFound from "../../NotFoundPage/NotFoundPage";

export const LearningpathMetaDataPage = () => {
  const { id, language } = useParams<"id" | "language">();
  const parsedId = parseInt(id ?? "");
  const learningpathQuery = useLearningpath({ id: parsedId, language }, { enabled: !!parsedId });

  if (!parsedId || learningpathQuery.isError) {
    return <NotFound />;
  }

  if (learningpathQuery.isPending) {
    return <Spinner />;
  }

  return (
    <PageContent>
      <title>Edit learning path</title>
      <LearningpathMetaDataForm learningpath={learningpathQuery.data} language={language ?? ""} />
    </PageContent>
  );
};
