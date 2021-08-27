/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import Button from '@ndla/button';
import { FormikHelpers, FormikValues } from 'formik';
import { fetchDraft, searchDrafts } from '../../../modules/draft/draftApi';
import ElementList from '../../FormikForm/components/ElementList';
import { AsyncDropdown } from '../../../components/Dropdown';
import { ContentResultType, ConvertedRelatedContent, FormikProperties } from '../../../interfaces';
import handleError from '../../../util/handleError';
import ContentLink from './ContentLink';
import { ArticleFormikType } from '../../FormikForm/articleFormHooks';

interface Props {
  locale: string;
  values: ArticleFormikType;
  field: FormikProperties['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const ContentField = ({ locale, t, values, field, form }: Props & tType) => {
  const [relatedContent, setRelatedContent] = useState<ConvertedRelatedContent[]>(
    values.relatedContent,
  );
  const [showAddExternal, setShowAddExternal] = useState(false);

  const onAddArticleToList = async (article: ContentResultType) => {
    try {
      // @ts-ignore TODO Temporary ugly hack for mismatching Article types, should be fixed when ConceptForm.jsx -> tsx
      const newArticle = (await fetchDraft(article.id, locale)) as ArticleType;

      const temp = [...relatedContent, newArticle];
      if (newArticle) {
        setRelatedContent(temp);
        updateFormik(field, temp);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (relatedContent: ConvertedRelatedContent[]) => {
    setRelatedContent(relatedContent);
    updateFormik(field, relatedContent);
  };

  const updateFormik = (formikField: Props['field'], newData: ConvertedRelatedContent[]) => {
    form.setFieldTouched('relatedContent', true, false);
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const searchForArticles = async (inp: string) => {
    return searchDrafts({
      query: inp,
      language: locale,
    });
  };

  const addExternalLink = (title: string, url: string) => {
    const temp = [...relatedContent, { title, url }];
    setRelatedContent(temp);
    updateFormik(field, temp);
  };

  return (
    <>
      <FieldHeader title={t('form.relatedContent.articlesTitle')} />
      <ElementList
        elements={relatedContent}
        messages={{
          dragElement: t('form.relatedContent.changeOrder'),
          removeElement: t('form.relatedContent.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      <AsyncDropdown
        selectedItems={relatedContent.filter(e => typeof e !== 'number')}
        idField="id"
        name="relatedConceptsSearch"
        labelField="title"
        placeholder={t('form.relatedContent.placeholder')}
        apiAction={searchForArticles}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={(concept: ContentResultType) => onAddArticleToList(concept)}
        multiSelect
        disableSelected
        clearInputField
      />
      <StyledButtonWrapper>
        <Button onClick={() => setShowAddExternal(true)}>
          {t('form.relatedContent.addExternal')}
        </Button>
      </StyledButtonWrapper>
      {showAddExternal && (
        <ContentLink onAddLink={addExternalLink} onClose={() => setShowAddExternal(false)} />
      )}
    </>
  );
};

const StyledButtonWrapper = styled.div`
  margin: ${spacing.small} 0;
`;

export default injectT(ContentField);
