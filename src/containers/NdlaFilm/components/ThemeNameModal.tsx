/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import { injectT } from '@ndla/i18n';
import { NdlaFilmThemeEditorModal } from '@ndla/editor';
import Modal from '@ndla/modal';
import { ThemeNames } from '../../../util/ndlaFilmHelpers';

const blankTheme: ThemeNames = {
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

const ThemeNameModal = ({
  initialTheme,
  activateButton,
  messages,
  onSaveTheme,
  createTheme,
  wrapperFunctionForButton,
}: Props) => {
  const [newTheme, setNewTheme] = useState(initialState(initialTheme));
  return (
    <Modal
      narrow
      activateButton={activateButton}
      wrapperFunctionForButton={wrapperFunctionForButton}>
      {(onCloseModal: () => void) => (
        <NdlaFilmThemeEditorModal
          onClose={() => {
            if (createTheme) setNewTheme(blankTheme);
            onCloseModal();
          }}
          onEditName={(evt: { value: string; lang: string }) => {
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

interface Props {
  onSaveTheme: Function;
  initialTheme?: Pick<ThemeNames, 'name'>;
  activateButton: JSX.Element;
  messages: {
    save: string;
    cancel: string;
    title: string;
  };
  createTheme?: boolean;
  wrapperFunctionForButton?: (button: JSX.Element) => JSX.Element;
}

export default injectT(ThemeNameModal);
