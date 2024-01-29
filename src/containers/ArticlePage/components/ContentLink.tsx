/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Input } from "@ndla/forms";

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
      <Input
        warningText={showError && isEmpty(title) ? t("form.relatedContent.link.missingTitle") : undefined}
        data-testid="addExternalTitleInput"
        type="text"
        placeholder={t("form.relatedContent.link.titlePlaceholder")}
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
      />
      <Input
        warningText={showError && !isUrl(url) ? t("form.relatedContent.link.missingUrl") : undefined}
        data-testid="addExternalUrlInput"
        type="text"
        placeholder={t("form.relatedContent.link.urlPlaceholder")}
        value={url}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
      />
      <StyledSaveButton onClick={handleSubmit}>{t("save")}</StyledSaveButton>
    </StyledContent>
  );
};

export default ContentLink;
