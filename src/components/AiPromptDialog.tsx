/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { FileListLine } from "@ndla/icons";
import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogRootProps,
  DialogTitle,
  FieldInput,
  FieldLabel,
  FieldRoot,
  Heading,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  Text,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { DialogCloseButton } from "./DialogCloseButton";
import { FormActionsContainer } from "./FormikForm";
import { PromptVariables } from "../modules/llm/llmApiTypes";
import { useGenerateAIMutation } from "../modules/llm/llmMutations";
import { NdlaErrorPayload } from "../util/resolveJsonOrRejectWithError";

const StyledText = styled(Text, {
  base: {
    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "small",
    padding: "small",
  },
});

type BaseProps = {
  promptVariables: PromptVariables;
  language: string;
  onInsert?: (generatedText: string) => void;
  onAppend?: (generatedText: string) => void;
  onReplace?: (generatedText: string) => void;
};

export const AiPromptDialog = ({
  promptVariables,
  language,
  children,
  onInsert,
  onAppend,
  onReplace,
  ...rest
}: DialogRootProps & BaseProps) => {
  const { t } = useTranslation();
  const [customPromptChecked, setCustomPromptChecked] = useState(false);
  const [rolePrompt, setRolePrompt] = useState("");
  const [instructionsPrompt, setInstructionsPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const { mutateAsync, isPending } = useGenerateAIMutation<PromptVariables>();

  const fetchAiGeneratedText = async () => {
    setError(undefined);
    mutateAsync({
      ...promptVariables,
      language,
      role: rolePrompt.trim() ? rolePrompt : undefined,
      instructions: instructionsPrompt.trim() ? instructionsPrompt : undefined,
    })
      .then((res) => setGeneratedText(res))
      .catch((err: NdlaErrorPayload) => setError(t("textGeneration.failed.variant", { error: err.messages })));
  };

  return (
    <DialogRoot {...rest}>
      {children}
      <Portal>
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("textGeneration.alternativeText")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <SwitchRoot
              checked={customPromptChecked}
              onClick={() => console.log("switch onClick")}
              onCheckedChange={(details) => {
                console.log("onCheckedChange", details);
                setCustomPromptChecked(details.checked);
              }}
            >
              <SwitchLabel>Label</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchHiddenInput />
            </SwitchRoot>
            {customPromptChecked ? (
              <>
                <FieldRoot required>
                  <FieldLabel>Custom role prompt</FieldLabel>
                  <FieldInput
                    value={rolePrompt}
                    onChange={(e) => setRolePrompt(e.target.value)}
                    placeholder="Insert custom role prompt"
                  />
                </FieldRoot>
                <FieldRoot required>
                  <FieldLabel>Custom instructions prompt</FieldLabel>
                  <FieldInput
                    value={instructionsPrompt}
                    onChange={(e) => setInstructionsPrompt(e.target.value)}
                    placeholder="Insert custom instructions prompt"
                  />
                </FieldRoot>
              </>
            ) : null}
            {promptVariables.type === "alternativePhrasing" && <StyledText>{promptVariables.text}</StyledText>}
            <Button size="small" onClick={fetchAiGeneratedText} loading={isPending}>
              {t("textGeneration.generate.variant")}
              <FileListLine />
            </Button>
            <Heading asChild consumeCss textStyle="label.medium">
              <h2>{t("textGeneration.suggestedText")}</h2>
            </Heading>
            <StyledText>{generatedText}</StyledText>
            {error ? (
              <Text textStyle="label.small" color="text.error">
                {error}
              </Text>
            ) : null}
            <HStack justify="space-between">
              <DialogCloseTrigger asChild>
                <Button size="small" variant="secondary">
                  {t("dialog.close")}
                </Button>
              </DialogCloseTrigger>
              <FormActionsContainer>
                {!!onInsert && (
                  <Button size="small" onClick={() => onInsert(generatedText)} disabled={!generatedText}>
                    {t("textGeneration.add")}
                  </Button>
                )}
                {!!onAppend && (
                  <Button size="small" onClick={() => onAppend(generatedText)} disabled={!generatedText}>
                    {t("textGeneration.add")}
                  </Button>
                )}
                {!!onReplace && (
                  <Button size="small" onClick={() => onReplace(generatedText)} disabled={!generatedText}>
                    {t("textGeneration.replace")}
                  </Button>
                )}
              </FormActionsContainer>
            </HStack>
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
