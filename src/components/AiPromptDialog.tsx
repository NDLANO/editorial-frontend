/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { FileListLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogRootProps,
  DialogTitle,
  ExpandableBox,
  ExpandableBoxSummary,
  FieldHelper,
  FieldLabel,
  FieldRoot,
  FieldTextArea,
  Heading,
  Spinner,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  Text,
} from "@ndla/primitives";
import { HStack, Stack, styled } from "@ndla/styled-system/jsx";
import { DialogCloseButton } from "./DialogCloseButton";
import { FormActionsContainer } from "./FormikForm";
import { PromptVariables } from "../interfaces";
import { useGenerateAIMutation } from "../modules/llm/llmMutations";
import { useDefaultAiPrompts } from "../modules/llm/llmQueries";
import { NdlaErrorPayload } from "../util/resolveJsonOrRejectWithError";

const CustomPromptsContainer = styled(Stack, {
  base: {
    marginBlockEnd: "small",
  },
});

const AnswerWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    marginBlockStart: "small",
    marginBlockEnd: "small",
    paddingBlockStart: "small",
    borderTop: "1px solid",
    borderColor: "stroke.subtle",
  },
});

const StyledText = styled(Text, {
  base: {
    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "small",
    padding: "small",
    whiteSpace: "pre-wrap",
  },
});

const trimIndent = (text: string) =>
  text
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean)
    .join(" ");

type BaseProps = {
  promptVariables: PromptVariables | (() => PromptVariables);
  language: string;
  maxTokens?: number;
  onInsert?: (generatedText: string) => void;
  onAppend?: (generatedText: string) => void;
  onReplace?: (generatedText: string) => void;
};

const PromptDialogContent = ({
  promptVariables: promptVariablesProp,
  language,
  maxTokens,
  onInsert,
  onAppend,
  onReplace,
}: BaseProps) => {
  const { t } = useTranslation();
  const [customPromptChecked, setCustomPromptChecked] = useState(false);
  const [rolePrompt, setRolePrompt] = useState("");
  const [instructionsPrompt, setInstructionsPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [fullResponse, setFullResponse] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const generateAiMutation = useGenerateAIMutation<PromptVariables>();
  const promptVariables = typeof promptVariablesProp === "function" ? promptVariablesProp() : promptVariablesProp;
  const defaultPromptsQuery = useDefaultAiPrompts(promptVariables.type, language);

  useEffect(() => {
    if (defaultPromptsQuery.data) {
      if (rolePrompt === "") setRolePrompt(trimIndent(defaultPromptsQuery.data.role));
      if (instructionsPrompt === "") setInstructionsPrompt(trimIndent(defaultPromptsQuery.data.instructions));
    }
  }, [defaultPromptsQuery.data, rolePrompt, instructionsPrompt]);

  const fetchAiGeneratedText = async () => {
    setFullResponse("");
    setGeneratedText("");
    setError(undefined);

    generateAiMutation
      .mutateAsync({
        ...promptVariables,
        language,
        max_tokens: maxTokens,
        role: rolePrompt.trim() ? rolePrompt : undefined,
        instructions: instructionsPrompt.trim() ? instructionsPrompt : undefined,
      })
      .then(({ fullResponse, answer }) => {
        setFullResponse(fullResponse);
        setGeneratedText(answer);
      })
      .catch((err: NdlaErrorPayload) =>
        setError(t(`textGeneration.failed`, { type: promptVariables.type, error: err.messages })),
      );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("textGeneration.dialogTitle", { type: promptVariables.type })}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <CustomPromptsContainer>
          <FieldRoot>
            <SwitchRoot
              checked={customPromptChecked}
              onCheckedChange={(details) => setCustomPromptChecked(details.checked)}
            >
              <SwitchLabel>{t("textGeneration.customPrompts.switchLabel")}</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchHiddenInput />
            </SwitchRoot>
          </FieldRoot>
          {customPromptChecked ? (
            defaultPromptsQuery.isPending ? (
              <Spinner size="large" />
            ) : (
              <>
                <FieldRoot>
                  <FieldLabel>{t("textGeneration.customPrompts.roleLabel")}</FieldLabel>
                  <FieldHelper>{t("textGeneration.customPrompts.roleHelper")}</FieldHelper>
                  <FieldTextArea value={rolePrompt} onChange={(e) => setRolePrompt(e.target.value)} />
                </FieldRoot>
                <FieldRoot>
                  <FieldLabel>{t("textGeneration.customPrompts.instructionsLabel")}</FieldLabel>
                  <FieldHelper>{t("textGeneration.customPrompts.instructionsHelper")}</FieldHelper>
                  <FieldTextArea value={instructionsPrompt} onChange={(e) => setInstructionsPrompt(e.target.value)} />
                </FieldRoot>
              </>
            )
          ) : null}
        </CustomPromptsContainer>
        {promptVariables.type === "alternativePhrasing" && <StyledText>{promptVariables.html}</StyledText>}
        <Button size="small" onClick={fetchAiGeneratedText} loading={generateAiMutation.isPending}>
          {t("textGeneration.generateButton", { type: promptVariables.type })}
          <FileListLine />
        </Button>
        {generateAiMutation.data ? (
          <AnswerWrapper>
            <Heading asChild consumeCss textStyle="title.small">
              <h2>{t("textGeneration.suggestedText", { type: promptVariables.type })}</h2>
            </Heading>
            <StyledText>{generatedText}</StyledText>
            {error ? (
              <Text textStyle="label.small" color="text.error">
                {error}
              </Text>
            ) : null}
            {fullResponse ? (
              <ExpandableBox>
                <ExpandableBoxSummary>{t("textGeneration.responseBox")}</ExpandableBoxSummary>
                {fullResponse}
              </ExpandableBox>
            ) : null}
          </AnswerWrapper>
        ) : null}
        <HStack justify="space-between">
          <DialogCloseTrigger asChild>
            <Button size="small" variant="secondary">
              {t("dialog.close")}
            </Button>
          </DialogCloseTrigger>
          <FormActionsContainer>
            {!!onInsert && (
              <DialogCloseTrigger asChild>
                <Button size="small" onClick={() => onInsert(generatedText)} disabled={!generatedText}>
                  {t("textGeneration.insert")}
                </Button>
              </DialogCloseTrigger>
            )}
            {!!onAppend && (
              <DialogCloseTrigger asChild>
                <Button size="small" onClick={() => onAppend(generatedText)} disabled={!generatedText}>
                  {t("textGeneration.append")}
                </Button>
              </DialogCloseTrigger>
            )}
            {!!onReplace && (
              <DialogCloseTrigger asChild>
                <Button size="small" onClick={() => onReplace(generatedText)} disabled={!generatedText}>
                  {t("textGeneration.replace")}
                </Button>
              </DialogCloseTrigger>
            )}
          </FormActionsContainer>
        </HStack>
      </DialogBody>
    </DialogContent>
  );
};

export const AiPromptDialog = ({
  promptVariables,
  language,
  maxTokens,
  children,
  onInsert,
  onAppend,
  onReplace,
  ...rest
}: DialogRootProps & BaseProps) => (
  <DialogRoot {...rest}>
    {children}
    <Portal>
      <PromptDialogContent
        promptVariables={promptVariables}
        language={language}
        maxTokens={maxTokens}
        onInsert={onInsert}
        onAppend={onAppend}
        onReplace={onReplace}
      />
    </Portal>
  </DialogRoot>
);
