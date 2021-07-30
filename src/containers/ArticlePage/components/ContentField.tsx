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
import Modal, { ModalCloseButton, ModalHeader, ModalBody } from '@ndla/modal';
import { fetchDraft, searchDrafts } from '../../../modules/draft/draftApi';
import ElementList from '../../FormikForm/components/ElementList';
import { FormikProperties, RelatedContentType } from '../../../interfaces';
import handleError from '../../../util/handleError';
import ContentLink from './ContentLink';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { DraftApiType, DraftSearchSummary } from '../../../modules/draft/draftApiInterfaces';

interface Props {
  locale: string;
  values: {
    relatedContent: RelatedContentType[];
  };
  field: FormikProperties['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const ContentField = ({ locale, t, values, field, form }: Props & tType) => {
  const [relatedContent, setRelatedContent] = useState<RelatedContentType[]>(values.relatedContent);
  console.log('values', values.relatedContent);
  console.log(relatedContent);

  const onAddArticleToList = async (article: DraftApiType) => {
    try {
      const newArticle = await fetchDraft(article.id, locale);
      const temp = [...relatedContent, newArticle];
      if (newArticle) {
        setRelatedContent(temp);
        updateFormik(field, temp);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (relatedContent: DraftApiType[]) => {
    setRelatedContent(relatedContent);
    updateFormik(field, relatedContent);
  };

  const updateFormik = (formikField: Props['field'], newData: RelatedContentType[]) => {
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

  const isDraftApiType = (item: any): item is DraftApiType => {
    return item.id !== undefined;
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
      <AsyncDropdown<DraftSearchSummary, DraftApiType>
        selectedItems={relatedContent.filter(isDraftApiType)}
        idField="id"
        labelField="title"
        placeholder={t('form.relatedContent.placeholder')}
        apiAction={searchForArticles}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={onAddArticleToList}
        multiSelect
        disableSelected
        clearInputField
      />
      <StyledButtonWrapper>
        <Modal
          backgroundColor="white"
          activateButton={<Button>{t('form.relatedContent.addExternal')}</Button>}>
          {(onClose: () => void) => (
            <>
              <ModalHeader>
                <ModalCloseButton onClick={onClose} title={t('dialog.close')} />
              </ModalHeader>
              <ModalBody>
                <ContentLink onAddLink={addExternalLink} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </Modal>
      </StyledButtonWrapper>
    </>
  );
};

const StyledButtonWrapper = styled.div`
  margin: ${spacing.small} 0;
`;

export default injectT(ContentField);
