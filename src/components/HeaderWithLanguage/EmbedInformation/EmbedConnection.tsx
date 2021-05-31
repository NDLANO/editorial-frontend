/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { injectT, tType } from '@ndla/i18n';
import { SubjectMaterial } from '@ndla/icons/contentType';
import Modal, { ModalHeader, ModalCloseButton, ModalBody } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import Button from '@ndla/button';

import { normalPaddingCSS } from '../../HowTo';
import { searchConcepts } from '../../../modules/concept/conceptApi';
import { search as searchArticles } from '../../../modules/search/searchApi';
import { SearchConceptType } from '../../../modules/concept/conceptApiInterfaces';
import { ContentResultType } from '../../../interfaces';
import ElementList from '../../../containers/FormikForm/components/ElementList';

type embedType = 'image' | 'audio';

interface Props {
  id: number;
  type: embedType;
}

const ImageInformationIcon = styled(SubjectMaterial)`
  margin-top: -3px;
  color: ${colors.brand.primary};
  cursor: pointer;
`;

const searchObjects = (embedId: number, embedType: embedType) => ({
  'embed-id': embedId,
  'embed-resource': embedType,
  'page-size': 50,
});

const EmbedConnection = ({ t, id, type }: Props & tType) => {
  const [articles, setArticles] = useState<ContentResultType[]>();
  const [concepts, setConcepts] = useState<SearchConceptType[]>();

  useEffect(() => {
    if (id) {
      searchArticles(searchObjects(id, type)).then(result => setArticles(result.results));
      type === 'image' &&
        searchConcepts({
          ...searchObjects(id, type),
          idList: [],
          subjects: [],
          tags: [],
          status: [],
          users: [],
        }).then(result => setConcepts(result.results));
    }
  }, [id, type]);

  if (!articles?.length && !concepts?.length) {
    return (
      <Tooltip
        tooltip={t('form.embedConnections.notInUse', {
          resource: t(`form.embedConnections.type.${type}`),
        })}>
        <SubjectMaterial css={normalPaddingCSS} />
      </Tooltip>
    );
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
                ({t('form.embedConnections.articles', { articles: articles ? articles.length : 0 })}
                )
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
                      concepts: concepts ? concepts.length : 0,
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

export default injectT(EmbedConnection);
