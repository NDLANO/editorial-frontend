/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import { colors } from '@ndla/core';
import { SpanElement } from '.';
import LanguageButton from './LanguageButton';

interface Props {
  element: SpanElement;
  onClose: () => void;
}

interface LanguageType {
  short: string;
  name: string;
}

const languages: LanguageType[] = [
  { short: 'ar', name: 'Arabisk' },
  { short: 'de', name: 'Tysk' },
  { short: 'en', name: 'Engelsk' },
  { short: 'se', name: 'Nordsamisk' },
  { short: 'sma', name: 'Sørsamisk' },
  { short: 'so', name: 'Somali' },
  { short: 'ti', name: 'Tigrinja' },
  { short: 'zh', name: 'Kinesisk' },
];

const Container = styled.div`
  display: flex;
  z-index: 1;
  font-size: 0.8rem;
  flex-direction: row;
  position: absolute;
  user-select: none;
  font-family: monospace;
  transform: translateY(100%);
  left: 0;
  top: 0;
  border: ${colors.brand.greyLight} solid 1px;
  background: ${colors.white};
  overflow: hidden;
  border-radius: 4px;
  border-width: 1px;
`;

const LanguageSelector = ({ element, onClose }: Props) => {
  const editor = useSlateStatic();

  const onClick = (language: string) => {
    Transforms.setNodes(
      editor,
      {
        data: {
          ...element.data,
          lang: language,
        },
      },
      {
        match: node => node === element,
        at: [],
      },
    );
    onClose();
  };

  return (
    <Container contentEditable={false}>
      {languages.map(lang => (
        <LanguageButton
          key={lang.short}
          language={lang}
          onClick={onClick}
          isActive={lang.short === element.data.lang}
        />
      ))}
    </Container>
  );
};

export default LanguageSelector;
