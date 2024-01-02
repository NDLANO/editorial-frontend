/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors } from '@ndla/core';
import { LearningPath } from '@ndla/icons/contentType';
import { ModalCloseButton, ModalBody, Modal, ModalTitle, ModalHeader, ModalTrigger, ModalContent } from '@ndla/modal';
import { ILearningPathV2 } from '@ndla/types-backend/learningpath-api';
import ElementList from '../../containers/FormikForm/components/ElementList';
import { fetchLearningpathsWithArticle } from '../../modules/learningpath/learningpathApi';
import { normalPaddingCSS } from '../HowTo';

interface Props {
  id?: number;
  learningpaths: ILearningPathV2[];
  setLearningpaths: (lps: ILearningPathV2[]) => void;
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
    <Modal>
      <ModalTrigger>
        <ButtonV2
          variant="stripped"
          aria-label={t('form.learningpathConnections.sectionTitle')}
          title={t('form.learningpathConnections.sectionTitle')}
        >
          <LearningpathIcon css={normalPaddingCSS} />
        </ButtonV2>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t('form.learningpathConnections.title')}</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <ElementList elements={learningpaths} isEditable={false} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LearningpathConnection;
