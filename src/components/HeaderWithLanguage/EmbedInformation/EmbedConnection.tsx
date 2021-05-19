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

interface Props {
  id: number;
}

const ImageInformationIcon = styled(SubjectMaterial)`
  margin-top: -3px;
  color: ${colors.brand.primary};
  cursor: pointer;
`;

const searchObjects = (imageId: number) => ({
  'embed-id': imageId,
  'embed-resource': 'image',
  'page-size': 50, // TODO er det sansynlig at flere enn X atikler bruker ett bilde?
});

const EmbedConnection = ({ t, id }: Props & tType) => {
  const [articles, setArticles] = useState<ContentResultType[]>();
  const [concepts, setConcepts] = useState<SearchConceptType[]>();

  useEffect(() => {
    if (id) {
      searchArticles(searchObjects(id)).then(result => setArticles(result.results));
      searchConcepts({
        ...searchObjects(id),
        idList: [],
        subjects: [],
        tags: [],
        status: [],
        users: [],
      }).then(result => setConcepts(result.results));
    }
  }, [id]);

  if (!articles?.length && !concepts?.length) {
    return (
      <Tooltip tooltip={t('form.embedConnections.notInUse')}>
        <ImageInformationIcon css={normalPaddingCSS} />
      </Tooltip>
    );
  }

  return (
    <Modal
      backgroundColor="white"
      narrow
      wrapperFunctionForButton={(activateButton: any) => (
        <Tooltip tooltip={t('form.embedConnections.info')}>{activateButton}</Tooltip>
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
            <h1>{t('form.embedConnections.title')}</h1>
            {!!articles?.length && (
              <>
                <p>
                  {t('form.embedConnections.sectionTitleArticle')}{' '}
                  <em>({t('form.embedConnections.articles', { articles: articles.length })})</em>
                </p>
                <ElementList
                  elements={articles?.map(obj => ({
                    ...obj,
                    articleType: obj.learningResourceType,
                  }))}
                  isEditable={false}
                />
              </>
            )}
            {!!concepts?.length && (
              <>
                <p>
                  {t('form.embedConnections.sectionTitleConcept')}{' '}
                  <em>({t('form.embedConnections.concepts', { concepts: concepts.length })})</em>
                </p>
                <ElementList
                  elements={concepts.map(obj => ({ ...obj, articleType: 'concept' }))}
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
