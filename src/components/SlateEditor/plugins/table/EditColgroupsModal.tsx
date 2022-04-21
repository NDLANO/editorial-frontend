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
import { useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
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
              <h2>{t('form.content.table.edit-colgroups')}</h2>
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
