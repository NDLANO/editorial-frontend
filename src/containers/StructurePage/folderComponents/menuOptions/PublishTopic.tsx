/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Done } from '@ndla/icons/editor';

import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import { fetchDraft, updateStatusDraft } from '../../../../modules/draft/draftApi';
import { fetchTopicResources } from '../../../../modules/taxonomy';
import { PUBLISHED } from '../../../../util/constants/ArticleStatus';
import { ArticleType, TranslateType} from '../../../../interfaces';

interface Props {
  t: TranslateType,
  id: string,
  contentUri: string,
}

const PublishTopic = ({t, id, contentUri}: Props) => {
  const [showAlert, setShowAlert] = useState(false);

  const publishTopic = () => {
    publishArticle(contentUri);
    fetchTopicResources(id).then(
      (articles: ArticleType[]) => articles.forEach(article => {
        publishArticle(article.contentUri);
      })
    )
    setShowAlert(true);
  }

  const publishArticle = (contentUri: string) => {
    const articleId = contentUri.split(':').pop();
    fetchDraft(articleId).then((article: ArticleType) => {
      if (article.status.current !== PUBLISHED) {
        updateStatusDraft(articleId, PUBLISHED);
      }
    })
  }

  return (
    <Fragment>
      <MenuItemButton stripped onClick={publishTopic} >
        <RoundIcon small icon={<Done />} />
        {t('taxonomy.publishAll')}
      </MenuItemButton>
    </Fragment>
  )
}

PublishTopic.propTypes = {
  id: PropTypes.string.isRequired,
  contentUri: PropTypes.string.isRequired,
}

export default injectT(PublishTopic);