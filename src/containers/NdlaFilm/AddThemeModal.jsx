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
import Button from '@ndla/button';

class AddThemeModal extends React.Component {
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
    const { onAddTheme } = this.props;
    onAddTheme(this.state.newTheme);
  };

  render() {
    const { t } = this.props;
    return (
      <Modal
        narrow
        onClick={() => {
          this.setState({
            newTheme: {
              name: {
                nb: '',
                nn: '',
                en: '',
              },
              warnings: {
                nb: undefined,
                nn: undefined,
                en: undefined,
              },
            },
          });
        }}
        activateButton={<Button>Lag ny gruppe</Button>}>
        {onCloseModal => (
          <NdlaFilmThemeEditorModal
            onClose={onCloseModal}
            onEditName={this.onEditName}
            onSave={this.onSave}
            theme={this.state.newTheme}
            messages={{
              save: t('ndlaFilm.editor.createThemeGroup'),
              cancel: t('ndlaFilm.editor.cancel'),
              title: t('ndlaFilm.editor.newGroupTitle'),
            }}
          />
        )}
      </Modal>
    );
  }
}
AddThemeModal.propTypes = {
  onAddTheme: PropTypes.func,
};

export default injectT(AddThemeModal);
