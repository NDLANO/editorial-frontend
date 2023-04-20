/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import CreateTopicArticle from './CreateTopicArticle';
import EditTopicArticle from './EditTopicArticle';
import { useDraft } from '../../../modules/draft/draftQueries';
import ResourcePage from '../../../components/ResourcePage';
import { articleResourcePageStyle } from '../styles';

const TopicArticlePage = () => (
  <ResourcePage
    CreateComponent={CreateTopicArticle}
    EditComponent={EditTopicArticle}
    useHook={useDraft}
    createUrl="/subject-matter/topic-article/new"
    css={articleResourcePageStyle}
  />
);

export default TopicArticlePage;
