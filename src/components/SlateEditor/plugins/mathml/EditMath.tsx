/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormActionsContainer } from "../../../FormikForm";
import MathML from "./MathML";

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
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

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
      mathEditor?.insertInto(containerRef.current);
      mathEditor?.focus();
      setInitialized(true);
    };
    const script = document.createElement("script");
    script.src = "https://www.wiris.net/client/editor/editor";
    script.onload = onScriptLoad;
    document.head.appendChild(script);
  }, [i18n.language, initialized, renderedMathML, setMathEditor]);

  return (
    <>
      <StyledMathEditorWrapper ref={containerRef} />
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
      <MathML innerHTML={renderedMathML} key="dialog" data-testid="math-preview" />
    </>
  );
};

export default EditMath;
