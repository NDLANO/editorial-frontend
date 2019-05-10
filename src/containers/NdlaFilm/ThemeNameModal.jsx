/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { NdlaFilmThemeEditorModal } from '@ndla/editor';
import Modal from '@ndla/modal';

class ThemeNameModal extends React.Component {
  state = {
    newTheme: {
      name: {
        nb: '',
        nn: '',
        en: '',
      },
      warnings: {
        nb: false,
        nn: false,
        en: false,
      },
    },
  };

  onClick = state => {
    this.setState(state);
  };

  onEditName = event => {
    this.setState(prevState => ({
      newTheme: {
        ...prevState.newTheme,
        name: {
          ...prevState.newTheme.name,
          [event.lang]: event.value,
        },
      },
    }));
  };

  onSave = () => {
    const { onSaveTheme } = this.props;
    onSaveTheme(this.state.newTheme);
  };

  render() {
    const { startState, activateButton, messages } = this.props;
    return (
      <Modal
        narrow
        onClick={() => this.onClick(startState)}
        activateButton={activateButton}>
        {onCloseModal => (
          <NdlaFilmThemeEditorModal
            onClose={onCloseModal}
            onEditName={this.onEditName}
            onSave={this.onSave}
            theme={this.state.newTheme}
            messages={messages}
          />
        )}
      </Modal>
    );
  }
}
ThemeNameModal.propTypes = {
  onSaveTheme: PropTypes.func.isRequired,
  startState: PropTypes.shape({
    newTheme: PropTypes.shape({
      name: PropTypes.shape({
        nb: PropTypes.string,
        nn: PropTypes.string,
        en: PropTypes.string,
      }),
      warnings: PropTypes.shape({
        nb: PropTypes.bool,
        nn: PropTypes.bool,
        en: PropTypes.bool,
      }),
    }),
  }),
  activateButton: PropTypes.node.isRequired,
  messages: PropTypes.shape({
    save: PropTypes.string,
    cancel: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default injectT(ThemeNameModal);
