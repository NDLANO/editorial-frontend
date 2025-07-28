/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router-dom";
import { GenericResourceRedirect } from "../../components/GenericResourceRedirect";
import { useDraft } from "../../modules/draft/draftQueries";

export const ArticleRedirect = () => {
  const { id, selectedLanguage } = useParams<"id" | "selectedLanguage">();
  const parsedId = Number(id);
  const queryResult = useDraft({ id: parsedId, language: selectedLanguage }, { enabled: !!parsedId });
  return <GenericResourceRedirect queryResult={queryResult} />;
};
