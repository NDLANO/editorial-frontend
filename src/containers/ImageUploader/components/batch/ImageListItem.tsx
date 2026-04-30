/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CloseLine, DeleteBinLine, PencilLine } from "@ndla/icons";
import { IconButton, ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageFormikType } from "../../imageTransformers";
import { SpecificImageInfoForm } from "./CommonInfoForm";

interface Props {
  file: File;
  initialValues: ImageFormikType | undefined;
  commonData: ImageFormikType;
  handleSubmit: (values: ImageFormikType) => void;
  onRemoveFile: (file: File) => void;
  invalid: boolean;
}

const InfoContainer = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

const StyledImg = styled("img", {
  base: {
    minHeight: "50px",
    maxHeight: "50px",
    minWidth: "70px",
    maxWidth: "70px",
    objectFit: "cover",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    flexDirection: "column",
    width: "100%",
  },
  variants: {
    invalid: {
      true: {
        backgroundColor: "surface.errorSubtle",
        borderColor: "stroke.error",
      },
      false: {},
    },
  },
});

export const ImageListItem = ({ file, initialValues, commonData, handleSubmit, invalid, onRemoveFile }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  return (
    <StyledListItemRoot asChild consumeCss nonInteractive invalid={invalid}>
      <li>
        <ListItemContent>
          <InfoContainer>
            <StyledImg src={URL.createObjectURL(file)} alt="" />
            <ListItemHeading textStyle="label.small" asChild consumeCss>
              <span>{file.name}</span>
            </ListItemHeading>
          </InfoContainer>
          <InfoContainer>
            <IconButton
              variant="secondary"
              onClick={() => setIsEditing((prev) => !prev)}
              aria-label={isEditing ? t("close") : t("form.edit")}
              title={isEditing ? t("close") : t("form.edit")}
            >
              {isEditing ? <CloseLine /> : <PencilLine />}
            </IconButton>
            <IconButton
              variant="danger"
              aria-label={t("remove")}
              title={t("remove")}
              onClick={() => onRemoveFile(file)}
            >
              <DeleteBinLine />
            </IconButton>
          </InfoContainer>
        </ListItemContent>
        {!!isEditing && (
          <SpecificImageInfoForm
            file={file}
            initialValues={initialValues}
            commonValues={commonData}
            handleSubmit={handleSubmit}
          />
        )}
      </li>
    </StyledListItemRoot>
  );
};
