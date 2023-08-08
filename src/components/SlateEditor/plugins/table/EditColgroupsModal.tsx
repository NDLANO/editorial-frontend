/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { lazy, Suspense, useState } from 'react';
import { Spinner } from '@ndla/icons';
import { ButtonV2 } from '@ndla/button';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  Modal,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
import { fonts } from '@ndla/core';
import { useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Pencil } from '@ndla/icons/action';
import { TableElement } from './interfaces';

window.MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    if (label === 'html') {
      return process.env.NODE_ENV !== 'production'
        ? '/static/js/html.worker.js'
        : // @ts-ignore
          window.assets['html.worker.js'] ?? '';
    }
    return process.env.NODE_ENV !== 'production'
      ? '/static/js/editor.worker.js'
      : // @ts-ignore
        window.assets['editor.worker.js'] ?? '';
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
  const [open, setOpen] = useState(false);
  const editor = useSlateStatic();
  const { t } = useTranslation();

  const [colgroups, setColgroups] = useState(element.colgroups || '');

  const onSave = (content: string) => {
    Transforms.setNodes(
      editor,
      { colgroups: content },
      {
        match: (node) => node === element,
      },
    );
    setOpen(false);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <ButtonV2
          data-cy={'edit-colgroups'}
          variant="stripped"
          title={t('form.content.table.edit-colgroups')}
        >
          {t('form.content.table.colgroups')}
          <Pencil />
        </ButtonV2>
      </ModalTrigger>
      <ModalContent size="large">
        <ModalHeader>
          <ModalTitle>{t('form.content.table.colgroupTitle')}</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <p>
            {t('form.content.table.colgroupInfo')}
            <StyledCode>{'<colgroup><col><col><col style="width:200px;"></colgroup>'}</StyledCode>
          </p>
          <Suspense fallback={<Spinner />}>
            <MonacoEditor
              onChange={setColgroups}
              onSave={onSave}
              value={colgroups}
              height={'50vh'}
            />
          </Suspense>
          <ButtonV2 onClick={() => onSave(colgroups)}>{t('form.save')}</ButtonV2>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditColgroupsModal;
