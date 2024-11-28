/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, useFormikContext } from "formik";
import { ComponentProps, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Editor from "react-simple-code-editor";
import { FieldContext, SelectHiddenSelect, createListCollection } from "@ark-ui/react";
import {
  Button,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  SelectContent,
  SelectLabel,
  SelectRoot,
  SelectValueText,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { languageOptions } from "./codeBlockOptions";
import { GenericSelectItem, GenericSelectTrigger } from "../../../abstractions/Select";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { KEY_TAB } from "../../utils/keys";

type Props = {
  onSave: (values: CodeBlockFormValues) => void;
  onAbort: VoidFunction;
  highlight: (code: string, language: string) => string;
  content: CodeBlockFormValues | undefined;
  setShowWarning: (show: boolean) => void;
};

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});

const InputWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "flex-end",
    gap: "xsmall",
  },
});

const EditorWrapper = styled("div", {
  base: {
    overflowX: "auto",
    // style overrides for react-simple-code-editor
    "& pre": {
      whiteSpace: "pre!",
    },
    "& textarea": {
      paddingBlock: "xsmall!",
      paddingInlineStart: "60px!",
      outline: "none!",
    },
    "& .codeblock": {
      position: "relative!",
      display: "inline-block!",
      minWidth: "100%",
    },
  },
});

interface CodeBlockFormValues {
  code: string;
  title: string;
  format: string;
}

const rules: RulesType<CodeBlockFormValues> = {
  title: {
    required: true,
  },
  code: {
    required: true,
  },
  format: {
    required: true,
  },
};

const toInitialValues = (initialData?: CodeBlockFormValues): CodeBlockFormValues => {
  return {
    code: initialData?.code ?? "",
    title: initialData?.title ?? languageOptions[0].title,
    format: initialData?.format ?? languageOptions[0].format,
  };
};

const CodeBlockEditor = ({ onSave, onAbort, highlight, content, setShowWarning }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(content), [content]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const abort = () => {
    onAbort();
  };

  const collection = useMemo(
    () =>
      createListCollection({
        items: languageOptions,
        itemToValue: (item) => item.format,
        itemToString: (item) => item.title,
      }),
    [],
  );

  const onValidate = useCallback((values: CodeBlockFormValues) => validateFormik(values, rules, t), [t]);

  const onSubmit = useCallback(
    (values: CodeBlockFormValues) => {
      onSave(values);
    },
    [onSave],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validateOnMount
      validate={onValidate}
    >
      <FormikForm>
        <HeaderWrapper>
          <InputWrapper>
            <FormField name="title">
              {({ field, meta }) => (
                <FieldRoot required invalid={!!meta.error}>
                  <FieldLabel>{t("codeEditor.titleLabel")}</FieldLabel>
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  <FieldInput {...field} />
                </FieldRoot>
              )}
            </FormField>
            <FormField name="format">
              {({ field, helpers, meta }) => (
                <FieldRoot required invalid={!!meta.error}>
                  <SelectRoot
                    value={[field.value]}
                    onValueChange={(details) => helpers.setValue(details.items[0].format, true)}
                    collection={collection}
                    positioning={{ sameWidth: true }}
                  >
                    <SelectLabel>{t("codeEditor.languageSelect")}</SelectLabel>
                    <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                    <GenericSelectTrigger>
                      <SelectValueText />
                    </GenericSelectTrigger>
                    <SelectContent>
                      {languageOptions.map((item) => (
                        <GenericSelectItem key={item.format} item={item}>
                          {item.title}
                        </GenericSelectItem>
                      ))}
                    </SelectContent>
                    <SelectHiddenSelect data-testid="code-language" />
                  </SelectRoot>
                </FieldRoot>
              )}
            </FormField>
          </InputWrapper>
          <FormActionsContainer>
            <Button variant="secondary" onClick={abort}>
              {t("codeEditor.abort")}
            </Button>
            <Button type="submit">{t("codeEditor.save")}</Button>
          </FormActionsContainer>
        </HeaderWrapper>
        <FormField name="code">
          {({ field, helpers, meta }) => (
            <FieldRoot required invalid={!!meta.error}>
              <FieldLabel>Kode</FieldLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldContext>
                {(context) => (
                  <EditorWrapper>
                    <CodeEditor
                      {...field}
                      className="codeblock"
                      textareaId={context.ids.control}
                      onValueChange={helpers.setValue}
                      onKeyDown={(event) => {
                        if (event.key === KEY_TAB) event.stopPropagation();
                      }}
                      highlightFunc={highlight}
                      tabSize={2}
                      padding={0}
                      insertSpaces={false}
                      ignoreTabKey={false}
                      setShowWarning={setShowWarning}
                    />
                  </EditorWrapper>
                )}
              </FieldContext>
            </FieldRoot>
          )}
        </FormField>
      </FormikForm>
    </Formik>
  );
};

interface CodeEditorProps extends Omit<ComponentProps<typeof Editor>, "highlight"> {
  highlightFunc: (code: string, language: string) => string;
  setShowWarning: (show: boolean) => void;
}

const CodeEditor = ({ highlightFunc, setShowWarning, ...props }: CodeEditorProps) => {
  const { values, dirty } = useFormikContext<CodeBlockFormValues>();

  const highlightWithLineNumbers = useCallback(
    (input: string, language: string) =>
      highlightFunc(input, language)
        .split("\n")
        .map((line: string, i: number) => `<span class='linenumber'>${i + 1}</span>${line}`)
        .join("\n"),
    [highlightFunc],
  );

  useEffect(() => {
    setShowWarning(dirty);
  }, [dirty, setShowWarning]);

  return <Editor {...props} highlight={(code) => highlightWithLineNumbers(code, values.format)} />;
};

export default CodeBlockEditor;
