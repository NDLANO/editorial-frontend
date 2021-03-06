/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import { LocaleContext } from '../../App/App';
import { LicensesArrayOf } from '../../../shapes';
import LearningResourceForm from './components/LearningResourceForm';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { toEditArticle } from '../../../util/routeHelpers';

const CreateLearningResource = ({ t, history, ...rest }) => {
  const locale = useContext(LocaleContext);
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async createdArticle => {
    const savedArticle = await createArticle(createdArticle);
    history.push(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language));
  };

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.createLearningResourcePage')} />
      <LearningResourceForm
        article={{ language: locale, grepCodes: [] }}
        updateArticle={createArticleAndPushRoute}
        history={history}
        {...rest}
      />
    </Fragment>
  );
};

CreateLearningResource.propTypes = {
  licenses: LicensesArrayOf,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectT(CreateLearningResource);
