/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import TopicArticleForm from './components/TopicArticleForm';
import { useFetchArticleData } from '../FormikForm/formikDraftHooks';
import { toEditArticle } from '../../util/routeHelpers';

const CreateTopicArticle = props => {
  const { locale, t, history, ...rest } = props;
  const { tags, createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async createdArticle => {
    const savedArticle = await createArticle(createdArticle);
    history.push(
      toEditArticle(
        savedArticle.id,
        savedArticle.articleType,
        createdArticle.language,
      ),
    );
  };

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.createTopicArticlePage')} />
      <TopicArticleForm
        article={{ language: locale }}
        staticArticle={{ notes: [] }}
        locale={locale}
        onUpdate={createArticleAndPushRoute}
        tags={tags}
        {...rest}
      />
    </Fragment>
  );
};

CreateTopicArticle.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  createMessage: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(CreateTopicArticle);
