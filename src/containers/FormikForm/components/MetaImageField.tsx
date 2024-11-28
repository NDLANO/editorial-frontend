/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import oldstyled from "@emotion/styled";
import { DeleteBinLine } from "@ndla/icons/action";
import { Link } from "@ndla/icons/common";
import { FieldErrorMessage, FieldInput, FieldRoot, IconButton, FieldLabel } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { FieldWarning } from "../../../components/Form/FieldWarning";
import { FormRemainingCharacters } from "../../../components/Form/FormRemainingCharacters";
import { FormField } from "../../../components/FormField";
import MetaInformation from "../../../components/MetaInformation";

const MetaImageContainer = oldstyled.div`
  display: flex;
`;

const StyledImage = oldstyled.img`
  align-self: flex-start;
  max-width: 60%;
  margin-top: 10px;
`;

const StyledFormRemainingCharacters = styled(FormRemainingCharacters, {
  base: {
    marginInlineStart: "auto",
  },
});

interface Props {
  disableAltEditing?: boolean;
  hideAltText?: boolean;
  image: IImageMetaInformationV3;
  onImageRemove: () => void;
  showRemoveButton: boolean;
  onImageLoad?: (width: number, height: number) => void;
}

const MetaImageField = ({ image, onImageRemove, onImageLoad, disableAltEditing, hideAltText }: Props) => {
  const { t } = useTranslation();
  const copyright = image.copyright.creators.map((creator) => creator.name).join(", ");
  const title = image.title.title ?? "";
  const alt = image.alttext.alttext ?? "";
  const imageAction = (
    <>
      <IconButton
        aria-label={t("form.image.removeImage")}
        variant="danger"
        onClick={onImageRemove}
        data-testid="remove-element"
        title={t("form.image.removeImage")}
        size="small"
      >
        <DeleteBinLine />
      </IconButton>
      <SafeLinkIconButton
        variant="tertiary"
        to={`/media/image-upload/${image.id}/edit/${image.title.language}`}
        target="_blank"
        title={t("form.image.editImage")}
        size="small"
      >
        <Link />
      </SafeLinkIconButton>
    </>
  );

  const imageUrl = `${image.image.imageUrl}?width=400`;
  const { width, height } = image.image?.dimensions || { width: 0, height: 0 };
  const onLoad = () => {
    onImageLoad?.(width, height);
  };

  return (
    <>
      <MetaImageContainer>
        <StyledImage src={imageUrl} alt={alt} onLoad={onLoad} />
        <MetaInformation
          title={title}
          copyright={copyright}
          action={imageAction}
          alt={hideAltText ? undefined : disableAltEditing ? alt : undefined}
        />
      </MetaImageContainer>
      {!disableAltEditing && (
        <FormField name="metaImageAlt">
          {({ field, meta }) => (
            <FieldRoot invalid={!!meta.error}>
              <FieldLabel>{t("topicArticleForm.fields.alt.label")}</FieldLabel>
              <FieldInput {...field} placeholder={t("topicArticleForm.fields.alt.placeholder")} />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <StyledFormRemainingCharacters maxLength={300} value={field.value} />
              <FieldWarning name={field.name} />
            </FieldRoot>
          )}
        </FormField>
      )}
    </>
  );
};

export default MetaImageField;
