/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement } from 'react';
import { Block, Document, Editor, Inline } from 'slate';
import SlateFigure from '../embed/SlateFigure';
import { SlateFigureProps } from '../../../../interfaces';

interface Options {
  language: string;
}

type ParentNode = Document | Block | Inline;

const visualElementPlugin = (options: Options) => {
  const schema = {
    blocks: {
      embed: {
        isVoid: true,
      },
    },
  };

  const renderBlock = (
    props: SlateFigureProps,
    editor: Editor,
    next: () => void,
  ): ReactElement | void => {
    const { node, isSelected } = props;
    const { language } = options;

    switch ((node as ParentNode)?.type) {
      case 'embed':
        return (
          <SlateFigure
            editor={props.editor}
            isSelected={isSelected}
            language={language}
            node={node}
          />
        );
    }
  };

  return {
    schema,
    renderBlock,
  };
};

export default visualElementPlugin;
