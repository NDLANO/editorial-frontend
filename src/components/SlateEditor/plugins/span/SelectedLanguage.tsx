/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
  font-size: 0.8rem;
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
