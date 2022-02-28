/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';

interface Props {
  language: string;
  onClick: (language: string) => void;
  isActive: boolean;
}

const StyledLanguageButton = styled.button<{ isActive: boolean }>`
  font-family: monospace;
  cursor: pointer;
  background: ${p => (p.isActive ? colors.brand.lightest : colors.white)};
  color: ${p => (p.isActive ? colors.brand.primary : colors.text.primary)};

  padding: 8px 0.5rem 8px 0.5rem;
  border: none;
  &:hover {
    background: ${colors.brand.lightest};
  }
`;

const LanguageButton = ({ language, onClick, isActive }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledLanguageButton
      isActive={isActive}
      type="button"
      onClick={() => onClick(language)}
      title={t(`languages.${language}`)}>
      {language}
    </StyledLanguageButton>
  );
};

export default LanguageButton;
