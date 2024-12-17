/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { uuid } from "@ndla/util";
import { FormActionsContainer } from "../../../FormikForm";

declare global {
  interface Window {
    com?: {
      wiris?: {
        jsEditor?: {
          JsEditor?: any;
        };
      };
    };
  }
}

export const emptyMathTag = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';

const StyledMathEditorWrapper = styled("div", {
  base: {
    height: "40vh",
  },
});

const StyledMathPreviewWrapper = styled("div", {
  base: {
    display: "flex",
    overflow: "auto",
  },
});

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
  onSave: (val: string) => void;
  onRemove: () => void;
  mathEditor: MathMLType | undefined;
  setMathEditor: Dispatch<SetStateAction<MathMLType | undefined>>;
}

const EditMath = ({ model: { innerHTML }, onRemove, onSave, mathEditor, setMathEditor }: Props) => {
  const [initialized, setInitialized] = useState(false);
  const [renderedMathML, setRenderedMathML] = useState(innerHTML ?? emptyMathTag);
  const id = useMemo(() => uuid(), []);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (initialized) {
      return;
    }
    const onScriptLoad = () => {
      const mathEditor = window.com?.wiris?.jsEditor?.JsEditor?.newInstance({
        language: ["nb", "nn"].includes(i18n.language) ? "no" : i18n.language,
      });
      setMathEditor(mathEditor);
      mathEditor?.setMathML(renderedMathML ?? emptyMathTag);
      mathEditor?.insertInto(document.getElementById(`mathEditorContainer-${id}`));
      mathEditor?.focus();
      setInitialized(true);
    };
    if (window?.com?.wiris?.jsEditor?.JsEditor) {
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
      <StyledMathEditorWrapper id={`mathEditorContainer-${id}`} />
      <FormActionsContainer>
        <Button data-testid="save-math" onClick={() => onSave(mathEditor?.getMathML() ?? emptyMathTag)}>
          {t("form.save")}
        </Button>
        <Button
          data-testid="preview-math"
          variant="secondary"
          onClick={() => setRenderedMathML(mathEditor?.getMathML() ?? emptyMathTag)}
        >
          {t("form.preview.button")}
        </Button>
        <Button variant="danger" onClick={onRemove}>
          {t("form.remove")}
        </Button>
      </FormActionsContainer>
      <Heading textStyle="title.small" asChild consumeCss>
        <h2>{t("mathEditor.preview")}</h2>
      </Heading>
      <StyledMathPreviewWrapper
        id={id}
        dangerouslySetInnerHTML={{
          __html: renderedMathML,
        }}
        data-testid="preview-math-text"
      />
    </>
  );
};

export default EditMath;
