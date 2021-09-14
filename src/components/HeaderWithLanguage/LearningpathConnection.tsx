/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { LearningPath } from '@ndla/icons/contentType';
import Modal, { ModalHeader, ModalCloseButton, ModalBody } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import Button from '@ndla/button';
import { normalPaddingCSS } from '../HowTo';
import ElementList from '../../containers/FormikForm/components/ElementList';
import { Learningpath } from '../../interfaces';
import { fetchLearningpathsWithArticle } from '../../modules/learningpath/learningpathApi';

interface Props {
  id?: number;
  learningpaths: Learningpath[];
  setLearningpaths: (lps: Learningpath[]) => void;
}

const LearningpathIcon = styled(LearningPath)`
  margin-top: -3px;
  color: ${colors.brand.primary};
  cursor: pointer;
`;

const LearningpathConnection = ({ id, learningpaths, setLearningpaths }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      fetchLearningpathsWithArticle(id).then(setLearningpaths);
    }
  }, [id, setLearningpaths]);

  if (!learningpaths.length) {
    return null;
  }

  return (
    <Modal
      backgroundColor="white"
      narrow
      wrapperFunctionForButton={(activateButton: any) => (
        <Tooltip tooltip={t('form.learningpathConnections.sectionTitle')}>{activateButton}</Tooltip>
      )}
      activateButton={
        <Button stripped>
          <LearningpathIcon css={normalPaddingCSS} />
        </Button>
      }>
      {(onClose: () => void) => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            <h1>{t('form.learningpathConnections.title')}</h1>
            <ElementList elements={learningpaths} isEditable={false} />
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default LearningpathConnection;
