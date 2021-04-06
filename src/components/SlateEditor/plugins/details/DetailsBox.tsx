/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Block, Document, Editor, Inline, Node, Text } from 'slate';
import { css } from '@emotion/core';
import { Input, StyledButtonWrapper } from '@ndla/forms';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Pencil } from '@ndla/icons/action';
import Button from '@ndla/button';
import { spacing, colors } from '@ndla/core';
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

type ParentNode = Document | Block | Inline;

interface Props {
  attributes: {
    'data-key': string;
    'data-slate-object': string;
  };
  children: ReactElement[];
  editor: Editor;
  node: Node;
}

const DetailsBox = ({ t, attributes, children, editor, node }: Props & tType) => {
  const summary: Node | null = (node as ParentNode)?.findDescendant(
    node => (node as ParentNode)?.type === 'summary',
  );
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(summary?.text || '');

  const summaryTextNode: Text =
    summary?.getLastText() ||
    Text.create({
      text: '',
    });

  const onChangeSummary = () => {
    const newTextNode = Text.create({
      text: inputValue,
    });
    editor.replaceNodeByKey(summaryTextNode.key, newTextNode);
    setShowEditModal(false);
  };

  const toggleShowEditModal = (evt: MouseEvent) => {
    evt.preventDefault();
    setShowEditModal(!showEditModal);
  };

  const editSummaryButton = (
    <Button css={editButtonStyle} onMouseDown={toggleShowEditModal} stripped>
      <Pencil />
    </Button>
  );

  return (
    <div draggable={!showEditModal} {...attributes}>
      <Details editSummaryButton={editSummaryButton} editor={editor} node={node}>
        {children}
      </Details>
      <Portal isOpened>
        <Modal controllable isOpen={showEditModal}>
          {() => (
            <>
              <ModalHeader>
                {' '}
                <ModalCloseButton title={t('dialog.close')} onClick={toggleShowEditModal} />
              </ModalHeader>
              <ModalBody>
                <Input
                  name="caption"
                  container="div"
                  label={t('detailBox.label')}
                  type="text"
                  value={inputValue}
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                    setInputValue(evt.target.value)
                  }
                  placeholder={t('detailBox.placeholder')}
                />
                <StyledButtonWrapper paddingLeft>
                  <Button onClick={toggleShowEditModal} outline>
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

export default injectT(DetailsBox);
