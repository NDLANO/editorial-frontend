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
  display: ${p => (p.selected ? 'block' : 'none')};
  position: absolute;
  font-family: monospace;
  transform: translateY(100%);
  font-size: 0.8rem;
  background: ${colors.white};
  padding: 0 2px;
  border-radius: 4px;
  border: ${colors.brand.greyLight} solid 1px;
  left: 0;
  bottom: 0;
  color: ${colors.brand.tertiary};
  user-select: none;
  cursor: pointer;
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
