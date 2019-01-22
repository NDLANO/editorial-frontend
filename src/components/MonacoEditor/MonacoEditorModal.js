/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, Suspense } from 'react';
import Modal, { ModalCloseButton } from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';

const MonacoEditor = React.lazy(() => import('./MonacoEditor'));

const MonacoEditorModal = ({ t }) => {
  return (
    <Modal
      size="fullscreen"
      backgroundColor="white"
      activateButton={<Button>[HTML ICON]</Button>}
      minHeight="80vh">
      {onCloseModal => (
        <Fragment>
          <div css={{ float: 'right' }}>
            <ModalCloseButton
              title={t('dialog.close')}
              onClick={onCloseModal}
            />
          </div>
          <div
            css={{
              padding: '15px',
              margin: '0 auto',
              maxWidth: '800px',
            }}>
            <Suspense fallback={<div>Loading...</div>}>
              <MonacoEditor />
            </Suspense>
          </div>
        </Fragment>
      )}
    </Modal>
  );
};

MonacoEditorModal.propTypes = {};

export default injectT(MonacoEditorModal);
