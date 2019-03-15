/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import { injectT } from '@ndla/i18n';
import { Text } from 'slate';
import styled, { css } from 'react-emotion';
import { Input, StyledButtonWrapper } from '@ndla/forms';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Pencil } from '@ndla/icons/action';
import Button from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { EditorShape } from '../../../../shapes';
import DeleteButton from '../../../DeleteButton';
import { Portal } from '../../../Portal';

const DetailsBox = props => {
  const { node, editor, t } = props;

  const onRemoveClick = () => {
    editor.removeNodeByKey(node.key);
  };

  const summary = node.findDescendant(node => {
    if (node.type === 'summary') return node;
  });

  const [open, setOpen] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const summaryTextNode = summary.getLastText();
  const [inputValue, setInputvalue] = useState(summary.text);

  const onChangeSummary = () => {
    const newTextNode = Text.create({
      text: inputValue,
    });
    editor.replaceNodeByKey(summaryTextNode.key, newTextNode);
    setShowEditModal(false);
  };

  const [summaryNode, ...contentNodes] = props.children;

  return (
    <div css={detailsWrapper} {...props.attributes}>
      <StyledRow>
        <summary css={summaryStyle(open)} onClick={toggleOpen}>
          {summaryNode}
        </summary>
        {open && (
          <Button
            css={css`
              height: 100%;
              display: none;
            `}
            onClick={() => setShowEditModal(true)}
            stripped>
            <Pencil />
          </Button>
        )}
      </StyledRow>
      <Portal isOpened>
        <Modal controllable isOpen={showEditModal}>
          {props => (
            <>
              <ModalHeader>
                {' '}
                <ModalCloseButton
                  title={t('dialog.close')}
                  onClick={() => setShowEditModal(false)}
                />
              </ModalHeader>
              <ModalBody>
                <Input
                  name="caption"
                  container="div"
                  label="Endre overskrift"
                  type="text"
                  value={inputValue}
                  onChange={e => setInputvalue(e.target.value)}
                  placeholder={'Kort sammendrag'}
                />
                <StyledButtonWrapper paddingLeft>
                  <Button onClick={() => setShowEditModal(false)} outline>
                    {t('form.abort')}
                  </Button>
                  <Button onClick={onChangeSummary}>
                    {t('form.image.save')}
                  </Button>
                </StyledButtonWrapper>
              </ModalBody>
            </>
          )}
        </Modal>
      </Portal>
      <div css={contentStyle(open)}>{contentNodes}</div>
      <DeleteButton stripped onMouseDown={onRemoveClick} />
    </div>
  );
};

const detailsWrapper = css`
  position: relative;
  margin: ${spacing.large} 0;
  padding-left: 26px;
  min-height: 90px;
  border: 1px solid ${colors.brand.greyLight};
  overflow: hidden;

  > *:last-child {
    margin-bottom: 0;
  }
`;

const contentStyle = open => css`
  display: ${open ? '' : 'none'};
  margin-top: calc(${spacing.small} * 1.5 + '0px');
`;

const summaryStyle = open => css`
  color: #20588f;
  cursor: pointer;
  font-size: 20px;
  padding: 26px;
  display: flex;

  &::before {
    content: '';
    border-color: transparent #20588f;
    border-style: solid;
    border-width: 0.35em 0 0.35em 0.45em;
    display: block;
    height: 0;
    width: 0;
    left: -1em;
    top: 0.4em;
    position: relative;
    transform: ${open && 'rotate(90deg)'};
  }
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover > button,
  :focus > button {
    display: block;
  }
`;

DetailsBox.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default injectT(DetailsBox);
