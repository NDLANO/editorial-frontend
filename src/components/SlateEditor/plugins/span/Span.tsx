/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { colors } from '@ndla/core';
import { RenderElementProps, useSelected, useSlateStatic } from 'slate-react';
import { SpanElement } from '.';
import SelectedLanguage from './SelectedLanguage';
import LanguageSelector from './LanguageSelector';
import { showToolbar } from '../toolbar/SlateToolbar';

interface Props {
  attributes: RenderElementProps['attributes'];
  element: SpanElement;
  children: ReactNode;
}

const StyledSpan = styled.span<{ language?: string }>`
  position: relative;
  text-decoration: underline;
  text-decoration-color: ${colors.brand.tertiary};
  &:hover > .selected-language {
    display: block;
  }
`;

const Span = ({ element, attributes, children }: Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [clicks, setClicks] = useState<number>(0);
  const language = element.data.lang;
  const selected = useSelected();
  const { selection } = useSlateStatic();

  useEffect(() => {
    if (!selected) {
      setShowPicker(false);
    }
  }, [selection, selected]);

  return (
    <StyledSpan {...attributes} language={language}>
      {children}
      {!language || showPicker ? (
        <LanguageSelector
          element={element}
          onClose={() => {
            setShowPicker(false);
            setClicks(0);
          }}
          clicks={clicks}
          setClicks={setClicks}
        />
      ) : (
        <SelectedLanguage
          language={language}
          element={element}
          onClick={() => {
            const toolbar = document.getElementById('toolbarContainer');
            if (toolbar) {
              showToolbar(toolbar);
            }
            setShowPicker(true);
          }}
        />
      )}
    </StyledSpan>
  );
};

export default Span;
