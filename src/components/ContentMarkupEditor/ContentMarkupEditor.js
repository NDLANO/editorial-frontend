/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment, Suspense } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalCloseButton } from '@ndla/modal';
import { Trans } from '@ndla/i18n';
import Button from '@ndla/button';
import { fetchDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';

const MonacoEditor = React.lazy(() => import('../MonacoEditor'));

export class ContentMarkupEditor extends Component {
  state = {
    status: 'initial',
    content: undefined,
  };

  async componentDidMount() {
    try {
      const draft = await fetchDraft(this.props.draftId, this.props.language);
      this.setState({ content: draft.content.content, status: 'success' });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'error' });
    }
  }

  render() {
    const { status, content } = this.state;
    if (status === 'error') {
      return <p>Kunne ikke laste artikkel</p>;
    }
    if (status !== 'success') {
      return null;
    }

    return (
      <Trans>
        {({ t }) => (
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
                    <MonacoEditor
                      value={content}
                      onChange={content => this.setState({ content })}
                    />
                  </Suspense>
                </div>
                <Button
                  onClick={() => {
                    console.log(content);
                  }}>
                  Lagre
                </Button>
              </Fragment>
            )}
          </Modal>
        )}
      </Trans>
    );
  }
}

ContentMarkupEditor.propTypes = {
  draftId: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
};
