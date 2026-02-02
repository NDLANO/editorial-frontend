/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DeleteBinLine, CheckLine } from "@ndla/icons";
import { IconButton, Input } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Metadata } from "@ndla/types-taxonomy";
import { useState, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

const ContentWrapper = styled("div", {
  base: { display: "flex", gap: "3xsmall" },
});
interface Props {
  onSubmit: (prevState: any) => void;
  onClose?: () => void;
  initialKey?: string;
  initialVal?: string;
}

const CustomFieldComponent = ({ onSubmit, onClose, initialKey = "", initialVal = "" }: Props) => {
  const { t } = useTranslation();
  const [currentKey, setCurrentKey] = useState<string | undefined>(undefined);
  const [currentVal, setCurrentVal] = useState<string | undefined>(undefined);

  const handleSubmit = () => {
    const newPair: Record<string, string> = {};
    if (initialKey !== currentKey && currentKey != null) {
      newPair[currentKey] = currentVal ?? initialVal;
      onSubmit((prevState: Metadata["customFields"]) => {
        delete prevState[initialKey];
        return { ...prevState, ...newPair };
      });
    } else if (initialVal !== currentVal && currentVal != null) {
      newPair[initialKey] = currentVal;
      onSubmit((prevState: Metadata["customFields"]) => ({
        ...prevState,
        ...newPair,
      }));
    }
    onClose?.();
  };

  const handleDelete = () => {
    if (initialKey !== "") {
      onSubmit((prevState: Metadata["customFields"]) => {
        delete prevState[initialKey];
        return { ...prevState };
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose?.();
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <ContentWrapper>
      <Input
        type="text"
        placeholder={t("taxonomy.metadata.customFields.keyPlaceholder")}
        value={currentKey ?? initialKey}
        onChange={(e) => setCurrentKey(e.target.value)}
        onKeyDown={handleKeyPress}
        componentSize="small"
      />
      <Input
        type="text"
        placeholder={t("taxonomy.metadata.customFields.valuePlaceholder")}
        value={currentVal ?? initialVal}
        onChange={(e) => setCurrentVal(e.target.value)}
        onKeyDown={handleKeyPress}
        componentSize="small"
      />
      <IconButton variant="danger" size="small" onClick={handleDelete}>
        <DeleteBinLine />
      </IconButton>
      <IconButton size="small" onClick={handleSubmit} data-testid="CustomFieldSaveButton">
        <CheckLine />
      </IconButton>
    </ContentWrapper>
  );
};

export default CustomFieldComponent;
