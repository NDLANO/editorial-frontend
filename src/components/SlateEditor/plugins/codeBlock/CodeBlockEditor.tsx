/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, createRef, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Editor from "react-simple-code-editor";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { InputV3, Label, Select } from "@ndla/forms";
import { languageOptions, ICodeLangugeOption } from "./codeBlockOptions";
import { editorStyle } from "./editorStyle";
import { FormControl } from "../../../FormField";
import { KEY_TAB } from "../../utils/keys";

type Props = {
  onSave: Function;
  onAbort: Function;
  highlight: (code: string, language: string) => string;
  content: {
    code: string;
    title: string;
    format: string;
  } | null;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  ${editorStyle};
`;

const InputWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: flex-end;
`;

const HeaderWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  justify-content: space-between;
`;

interface CodeContentState {
  code: string;
  title: string;
  format: string;
}

const CodeBlockEditor = ({ onSave, onAbort, highlight, content = null }: Props) => {
  const { t } = useTranslation();
  const [defaultLang] = languageOptions;
  const [codeContent, setCodeContent] = useState<CodeContentState>({
    code: content ? content.code : "",
    title: content ? content.title : defaultLang.title,
    format: content ? content.format : defaultLang.format,
  });

  const highlightWithLineNumbers = useCallback(
    (input: string, language: string) =>
      highlight(input, language)
        .split("\n")
        .map((line: string, i: number) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
        .join("\n"),
    [highlight],
  );

  const titleRef = createRef<HTMLInputElement>();

  const handleChangeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedLanguage = languageOptions.find((item: ICodeLangugeOption) => item.format === value);
    if (selectedLanguage) {
      const { format } = selectedLanguage;
      setCodeContent((prev: CodeContentState) => {
        return { ...prev, title: value, format };
      });
    }
  };

  const abort = () => {
    onAbort();
  };

  const save = () => {
    const selectedLanguage = languageOptions.find((item: ICodeLangugeOption) => item.format === codeContent.format);
    if (selectedLanguage) {
      const titleValue = titleRef.current && titleRef.current.value;
      const { title, format } = selectedLanguage;
      onSave({ ...codeContent, title: titleValue || title, format });
    }
  };
  return (
    <Wrapper>
      <HeaderWrapper>
        <InputWrapper>
          <FormControl>
            <Label margin="none" textStyle="label-small">
              {t("codeEditor.titleLabel")}
            </Label>
            <InputV3 ref={titleRef} type="text" defaultValue={codeContent.title} />
          </FormControl>
          <FormControl>
            <Label margin="none" textStyle="label-small">
              {t("codeEditor.languageSelect")}
            </Label>
            <Select onChange={handleChangeLanguage} value={codeContent.format}>
              {languageOptions.map((item: ICodeLangugeOption) => (
                <option key={`${item.title}`} value={item.format}>
                  {item.title}
                </option>
              ))}
            </Select>
          </FormControl>
        </InputWrapper>
        <ButtonWrapper>
          <ButtonV2 onClick={save}>{t("codeEditor.save")}</ButtonV2>
          <ButtonV2 variant="outline" onClick={abort}>
            {t("codeEditor.abort")}
          </ButtonV2>
        </ButtonWrapper>
      </HeaderWrapper>
      <Editor
        className="editor"
        value={codeContent.code}
        onValueChange={(code) => {
          setCodeContent({ ...codeContent, code });
        }}
        onKeyDown={(event) => {
          if (event.key === KEY_TAB) event.stopPropagation();
        }}
        highlight={(code) => highlightWithLineNumbers(code, codeContent.format)}
        padding={10}
        textareaId="codeArea"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 18,
          outline: 0,
        }}
      />
    </Wrapper>
  );
};

export default CodeBlockEditor;
