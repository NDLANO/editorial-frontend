/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { Done } from '@ndla/icons/editor';

import AlertModal from '../../../../components/AlertModal/AlertModal';
import Spinner from '../../../../components/Spinner';
import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import { fetchDraft, updateStatusDraft } from '../../../../modules/draft/draftApi';
import { fetchTopicResources } from '../../../../modules/taxonomy';
import { PUBLISHED } from '../../../../util/constants/ArticleStatus';
import { ArticleType, TranslateType } from '../../../../interfaces';
import handleError from '../../../../util/handleError';

interface Props {
  t: TranslateType,
  id: string,
  contentUri: string,
}

const PublishTopic = ({ t, id, contentUri }: Props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [publishedCount, setPublishedCount] = useState(0);
  const [articleCount, setArticleCount] = useState(1);

  const publishTopic = () => {
    if (publishedCount !== articleCount) {
      fetchTopicResources(id)
      .then((articles: ArticleType[]) => {
        setArticleCount(articles.length + 1);
        setShowAlert(true);
        articles.forEach(article => {
          console.log(article)
          if (article.contentUri) publishArticle(article.contentUri);
        })
      })
      .catch((e: Error) => handleError(e));
      publishArticle(contentUri);
    }
    else {
      setShowAlert(true);
    }
  }

  const publishArticle = (contentUri: string) => {
    const articleId = contentUri.split(':').pop();
    fetchDraft(articleId).then((article: ArticleType) => {
      if (article.status.current !== PUBLISHED) {
        updateStatusDraft(articleId, PUBLISHED)
          .then(() => setPublishedCount(prevState => prevState + 1))
          .catch((e: Error) => handleError(e));
      }
      else {
        setPublishedCount(prevState => prevState + 1);
      }
    })
    .catch((e: Error) => handleError(e));
  }

  return (
    <Fragment>
      <MenuItemButton stripped onClick={publishTopic} >
        <RoundIcon small icon={<Done />} />
        {t('taxonomy.publish.button')}
      </MenuItemButton>
      <AlertModal
        show={showAlert}
        onCancel={() => {
          setShowAlert(false);
          setPublishedCount(0);
        }}
        severity={(publishedCount === articleCount)  ? 'success' : 'info'}
        text={t((publishedCount === articleCount)  ? 'taxonomy.publish.done' : 'taxonomy.publish.waiting') + ` (${publishedCount}/${articleCount})`}
        component={(publishedCount === articleCount) ? null : <Spinner />}
      />
    </Fragment>
  )
}

export default injectT(PublishTopic);