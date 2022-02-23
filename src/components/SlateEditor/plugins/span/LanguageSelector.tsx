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
import DeleteForeverButton from '../../../DeleteForeverButton';

interface Props {
  element: SpanElement;
  onClose: () => void;
}

const languages = ['ar', 'de', 'en', 'se', 'sma', 'so', 'ti', 'zh'];

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

const StyledDeleteButton = styled(DeleteForeverButton)`
  color: ${colors.support.red};
  padding: 8px 0.5rem 8px 0.5rem;
  background: ${colors.white};
  &:hover {
    background: ${colors.support.redLight};

    color: ${colors.support.red};
  }
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

  const onDelete = () => {
    Transforms.unwrapNodes(editor, {
      match: node => node === element,
      at: [],
    });
  };

  return (
    <Container contentEditable={false}>
      {languages.map(lang => (
        <LanguageButton
          key={lang}
          language={lang}
          onClick={onClick}
          isActive={lang === element.data.lang}
        />
      ))}
      <StyledDeleteButton stripped onClick={onDelete} />
    </Container>
  );
};

export default LanguageSelector;
