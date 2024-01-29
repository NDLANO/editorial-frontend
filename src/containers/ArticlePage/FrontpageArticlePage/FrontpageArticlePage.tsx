/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import CreateFrontpageArticle from "./CreateFrontpageArticle";
import EditFrontpageArticle from "./EditFrontpageArticle";
import ResourcePage from "../../../components/ResourcePage";
import { WideArticleEditorProvider } from "../../../components/WideArticleEditorProvider";
import { useDraft } from "../../../modules/draft/draftQueries";
import { articleResourcePageStyle } from "../styles";

const FrontpageArticlePage = () => (
  <WideArticleEditorProvider initialValue={false}>
    <ResourcePage
      CreateComponent={CreateFrontpageArticle}
      EditComponent={EditFrontpageArticle}
      useHook={useDraft}
      createUrl="/subject-matter/frontpage-article/new"
      css={articleResourcePageStyle}
      isFrontpageArticle={true}
    />
  </WideArticleEditorProvider>
);

export default FrontpageArticlePage;
