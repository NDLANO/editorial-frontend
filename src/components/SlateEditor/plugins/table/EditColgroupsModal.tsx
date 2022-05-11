/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { lazy, Suspense, useState } from 'react';
import { Spinner } from '@ndla/editor';
import Button from '@ndla/button';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { fonts } from '@ndla/core';
import { useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { TableElement } from './interfaces';
import { Portal } from '../../../Portal';

window.MonacoEnvironment = {
  getWorkerUrl: function(moduleId: string, label: string) {
    if (label === 'html') {
      return '/static/js/html.worker.js';
    }
    return '/static/js/editor.worker.js';
  },
  globalAPI: true,
};

const MonacoEditor = lazy(() => import('../../../MonacoEditor'));

interface Props {
  element: TableElement;
}

const StyledCode = styled.code`
  ${fonts.sizes(16)}
`;

const EditColgroupsModal = ({ element }: Props) => {
  const editor = useSlateStatic();
  const { t } = useTranslation();
  const { showEditColgroups } = element;

  const [colgroups, setColgroups] = useState(element.colgroups || '');

  const onClose = () => {
    Transforms.setNodes(
      editor,
      { showEditColgroups: false },
      {
        match: node => node === element,
      },
    );
  };

  const onSave = (content: string) => {
    Transforms.setNodes(
      editor,
      { showEditColgroups: false, colgroups: content },
      {
        match: node => node === element,
      },
    );
  };

  return (
    <Portal isOpened>
      <Modal
        controllable
        isOpen={showEditColgroups}
        onClose={onClose}
        size={'large'}
        backgroundColor="white"
        minHeight="90vh">
        {() => (
          <div>
            <ModalHeader>
              <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
            </ModalHeader>
            <ModalBody>
              <h2>{t('form.content.table.colgroupTitle')}</h2>
              <p>
                {t('form.content.table.colgroupInfo')}
                <StyledCode>
                  {'<colgroup><col><col><col style="width:200px;"></colgroup>'}
                </StyledCode>
              </p>
              <Suspense fallback={<Spinner />}>
                <MonacoEditor
                  onChange={setColgroups}
                  onSave={onSave}
                  value={colgroups}
                  height={'50vh'}
                />
              </Suspense>
              <Button onClick={() => onSave(colgroups)}>{t('form.save')}</Button>
            </ModalBody>
          </div>
        )}
      </Modal>
    </Portal>
  );
};

export default EditColgroupsModal;
