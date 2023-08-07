/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { uuid } from '@ndla/util';
import EditMathModal from './EditMathModal';
import { useTranslation } from 'react-i18next';

const emptyMathTag = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';

interface Props {
  model: {
    innerHTML?: string;
  };
  onExit: () => void;
  onSave: (val: string) => void;
  onRemove: () => void;
  isEditMode: boolean;
}

interface MathML {
  getMathML: () => string;
  setMathML: (val: string) => void;
  insertInto: (val: HTMLElement | null) => void;
  focus: () => void;
}

const EditMath = ({ model: { innerHTML }, onExit, onRemove, onSave, isEditMode }: Props) => {
  const [openDiscardModal, setOpenDiscardModal] = useState(false);
  const [renderedMathML, setRenderedMathML] = useState(innerHTML ?? emptyMathTag);
  const [mathEditor, setMathEditor] = useState<MathML | undefined>(undefined);
  const [id] = useState(uuid());

  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.wiris.net/client/editor/editor';

    script.onload = () => {
      setMathEditor(
        // @ts-ignore
        window.com.wiris.jsEditor.JsEditor.newInstance({
          language: ['nb', 'nn'].includes(language) ? 'no' : language,
        }),
      );
      mathEditor?.setMathML(innerHTML ?? emptyMathTag);
      mathEditor?.insertInto(document.getElementById(`mathEditorContainer-${id}`));
      mathEditor?.focus();
    };

    document.head.appendChild(script);
  }, [mathEditor?.getMathML]);

  const handleExit = () => {
    if (innerHTML ?? emptyMathTag !== mathEditor?.getMathML()) {
      return setOpenDiscardModal(true);
    }
    return onExit();
  };

  return (
    <EditMathModal
      id={id}
      editMode={isEditMode}
      handleExit={handleExit}
      handleSave={() => onSave(mathEditor?.getMathML() ?? emptyMathTag)}
      handleCancelDiscard={() => setOpenDiscardModal(false)}
      handleContinue={onExit}
      handleRemove={onRemove}
      previewMath={() => setRenderedMathML(mathEditor?.getMathML() ?? emptyMathTag)}
      openDiscardModal={openDiscardModal}
      renderMathML={renderedMathML}
    />
  );
};

export default EditMath;
