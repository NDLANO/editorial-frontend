/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, {FC, useEffect, useState} from 'react';
import {injectT} from '@ndla/i18n';
import {FieldHeader} from '@ndla/forms';
import {FieldProps, FormikHelpers, FormikValues} from 'formik';
import ElementList from '../../NdlaFilm/components/ElementList';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import {fetchNewArticleId} from '../../../modules/draft/draftApi';
import {ArticleType, SubjectpageEditType, TranslateType,} from '../../../interfaces';
import handleError from '../../../util/handleError';
import {getArticle} from '../../../modules/article/articleApi';

interface Props {
  t: TranslateType;
  values: SubjectpageEditType;
  field: FieldProps<ArticleType[]>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const fetchArticleIdsFromExternalIds = async (
  externalUrns: string[],
) => {
  const externalIds = externalUrns.map((x: string) => x.replace('urn:resource:1:', ''));
  const articleIds = await Promise.all(
    externalIds.map(externalId => fetchNewArticleId(externalId))
  );
  return articleIds.map(id => id.id);
};

const fetchEditorsChoices = async (articleIds: string[]) => {
  return await Promise.all(
      articleIds.map(articleId => getArticle(articleId))
  );
};

const SubjectpageArticles: FC<Props> = ({ t, values, field, form }) => {
  const [articles, setArticles] = useState<ArticleType[]>([]);

  useEffect(() => {
    (async () => {
      const articleIds = await fetchArticleIdsFromExternalIds(
        values.editorsChoices,
      );
      const comp = await fetchEditorsChoices(articleIds);
      setArticles(comp);
    })();
  }, []);

  const getUrnForList = (list: ArticleType[]) => {
    return list.map(
      (article: ArticleType) =>
        'urn:resource:1:' + article.oldNdlaUrl.split('/').pop(),
    );
  };

  const onAddArticleToList = async (article: ArticleType) => {
    try {
      const newArticle = await getArticle(article.id);
      const temp = [...articles, newArticle];
      setArticles(temp);
      updateFormik(field, getUrnForList(temp));
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (articleList: ArticleType[]) => {
    setArticles(articleList);
    updateFormik(field, getUrnForList(articleList));
  };

  const updateFormik = (formikField: Props['field'], newData: string[]) => {
    form.setFieldTouched('editorsChoices', true, false);
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

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
          dragElement: t('subjectpageForm.changeOrder'),
          removeElement: t('subjectpageForm.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      <DropdownSearch
        selectedElements={articles}
        onClick={(e: Event) => e.stopPropagation()}
        onChange={(a: ArticleType) => onAddArticleToList(a)}
        placeholder={t('subjectpageForm.addArticle')}
        subjectId={values.subjectId}
        clearInputField
      />
    </>
  );
};

export default injectT(SubjectpageArticles);
