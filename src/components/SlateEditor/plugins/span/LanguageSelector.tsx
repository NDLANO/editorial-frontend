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
import { ButtonV2 } from '@ndla/button';
import { DeleteForever } from '@ndla/icons/editor';
import { SpanElement } from '.';
import LanguageButton from './LanguageButton';
import { Portal } from '@radix-ui/react-portal';

interface Props {
  element: SpanElement;
  onClose: () => void;
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
  box-shadow: 3px 3px 5px #99999959;
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
      <Container contentEditable={false}>
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
