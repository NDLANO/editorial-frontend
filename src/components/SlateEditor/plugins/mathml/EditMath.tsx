/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import he from "he";
import { Ref, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormActionsContainer } from "../../../FormikForm";
import MathML, { MathMLHandle } from "./MathML";

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

interface Props {
  model: {
    innerHTML?: string;
  };
  onSave: (val: string) => void;
  onRemove: () => void;
  setShouldShowWarning: (value: boolean) => void;
  previewMathRef: Ref<MathMLHandle | null>;
}

let cachedMathEditor: undefined | any = undefined;

const getMathEditor = (language: string) => {
  const wirisLanguage = ["nb", "nn"].includes(language) ? "no" : language;
  if (!cachedMathEditor || cachedMathEditor.language !== wirisLanguage) {
    cachedMathEditor = window.com?.wiris?.jsEditor?.JsEditor?.newInstance({
      language: wirisLanguage,
    });
  }
  return cachedMathEditor;
};

const EditMath = ({ model: { innerHTML }, onRemove, onSave, setShouldShowWarning, previewMathRef }: Props) => {
  const [wirisInitialized, setWirisInitialized] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [mathMl, setMathMl] = useState(innerHTML ?? emptyMathTag);
  const [renderedMathML, setRenderedMathML] = useState(innerHTML ?? emptyMathTag);
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wirisInitialized) {
      return;
    }
    if (window?.com?.wiris?.jsEditor?.JsEditor) {
      setWirisInitialized(true);
      return;
    }
    const onScriptLoad = () => {
      setWirisInitialized(true);
    };
    const script = document.createElement("script");
    script.src = "https://www.wiris.net/client/editor/editor";
    script.onload = onScriptLoad;
    document.head.appendChild(script);
  }, [wirisInitialized]);

  useEffect(() => {
    if (!wirisInitialized || initialized) return;
    const mathEditor = getMathEditor(i18n.language);
    mathEditor?.setMathML(renderedMathML ?? emptyMathTag);
    mathEditor?.insertInto(containerRef.current);
    mathEditor?.focus();
    const model = mathEditor?.getEditorModel();
    model?.addEditorListener({
      notifyWindowClosed: () => {},
      caretPositionChanged: () => {},
      contentChanged: () => {
        setMathMl(mathEditor?.getMathML() ?? "");
      },
    });
    setInitialized(true);
  }, [i18n.language, initialized, renderedMathML, wirisInitialized]);

  useEffect(() => {
    setShouldShowWarning(he.decode(innerHTML) !== he.decode(mathMl));
  }, [innerHTML, mathMl, setShouldShowWarning]);

  return (
    <>
      <StyledMathEditorWrapper ref={containerRef} />
      <FormActionsContainer>
        <Button data-testid="save-math" onClick={() => onSave(mathMl)}>
          {t("form.save")}
        </Button>
        <Button data-testid="preview-math" variant="secondary" onClick={() => setRenderedMathML(mathMl)}>
          {t("form.preview.button")}
        </Button>
        <Button variant="danger" onClick={onRemove}>
          {t("form.remove")}
        </Button>
      </FormActionsContainer>
      <Heading textStyle="title.small" asChild consumeCss>
        <h2>{t("mathEditor.preview")}</h2>
      </Heading>
      <MathML innerHTML={renderedMathML} key="dialog" data-testid="math-preview" ref={previewMathRef} />
    </>
  );
};

export default EditMath;
