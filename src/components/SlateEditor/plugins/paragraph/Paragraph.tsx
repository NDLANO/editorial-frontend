import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import { ParagraphElement } from '.';
import { BlockPickerOptions } from '../blockPicker/options';

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

const Paragraph = ({ attributes, children, element }: Props) => {
  return (
    <StyledParagraph
      className={element.data?.align === 'center' ? 'u-text-center' : ''}
      {...attributes}>
      {children}
    </StyledParagraph>
  );
};

export default Paragraph;
