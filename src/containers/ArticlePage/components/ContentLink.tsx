/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FormActionsContainer, FormContent } from "../../../components/FormikForm";

interface Props {
  onAddLink: (title: string, url: string) => void;
  initialTitle?: string;
  initialUrl?: string;
}

const StyledFormContent = styled(FormContent, {
  base: {
    width: "100%",
  },
});

const URL_PATTERN = /^((http:|https:)\/\/)/;

const ContentLink = ({ onAddLink, initialTitle = "", initialUrl = "" }: Props) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setTitle(initialTitle);
    setUrl(initialUrl);
  }, [initialTitle, initialUrl]);

  const titleError = useMemo(() => {
    return title === "";
  }, [title]);

  const urlError = useMemo(() => {
    return !URL_PATTERN.test(url);
  }, [url]);

  const handleSubmit = () => {
    if (!titleError && !urlError) {
      onAddLink(title, url);
      setTitle("");
      setUrl("");
    }
  };

  return (
    <StyledFormContent>
      <FieldRoot required invalid={titleError}>
        <FieldLabel>{t("form.name.title")}</FieldLabel>
        <FieldErrorMessage>{t("form.relatedContent.link.missingTitle")}</FieldErrorMessage>
        <FieldInput
          data-testid="addExternalTitleInput"
          type="text"
          placeholder={t("form.relatedContent.link.titlePlaceholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FieldRoot>
      <FieldRoot required invalid={urlError}>
        <FieldLabel>{t("form.name.url")}</FieldLabel>
        <FieldErrorMessage>{t("form.relatedContent.link.missingUrl")}</FieldErrorMessage>
        <FieldInput
          data-testid="addExternalUrlInput"
          type="text"
          placeholder={t("form.relatedContent.link.urlPlaceholder")}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </FieldRoot>
      <FormActionsContainer>
        <Button onClick={handleSubmit}>{t("save")}</Button>
      </FormActionsContainer>
    </StyledFormContent>
  );
};

export default ContentLink;
