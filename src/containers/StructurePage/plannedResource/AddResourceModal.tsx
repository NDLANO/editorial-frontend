/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';

const StyledContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  > * {
    width: 100%;
  }
  & form {
    background-color: white;
  }
`;

interface Props {
  children: ReactNode;
  onClose: () => void;
  title: string;
}

const AddResourceModal = ({ children, onClose, title }: Props) => {
  const { t } = useTranslation();
  return (
    <TaxonomyLightbox title={title} onClose={onClose}>
      <StyledContent>{children}</StyledContent>
    </TaxonomyLightbox>
  );
};

export default AddResourceModal;
