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
import { css } from '@emotion/core';
import { Input, StyledButtonWrapper } from '@ndla/forms';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Pencil } from '@ndla/icons/action';
import Button from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { EditorShape } from '../../../../shapes';
import { Portal } from '../../../Portal';
import Details from './Details';

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

const DetailsBox = props => {
  const { node, attributes, children, editor, t } = props;

  const summary = node.findDescendant(node => {
    if (node.type === 'summary') {
      return node;
    }
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const summaryTextNode = summary
    ? summary.getLastText()
    : Text.create({
        text: '',
      });
  const [inputValue, setInputvalue] = useState(summary ? summary.text : '');

  const onChangeSummary = () => {
    const newTextNode = Text.create({
      text: inputValue,
    });
    editor.replaceNodeByKey(summaryTextNode.key, newTextNode);
    setShowEditModal(false);
  };

  const toggleShowEditModdal = evt => {
    evt.preventDefault();
    setShowEditModal(!showEditModal);
  };

  const editSummaryButton = (
    <Button css={editButtonStyle} onMouseDown={toggleShowEditModdal} stripped>
      <Pencil />
    </Button>
  );

  return (
    <div draggable={!showEditModal} {...attributes}>
      <Details
        editSummaryButton={editSummaryButton}
        editor={editor}
        node={node}>
        {children}
      </Details>
      <Portal isOpened>
        <Modal controllable isOpen={showEditModal}>
          {() => (
            <>
              <ModalHeader>
                {' '}
                <ModalCloseButton
                  title={t('dialog.close')}
                  onClick={toggleShowEditModdal}
                />
              </ModalHeader>
              <ModalBody>
                <Input
                  name="caption"
                  container="div"
                  label={t('detailBox.label')}
                  type="text"
                  value={inputValue}
                  onChange={evt => setInputvalue(evt.target.value)}
                  placeholder={t('detailBox.placeholder')}
                />
                <StyledButtonWrapper paddingLeft>
                  <Button onClick={toggleShowEditModdal} outline>
                    {t('form.abort')}
                  </Button>
                  <Button onClick={onChangeSummary}>{t('form.save')}</Button>
                </StyledButtonWrapper>
              </ModalBody>
            </>
          )}
        </Modal>
      </Portal>
    </div>
  );
};

DetailsBox.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default injectT(DetailsBox);
