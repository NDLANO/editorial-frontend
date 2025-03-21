/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, KeyboardEvent, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { FieldLabel } from "@ark-ui/react";
import { DeleteBinLine, CheckLine } from "@ndla/icons";
import { FieldInput, FieldRoot, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Metadata } from "@ndla/types-taxonomy";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID } from "../../../../../constants";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    alignItems: "flex-end",
    gap: "3xsmall",
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    width: "100%",
  },
});

const ButtonsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

interface Props {
  onSubmit: Dispatch<SetStateAction<Metadata["customFields"]>>;
  initialVal?: string;
}

const SubjectForwardField = ({ onSubmit, initialVal = "" }: Props) => {
  const { t } = useTranslation();
  const [currentVal, setCurrentVal] = useState<string | undefined>();

  const handleSubmit = () => {
    if (initialVal !== currentVal && !!currentVal) {
      onSubmit((prevState: Metadata["customFields"]) => ({
        ...prevState,
        [TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID]: currentVal,
      }));
    }
  };

  const handleDelete = () => {
    onSubmit((prevState: Metadata["customFields"]) => {
      delete prevState[TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID];
      return { ...prevState };
    });
    setCurrentVal("");
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Wrapper>
      <StyledFieldRoot>
        <FieldLabel>{t("taxonomy.metadata.customFields.oldSubjectId")}</FieldLabel>
        <FieldInput
          type="text"
          placeholder="urn:subject:***"
          value={currentVal ?? initialVal}
          onChange={(e) => setCurrentVal(e.target.value)}
          onKeyDown={handleKeyPress}
          componentSize="small"
        />
      </StyledFieldRoot>
      <ButtonsWrapper>
        <IconButton onClick={handleSubmit} size="small" title={t("taxonomy.add")} aria-label={t("taxonomy.add")}>
          <CheckLine />
        </IconButton>
        <IconButton onClick={handleDelete} size="small" variant="danger" title={t("delete")} aria-label={t("delete")}>
          <DeleteBinLine />
        </IconButton>
      </ButtonsWrapper>
    </Wrapper>
  );
};

export default SubjectForwardField;
