import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { colors } from '@ndla/core';
import { SectionElement } from '.';

import StyledFormContainer from '../../common/StyledFormContainer';
import DeleteForeverButton from '../../../DeleteForeverButton';

interface Props {
  attributes: RenderElementProps['attributes'];
  element: SectionElement;
  children: ReactNode;
  editor: Editor;
}

const StyledSection = styled.section`
  position: relative;
`;

const TooltipWrapper = styled.div`
  display: none;
  ${StyledFormContainer}:hover &,
  ${StyledFormContainer}:focus & {
    color: ${colors.support.red};
    display: block;
    position: absolute;
    top: 0px;
    right: 0px;
  }
`;

const Section = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledFormContainer>
      <StyledSection {...attributes}>{children}</StyledSection>
      {editor.children.length > 1 && (
        <TooltipWrapper contentEditable={false}>
          <Tooltip tooltip={t('form.section.remove')}>
            <DeleteForeverButton
              stripped
              onClick={() => {
                const path = ReactEditor.findPath(editor, element);
                Transforms.removeNodes(editor, { at: path });
              }}
            />
          </Tooltip>
        </TooltipWrapper>
      )}
    </StyledFormContainer>
  );
};

export default Section;
