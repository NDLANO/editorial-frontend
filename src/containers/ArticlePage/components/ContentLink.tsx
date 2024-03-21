/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, InputV3, Label } from "@ndla/forms";
import { FormControl } from "../../../components/FormField";

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${spacing.small};
`;

const StyledSaveButton = styled(ButtonV2)`
  align-self: flex-end;
  width: auto;
`;

interface Props {
  onAddLink: (title: string, url: string) => void;
  initialTitle?: string;
  initialUrl?: string;
}

const ContentLink = ({ onAddLink, initialTitle = "", initialUrl = "" }: Props) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setUrl(initialUrl);
  }, [initialTitle, initialUrl]);

  const isEmpty = (title: string) => {
    return title === "";
  };

  const isUrl = (field: string) => {
    const pattern = /^((http:|https:)\/\/)/;
    return pattern.test(field);
  };

  const handleSubmit = () => {
    if (!isEmpty(title) && isUrl(url)) {
      onAddLink(title, url);
      setTitle("");
      setUrl("");
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  return (
    <StyledContent>
      <FormControl isRequired isInvalid={showError && isEmpty(title)}>
        <Label textStyle="label-small" margin="none">
          {t("form.name.title")}
        </Label>
        <InputV3
          data-testid="addExternalTitleInput"
          type="text"
          placeholder={t("form.relatedContent.link.titlePlaceholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FieldErrorMessage>{t("form.relatedContent.link.missingTitle")}</FieldErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={showError && !isUrl(url)}>
        <Label textStyle="label-small" margin="none">
          {t("form.name.url")}
        </Label>
        <InputV3
          data-testid="addExternalUrlInput"
          type="text"
          placeholder={t("form.relatedContent.link.urlPlaceholder")}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <FieldErrorMessage>{t("form.relatedContent.link.missingUrl")}</FieldErrorMessage>
      </FormControl>
      <StyledSaveButton onClick={handleSubmit}>{t("save")}</StyledSaveButton>
    </StyledContent>
  );
};

export default ContentLink;
