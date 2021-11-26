import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
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

const Section = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledFormContainer>
      <StyledSection {...attributes}>{children}</StyledSection>
      {editor.children.length > 1 && useSelected && (
        <div contentEditable={false}>
          <Tooltip tooltip={t('form.section.remove')} tooltipContainerClass="tooltipContainerClass">
            <DeleteForeverButton
              stripped
              onClick={() => {
                const path = ReactEditor.findPath(editor, element);
                Transforms.removeNodes(editor, { at: path });
              }}
            />
          </Tooltip>
        </div>
      )}
    </StyledFormContainer>
  );
};

export default Section;
