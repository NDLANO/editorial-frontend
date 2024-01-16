/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { IArticle, IArticleSummary, IRelatedContentLink } from '@ndla/types-backend/draft-api';
import ContentLink from './ContentLink';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { ConvertedRelatedContent, RelatedContent } from '../../../interfaces';
import { fetchDraft, searchDrafts } from '../../../modules/draft/draftApi';
import handleError from '../../../util/handleError';
import { ArticleFormType } from '../../FormikForm/articleFormHooks';
import ElementList from '../../FormikForm/components/ElementList';

interface Props {
  field: FieldInputProps<ArticleFormType['relatedContent']>;
  form: FormikHelpers<ArticleFormType>;
}

const ContentField = ({ field, form }: Props) => {
  const { t, i18n } = useTranslation();
  const [relatedContent, setRelatedContent] = useState<ConvertedRelatedContent[]>([]);
  const [showAddExternal, setShowAddExternal] = useState(false);

  useEffect(() => {
    (async () => {
      const promises = field.value.map<Promise<ConvertedRelatedContent> | IRelatedContentLink>(
        (element) => {
          if (typeof element === 'number') {
            return fetchDraft(element);
          } else return element;
        },
      );
      const content = await Promise.all(promises);
      setRelatedContent(content);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddArticleToList = async (article: IArticleSummary) => {
    try {
      const newArticle = await fetchDraft(article.id, i18n.language);
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
    const newRc: RelatedContent[] = newData.map((rc) => (isDraftApiType(rc) ? rc.id : rc));
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newRc || null,
      },
    });
  };

  const searchForArticles = async (query: string, page?: number) => {
    return searchDrafts({
      query,
      page,
      language: i18n.language,
    });
  };

  const addExternalLink = (title: string, url: string) => {
    const temp = [...relatedContent, { title, url }];
    setRelatedContent(temp);
    updateFormik(field, temp);
  };

  const isDraftApiType = (relatedContent: ConvertedRelatedContent): relatedContent is IArticle =>
    (relatedContent as IArticle).id !== undefined;

  const selectedItems = relatedContent.filter(isDraftApiType);

  return (
    <>
      <FieldHeader title={t('form.relatedContent.articlesTitle')} />
      <ElementList
        elements={relatedContent
          .filter(
            (rc: number | IArticle | IRelatedContentLink): rc is IArticle | IRelatedContentLink =>
              typeof rc !== 'number',
          )
          .map((r) => ('id' in r ? r : { ...r, isExternal: true }))}
        messages={{
          dragElement: t('form.relatedContent.changeOrder'),
          removeElement: t('form.relatedContent.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      <AsyncDropdown
        selectedItems={selectedItems}
        idField="id"
        labelField="title"
        placeholder={t('form.relatedContent.placeholder')}
        apiAction={searchForArticles}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={onAddArticleToList}
        multiSelect
        disableSelected
        clearInputField
        showPagination
      />
      <Modal open={showAddExternal} onOpenChange={setShowAddExternal}>
        <StyledButtonWrapper>
          <ModalTrigger>
            <ButtonV2>{t('form.relatedContent.addExternal')}</ButtonV2>
          </ModalTrigger>
        </StyledButtonWrapper>
        <ModalContent position="top">
          <TaxonomyLightbox title={t('form.content.relatedArticle.searchExternal')}>
            <ContentLink
              onAddLink={(title, url) => {
                addExternalLink(title, url);
                setShowAddExternal(false);
              }}
            />
          </TaxonomyLightbox>
        </ModalContent>
      </Modal>
    </>
  );
};

const StyledButtonWrapper = styled.div`
  margin: ${spacing.small} 0;
`;

export default ContentField;
