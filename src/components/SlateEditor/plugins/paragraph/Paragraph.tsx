import styled from '@emotion/styled';
import { isObject } from 'lodash';
import React, { ReactNode } from 'react';
import { Editor, Node, Path } from 'slate';
import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import { ParagraphElement } from '.';
import { BlockPickerOptions } from '../blockPicker/options';
import SlateBlockPicker from '../blockPicker/SlateBlockPicker';

interface Props {
  attributes: RenderElementProps['attributes'];
  element: ParagraphElement;
  children: ReactNode;
  language?: string;
  blockpickerOptions?: BlockPickerOptions;
  editor: Editor;
}

const StyledParagraph = styled.p`
  position: relative;
`;

const Paragraph = ({
  attributes,
  children,
  element,
  editor,
  language,
  blockpickerOptions,
}: Props) => {
  const isSelected = useSelected();

  const path = ReactEditor.findPath(editor, element);
  const anchorInParagraph =
    !!editor.selection && Path.isDescendant(editor.selection?.anchor.path, path);
  const isEmpty = Node.string(element).length === 0;

  return (
    <StyledParagraph
      className={element.data?.align === 'center' ? 'u-text-center' : ''}
      {...attributes}>
      {children}

      {language && isObject(blockpickerOptions) && (
        <SlateBlockPicker
          editor={editor}
          articleLanguage={language}
          {...blockpickerOptions}
          selectedParagraphPath={path}
          show={isEmpty && anchorInParagraph && isSelected}
        />
      )}
    </StyledParagraph>
  );
};

export default Paragraph;
