/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { ModalBody, ModalHeader, ModalTitle } from "@ndla/modal";
import { Button } from "@ndla/primitives";
import { uuid } from "@ndla/util";

export const emptyMathTag = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';

const StyledMathEditorWrapper = styled.div`
  padding: ${spacing.small} 0;
  height: 40vh;
`;

const StyledMathPreviewWrapper = styled.div`
  padding: ${spacing.small} 0;
  display: flex;
  overflow: auto;
`;

const StyledButtonWrapper = styled.div`
  gap: ${spacing.small};
  display: flex;
`;

export interface MathMLType {
  getMathML: () => string;
  setMathML: (val: string) => void;
  insertInto: (val: HTMLElement | null) => void;
  focus: () => void;
}

interface Props {
  model: {
    innerHTML?: string;
  };
  onExit: () => void;
  onSave: (val: string) => void;
  onRemove: () => void;
  mathEditor: MathMLType | undefined;
  setMathEditor: Dispatch<SetStateAction<MathMLType | undefined>>;
}

const EditMath = ({ model: { innerHTML }, onExit, onRemove, onSave, mathEditor, setMathEditor }: Props) => {
  const [initialized, setInitialized] = useState(false);
  const [renderedMathML, setRenderedMathML] = useState(innerHTML ?? emptyMathTag);
  const id = useMemo(() => uuid(), []);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (initialized) {
      return;
    }
    const onScriptLoad = () => {
      //@ts-ignore
      const mathEditor = window.com.wiris.jsEditor.JsEditor.newInstance({
        language: ["nb", "nn"].includes(i18n.language) ? "no" : i18n.language,
      });
      setMathEditor(mathEditor);
      mathEditor?.setMathML(renderedMathML ?? emptyMathTag);
      mathEditor?.insertInto(document.getElementById(`mathEditorContainer-${id}`));
      mathEditor?.focus();
      setInitialized(true);
    };
    //@ts-ignore
    if (window?.com?.wiris?.jsEditor.JsEditor) {
      onScriptLoad();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.wiris.net/client/editor/editor";
    script.onload = onScriptLoad;
    document.head.appendChild(script);
  }, [i18n.language, id, initialized, renderedMathML, setMathEditor]);

  useEffect(() => {
    const node = document.getElementById(id);
    if (node && window.MathJax) window.MathJax.typesetPromise([node]);
  }, [id, renderedMathML]);

  return (
    <>
      <ModalHeader>
        <ModalTitle>{t("mathEditor.editMath")}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <hr />
        <StyledMathEditorWrapper id={`mathEditorContainer-${id}`} />
        <StyledButtonWrapper>
          <Button
            data-testid="preview-math"
            variant="secondary"
            onClick={() => setRenderedMathML(mathEditor?.getMathML() ?? emptyMathTag)}
          >
            {t("form.preview.button")}
          </Button>
          <Button
            variant="secondary"
            data-testid="save-math"
            onClick={() => onSave(mathEditor?.getMathML() ?? emptyMathTag)}
          >
            {t("form.save")}
          </Button>
          <Button data-testid="abort-math" variant="secondary" onClick={onExit}>
            {t("form.abort")}
          </Button>
          <Button variant="secondary" onClick={onRemove}>
            {t("form.remove")}
          </Button>
        </StyledButtonWrapper>
        <h3>{t("mathEditor.preview")}</h3>
        <hr />
        <StyledMathPreviewWrapper
          id={id}
          dangerouslySetInnerHTML={{
            __html: renderedMathML,
          }}
          data-testid="preview-math-text"
        />
      </ModalBody>
    </>
  );
};

export default EditMath;
