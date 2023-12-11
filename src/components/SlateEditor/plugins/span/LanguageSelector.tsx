/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useEffect } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import styled from '@emotion/styled';
import { Portal } from '@radix-ui/react-portal';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { SpanElement } from '.';
import LanguageButton from './LanguageButton';

interface Props {
  element: SpanElement;
  clicks: number;
  onClose: () => void;
  setClicks: Dispatch<SetStateAction<number>>;
}

export const languages = ['ar', 'de', 'en', 'es', 'fr', 'la', 'no', 'se', 'sma', 'so', 'ti', 'zh'];

const Container = styled.div`
  display: flex;
  font-size: 0.8rem;
  flex-direction: row;
  user-select: none;
  font-family: monospace;
  border: ${colors.brand.greyLight} solid 1px;
  background: ${colors.white};
  overflow: hidden;
  border-radius: 4px;
  border-width: 1px;
  box-shadow: 3px 3px ${spacing.xsmall} #99999959;
`;

const LanguageSelector = ({ element, clicks, onClose, setClicks }: Props) => {
  const editor = useSlateStatic();

  const handleClickFallback = () => {
    clicks > 0 ? onClose() : setClicks((prev) => prev + 1);
  };

  const handleKeypressFallback = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickFallback);
    document.addEventListener('keydown', handleKeypressFallback);
    return () => {
      document.removeEventListener('click', handleClickFallback);
      document.removeEventListener('keydown', handleKeypressFallback);
    };
  });

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
        match: (node) => node === element,
        at: [],
      },
    );
    onClose();
  };

  const onDelete = () => {
    Transforms.unwrapNodes(editor, {
      match: (node) => node === element,
      at: [],
    });
  };

  const container = document.getElementById('toolbarPortal');

  return (
    <Portal container={container}>
      <Container id={'langaugeSelector'} contentEditable={false}>
        {languages.map((lang) => (
          <LanguageButton
            key={lang}
            language={lang}
            onClick={onClick}
            isActive={lang === element.data.lang}
          />
        ))}
        <ButtonV2 variant="ghost" colorTheme="danger" contentEditable={false} onClick={onDelete}>
          <DeleteForever />
        </ButtonV2>
      </Container>
    </Portal>
  );
};

export default LanguageSelector;
