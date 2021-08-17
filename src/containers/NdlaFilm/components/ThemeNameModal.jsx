/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { NdlaFilmThemeEditorModal } from '@ndla/editor';
import Modal from '@ndla/modal';

const blankTheme = {
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
};

const initialState = (initialTheme = {}) => {
  return {
    ...blankTheme,
    ...initialTheme,
  };
};

const ThemeNameModal = props => {
  const {
    initialTheme,
    activateButton,
    messages,
    onSaveTheme,
    createTheme,
    wrapperFunctionForButton,
  } = props;
  const [newTheme, setNewTheme] = useState(initialState(initialTheme));
  return (
    <Modal
      narrow
      activateButton={activateButton}
      wrapperFunctionForButton={wrapperFunctionForButton}>
      {onCloseModal => (
        <NdlaFilmThemeEditorModal
          onClose={() => {
            if (createTheme) setNewTheme(blankTheme);
            onCloseModal();
          }}
          onEditName={evt => {
            setNewTheme({
              ...newTheme,
              name: {
                ...newTheme.name,
                [evt.lang]: evt.value,
              },
            });
          }}
          onSave={() => {
            onSaveTheme(newTheme);
            if (createTheme) setNewTheme(blankTheme);
            onCloseModal();
          }}
          theme={newTheme}
          messages={messages}
        />
      )}
    </Modal>
  );
};
ThemeNameModal.propTypes = {
  onSaveTheme: PropTypes.func.isRequired,
  initialTheme: PropTypes.shape({
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
  activateButton: PropTypes.node.isRequired,
  messages: PropTypes.shape({
    save: PropTypes.string,
    cancel: PropTypes.string,
    title: PropTypes.string,
  }),
  createTheme: PropTypes.bool,
  wrapperFunctionForButton: PropTypes.func,
};

export default ThemeNameModal;
