import styled from '@emotion/styled';
import { colors } from '@ndla/core';

export interface LanguageType {
  short: string;
  name: string;
}

interface Props {
  language: LanguageType;
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
  return (
    <StyledLanguageButton
      isActive={isActive}
      type="button"
      onClick={() => onClick(language.short)}
      title={language.name}>
      {language.short}
    </StyledLanguageButton>
  );
};

export default LanguageButton;
