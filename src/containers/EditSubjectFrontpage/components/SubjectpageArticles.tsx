/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { FieldProps } from 'formik';
import ElementList from '../../NdlaFilm/components/ElementList';
import FormikField from '../../../components/FormikField';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import {
  ArticleType,
  SubjectpageType,
  TranslateType,
} from '../../../interfaces';
import { useFetchSubjectpageData } from '../../FormikForm/formikSubjectpageHooks';
import handleError from '../../../util/handleError';

interface Props {
  t: TranslateType;
  values: SubjectpageType;
}

const SubjectpageArticles: FC<Props> = ({ t, values }) => {
  //const [ articleIds, setArticleIds ] = useState<number[]>(values.editorsChoicesIds);
  const articleIds = values.editorsChoicesIds;
  const [articles, setArticles] = useState<ArticleType[]>(
    values.editorsChoices,
  );

  const { fetchEditorsChoices } = useFetchSubjectpageData(
    values.subjectId,
    'nb',
  );

  //issue: søkeresultatet hentes i en annen form enn de andre artiklene, så må hente den på nytt..
  const onAddArticleToList = async (article: ArticleType) => {
    //denne lista må også lagres til endepunkt
    articleIds.push(article.id);
    try {
      const updatedArticles = await fetchEditorsChoices(articleIds);
      setArticles(updatedArticles);
    } catch (e) {
      handleError(e);
    }
  };

  //må lagre til endepunkt
  const saveArticleList = (articleList: ArticleType[]) => {
    setArticles(articleList);
  };

  return (
    <FormikField name={'editorsChoices'}>
      {({ field }: FieldProps) => {
        return (
          <>
            <FieldHeader
              title={t('subjectpageForm.editorsChoices')}
              subTitle={t('subjectpageForm.articles')}
            />
            <ElementList
              elements={articles}
              data-cy="editors-choices-article-list"
              messages={{
                dragElements: t('subjectpageForm.changeOrder'),
                removeElements: t('subjectpageForm.removeArticle'),
              }}
              onUpdateElements={saveArticleList}
            />
            <DropdownSearch
              selectedElements={articles}
              onChange={onAddArticleToList}
              placeholder={t('subjectpageForm.addArticle')}
              subjectId={values.subjectId}
            />
          </>
        );
      }}
    </FormikField>
  );
};

export default injectT(SubjectpageArticles);
