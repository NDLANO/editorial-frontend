/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { FC, ReactElement, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Pencil } from '@ndla/icons/action';
import { spacing, colors } from '@ndla/core';
import { Input, StyledButtonWrapper } from '@ndla/forms';
import { injectT, tType } from '@ndla/i18n';
import Button from '@ndla/button';
import { Editor, Node, Block, Text } from 'slate';
import { useFormik } from 'formik';
import DeleteButton from '../../../DeleteButton';
import MoveContentButton from '../../../MoveContentButton';

const StyledDetailsDiv = styled.div`
  position: relative;
  margin: ${spacing.large} 0;
  border: 1px solid ${colors.brand.greyLight};
  overflow: hidden;
  > *:last-child {
    margin-bottom: 0;
  }
`;

const StyledContent = styled.div<{ isOpen: boolean }>`
  display: ${p => (p.isOpen ? '' : 'none')};
  margin-top: calc(${spacing.small} * 1.5);
  padding-left: ${spacing.small};
`;

const StyledSummary = styled.summary<{ isOpen: boolean }>`
  color: ${colors.brand.primary};
  cursor: pointer;
  font-size: 20px;
  padding: ${spacing.normal};
  display: flex;

  &::before {
    content: '';
    margin-left: ${spacing.normal};
    border-color: transparent ${colors.brand.primary};
    border-style: solid;
    border-width: 0.35em 0 0.35em 0.45em;
    display: block;
    height: 0;
    width: 0;
    left: -1em;
    top: 0.4em;
    position: relative;
    transform: ${p => p.isOpen && 'rotate(90deg)'};
  }
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: no-wrap;

  &:focus button,
  :hover button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const editButtonStyle = css`
height: 100%;
width: 26px;
margin-left: ${spacing.normal};
& > svg {
  width: 20px;
  height: 20px;
}

&::before {
  content: '';
  display: block;
  position: absolute;
  width: ${spacing.normal};
  height: ${spacing.normal};
  background: ${colors.support.greenLight};
  border-radius: 100%;
  transform: scale(0.5);
  opacity: 0;
  transition: all 200ms ease;
}

&:hover,
&:focus {
  &::before {
    transform: scale(1.25);
    opacity: 1;
  }
}
`;

interface Props {
  children: ReactElement[];
  editor: Editor;
  editSummaryButton: ReactElement;
  node: Node;
  showEditModal: boolean;
  inputValue: string;
  setInputValue: (val: string) => void,
  toggleShowEditModal: (evt: MouseEvent) => void,
  onChangeSummary: () => void;
  summary: Node | null;
}

const Details: FC<Props & tType> = ({ children, editor, node, summary, t }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const onRemoveClick = () => {
    editor.removeNodeByKey(node.key);
    editor.focus();
  };
  const onMoveContent = () => {
    editor.unwrapBlockByKey(node.key, (node as Block).type);
  };

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const toggleShowEditModal = (evt: MouseEvent) => {
    evt.preventDefault();
    setShowEditModal(!showEditModal);
    // editor.focus();
  };

  const summaryTextNode: Text =
    summary?.getLastText() ||
    Text.create({
      text: '',
    });

  const [inputValue, setInputValue] = useState<string>(summary?.text || '');

  const onChangeSummary = (val: string) => {
    const newTextNode = Text.create({
      text: val,
    });
    editor.replaceNodeByKey(summaryTextNode.key, newTextNode);
    setShowEditModal(false);
    // editor.focus();
    // console.log(newTextNode);
    // editor.moveToRangeOfNode(newTextNode).moveToEnd().moveForward(1).focus();
  };

  const editSummaryButton = (
    <Button css={editButtonStyle} onMouseDown={toggleShowEditModal} stripped>
      <Pencil />
    </Button>
  );

  interface vals {
    title: string;
  }

  const initialValues = {
    title: inputValue
  }

  const onSubmit = (val: vals) => onChangeSummary(val.title)
  
  const formik = useFormik<vals>({initialValues, onSubmit})
  const { values, errors, handleChange, handleBlur, setValues } = formik;

  useEffect(() => {
    setValues({ ...values });
  }, [initialValues.title]);

  const open = (evt: MouseEvent) => {
    toggleShowEditModal(evt);
  }
  const [summaryNode, ...contentNodes] = children;
  return (
    <StyledDetailsDiv className="c-bodybox">
      <StyledRow><>
        {!showEditModal && <StyledSummary isOpen={isOpen} onClick={toggleOpen}>
          {summaryNode}
        </StyledSummary>}
        {!showEditModal && isOpen && editSummaryButton}</>
        {showEditModal && <form>
        {<Input name="caption"
           container="div"
           label={t('detailBox.label')}
           type="text"
           value={values.title}
           handleBlur={handleBlur}
           onChange={handleChange}>
        </Input>
      }
      <StyledButtonWrapper>
        <Button onClick={open} outline>
          {t('form.abort')}
        </Button>
        <Button onClick={onChangeSummary}>{t('form.save')}</Button>
      </StyledButtonWrapper>
        </form>}
      </StyledRow>
      <StyledContent isOpen={isOpen}>{contentNodes}</StyledContent>
      <MoveContentButton onMouseDown={onMoveContent} />
      <DeleteButton data-cy="remove-details" stripped onMouseDown={onRemoveClick} />
    </StyledDetailsDiv>
  );
};

export default injectT(Details);
