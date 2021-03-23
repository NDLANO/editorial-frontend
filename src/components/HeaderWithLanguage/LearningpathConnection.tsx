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
import { LearningPath } from '@ndla/icons/contentType';
import Modal, { ModalHeader, ModalCloseButton, ModalBody } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import { normalPaddingCSS } from '../HowTo';
import ElementList from '../../containers/FormikForm/components/ElementList';
import { Learningpath } from '../../interfaces';
import { fetchLearningpathsWithArticle } from '../../modules/learningpath/learningpathApi';

interface Props {
  id: number;
}

const LearningpathIcon = styled(LearningPath)`
  color: ${colors.brand.tertiary};

  &:hover,
  &:focus {
    color: ${colors.brand.primary};
    border: 1 px ${colors.brand.tertiary};
  }
`;

const LearningpathConnection = ({ t, id }: Props & tType) => {
  const [learningpaths, setLearningpaths] = useState<Learningpath[]>([]);

  useEffect(() => {
    fetchLearningpathsWithArticle(id).then(setLearningpaths);
  }, [id]);

  return (
    <Modal
      backgroundColor="white"
      narrow
      wrapperFunctionForButton={(activateButton: any) => (
        <Tooltip tooltip={t('form.learningpathConnections.sectionTitle')}>{activateButton}</Tooltip>
      )}
      activateButton={<LearningpathIcon css={normalPaddingCSS} />}>
      {(onClose: () => void) => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            <h1>{t('form.learningpathConnections.title')}</h1>
            {learningpaths.length ? (
              <ElementList elements={learningpaths} editable={false} />
            ) : (
              <p>{t('form.learningpathConnections.empty')}</p>
            )}
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default injectT(LearningpathConnection);
