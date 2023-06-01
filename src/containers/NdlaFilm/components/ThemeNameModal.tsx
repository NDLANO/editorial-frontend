/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { ReactElement, ReactNode, useState } from 'react';
import { NdlaFilmThemeEditorModal } from '@ndla/editor';
import { Modal } from '@ndla/modal';
import { ThemeNames } from './ThemeEditor';

const blankTheme = {
  name: {
    nb: '',
    nn: '',
    en: '',
    se: '',
    sma: '',
  },
  warnings: {
    nb: false,
    nn: false,
    en: false,
    se: false,
    sma: false,
  },
};

const initialState = (initialTheme = {}) => {
  return {
    ...blankTheme,
    ...initialTheme,
  };
};

interface Props {
  onSaveTheme: (newTheme: ThemeNames) => void;
  initialTheme?: { name: ThemeNames['name'] };
  activateButton: ReactElement;
  messages: {
    save: string;
    cancel: string;
    title: string;
  };
  createTheme?: boolean;
  wrapperFunctionForButton?: (activateButton: ReactNode) => ReactNode;
}

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
    <Modal activateButton={activateButton} wrapperFunctionForButton={wrapperFunctionForButton}>
      {(onCloseModal) => (
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

export default ThemeNameModal;
