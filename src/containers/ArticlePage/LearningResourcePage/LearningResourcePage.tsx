/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import CreateLearningResource from "./CreateLearningResource";
import EditLearningResource from "./EditLearningResource";
import ResourcePage from "../../../components/ResourcePage";
import { useDraft } from "../../../modules/draft/draftQueries";

const LearningResourcePage = () => (
  <ResourcePage
    CreateComponent={CreateLearningResource}
    EditComponent={EditLearningResource}
    useHook={useDraft}
    isArticle
  />
);

export default LearningResourcePage;
