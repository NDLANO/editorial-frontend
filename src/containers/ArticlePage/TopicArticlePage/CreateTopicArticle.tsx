/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopicArticleForm from './components/TopicArticleForm';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { toEditArticle } from '../../../util/routeHelpers';
import { UpdatedDraftApiType } from '../../../modules/draft/draftApiInterfaces';
import { ConvertedDraftType, License } from '../../../interfaces';
import { convertUpdateToNewDraft, transformArticleFromApiVersion } from '../../../util/articleUtil';

interface Props extends RouteComponentProps {
  licenses: License[];
}

const CreateTopicArticle = ({ history, licenses }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async (
    createdArticle: UpdatedDraftApiType,
  ): Promise<ConvertedDraftType> => {
    const savedArticle = await createArticle(convertUpdateToNewDraft(createdArticle));
    history.push(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language));
    return await transformArticleFromApiVersion(savedArticle, locale);
  };

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.createTopicArticlePage')} />
      <TopicArticleForm
        article={{ language: locale, grepCodes: [] }}
        updateArticle={createArticleAndPushRoute}
        isNewlyCreated={false}
        licenses={licenses}
        translating={false}
        articleChanged={false}
      />
    </Fragment>
  );
};

export default withRouter(CreateTopicArticle);
