/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { SubjectMaterial } from '@ndla/icons/contentType';
import Modal, { ModalHeader, ModalCloseButton, ModalBody } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import Button from '@ndla/button';
import { IConceptSummary } from '@ndla/types-concept-api';

import { normalPaddingCSS } from '../../HowTo';
import { searchConcepts } from '../../../modules/concept/conceptApi';
import { search as searchArticles } from '../../../modules/search/searchApi';
import ElementList from '../../../containers/FormikForm/components/ElementList';
import { MultiSearchSummary } from '../../../modules/search/searchApiInterfaces';

type EmbedType = 'image' | 'audio' | 'concept' | 'article';

interface Props {
  id?: number;
  type: EmbedType;
  articles: MultiSearchSummary[];
  setArticles: (articles: MultiSearchSummary[]) => void;
  concepts?: IConceptSummary[];
  setConcepts?: (concepts: IConceptSummary[]) => void;
}

const ImageInformationIcon = styled(SubjectMaterial)`
  margin-top: -3px;
  color: ${colors.brand.primary};
  cursor: pointer;
`;

type SearchEmbedTypes = 'image' | 'audio' | 'concept' | 'content-link' | 'related-content';

const convertToSearchEmbedTypes = (embedType: EmbedType): SearchEmbedTypes[] => {
  switch (embedType) {
    case 'article':
      return ['content-link', 'related-content'];
    default:
      return [embedType];
  }
};

const searchObjects = (embedId: number, embedType: EmbedType) => ({
  'embed-id': embedId,
  'embed-resource': convertToSearchEmbedTypes(embedType).join(','),
  'page-size': 50,
});

const EmbedConnection = ({ id, type, articles, setArticles, concepts, setConcepts }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    let shouldUpdateState = true;
    if (id) {
      searchArticles(searchObjects(id, type)).then(result => {
        if (shouldUpdateState) setArticles(result.results);
      });
      type === 'image' &&
        searchConcepts(searchObjects(id, type)).then(result => {
          if (shouldUpdateState) setConcepts?.(result.results);
        });
    }

    return () => {
      shouldUpdateState = false;
    };
  }, [id, type, setArticles, setConcepts]);

  if (!articles?.length && !concepts?.length) {
    return null;
  }

  return (
    <Modal
      backgroundColor="white"
      narrow
      wrapperFunctionForButton={(activateButton: any) => (
        <Tooltip tooltip={t(`form.embedConnections.info.${type}`)}>{activateButton}</Tooltip>
      )}
      activateButton={
        <Button stripped>
          <ImageInformationIcon css={normalPaddingCSS} />
        </Button>
      }>
      {(onClose: () => void) => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            <h1>
              {t('form.embedConnections.title', {
                resource: t(`form.embedConnections.type.${type}`),
              })}
            </h1>
            <p>
              {t('form.embedConnections.sectionTitleArticle', {
                resource: t(`form.embedConnections.type.${type}`),
              })}{' '}
              <em>
                ({t('form.embedConnections.articles', { count: articles ? articles.length : 0 })})
              </em>
            </p>
            <ElementList
              elements={articles?.map(obj => ({
                ...obj,
                articleType: obj.learningResourceType,
              }))}
              isEditable={false}
            />

            {type === 'image' && (
              <>
                <p>
                  {t('form.embedConnections.sectionTitleConcept', {
                    resource: t(`form.embedConnections.type.${type}`),
                  })}{' '}
                  <em>
                    (
                    {t('form.embedConnections.concepts', {
                      count: concepts ? concepts.length : 0,
                    })}
                    )
                  </em>
                </p>
                <ElementList
                  elements={concepts?.map(obj => ({ ...obj, articleType: 'concept' }))}
                  isEditable={false}
                />
              </>
            )}
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default EmbedConnection;
