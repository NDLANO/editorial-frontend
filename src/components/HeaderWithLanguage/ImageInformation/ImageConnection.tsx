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
import { InformationOutline } from '@ndla/icons/common';
import Modal, { ModalHeader, ModalCloseButton, ModalBody } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import Button from '@ndla/button';
import { normalPaddingCSS } from '../../HowTo';
import ElementList from '../../../containers/FormikForm/components/ElementList';

interface Props {
  id: number;
}

const ImageInformationIcon = styled(InformationOutline)`
  margin-top: -3px;
  color: ${colors.brand.primary};
  cursor: pointer;
`;

const ImageConnection = ({ t, id }: Props & tType) => {
  const [articles, setArticles] = useState([]);
  const [concepts, setConcepts] = useState([]);

  useEffect(() => {
    //  if (id) {
    //    fetchLearningpathsWithArticle(id).then(setLearningpaths);
    //  }
  }, [id]);

  //  if (!articles.length && !concepts.length) {
  //    return null;
  //  }

  return (
    <Modal
      backgroundColor="white"
      narrow
      wrapperFunctionForButton={(activateButton: any) => (
        <Tooltip tooltip={t('form.imageConnections.info')}>{activateButton}</Tooltip>
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
            <h1>{t('form.imageConnections.title')}</h1>
            {/* <ElementList elements={learningpaths} isEditable={false} /> */}
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default injectT(ImageConnection);
