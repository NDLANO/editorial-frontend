/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import LearningResourceForm from './components/LearningResourceForm';
import { LicensesArrayOf } from '../../shapes';
import { toEditArticle } from '../../util/routeHelpers';
import { useFetchArticleData } from '../FormikForm/formikDraftHooks';

const EditLearningResource = ({ selectedLanguage, articleId, t, ...rest }) => {
  const {
    article,
    tags,
    updateArticle,
    updateArticleStatus,
  } = useFetchArticleData(articleId, selectedLanguage);

  if (!article || !article.id) {
    return null;
  }
  if (article.articleType !== 'standard') {
    return (
      <Redirect
        to={toEditArticle(article.id, article.articleType, article.language)}
      />
    );
  }
  const language = article.language || selectedLanguage;
  return (
    <Fragment>
      <HelmetWithTracker
        title={`${article.title} ${t('htmlTitles.titleTemplate')}`}
      />
      <LearningResourceForm
        article={{ ...article, language }}
        revision={article.revision}
        tags={tags}
        articleStatus={article.status}
        onUpdate={updateArticle}
        updateArticleStatus={updateArticleStatus}
        {...rest}
      />
    </Fragment>
  );
};

EditLearningResource.propTypes = {
  articleId: PropTypes.string.isRequired,
  licenses: LicensesArrayOf,
  locale: PropTypes.string.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
};

export default injectT(withRouter(EditLearningResource));
