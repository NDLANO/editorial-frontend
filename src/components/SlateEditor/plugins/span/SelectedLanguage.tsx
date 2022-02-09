import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { useSelected } from 'slate-react';
import { SpanElement } from '.';

interface Props {
  element: SpanElement;
  language: string;
  onClick: () => void;
}

const StyledLanguagePicker = styled.div<{ selected: boolean }>`
  position: absolute;
  font-family: monospace;
  transform: translateY(100%);
  left: 0;
  top: 0;
  color: ${colors.brand.tertiary};
  user-select: none;
  display: ${p => (p.selected ? 'block' : 'none')};
  cursor: pointer;
  min-width: 100%;
`;

const SelectedLanguage = ({ language, onClick }: Props) => {
  const selected = useSelected();
  return (
    <StyledLanguagePicker
      selected={selected}
      className="selected-language"
      onClick={onClick}
      contentEditable={false}>
      {language}
    </StyledLanguagePicker>
  );
};

export default SelectedLanguage;
