/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { ModalTrigger } from "@ndla/modal";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import MetaInformation from "../../../components/MetaInformation";
import config from "../../../config";

const StyledButton = styled(ButtonV2)`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
`;

interface Props {
  image: IImageMetaInformationV3;
  onImageSelectOpen: MouseEventHandler<HTMLButtonElement>;
}

const SubjectpageBannerImage = ({ image, onImageSelectOpen }: Props) => {
  const { t } = useTranslation();
  const imageAction = (
    <ModalTrigger>
      <StyledButton onClick={onImageSelectOpen}>{t("subjectpageForm.changeBanner")}</StyledButton>
    </ModalTrigger>
  );

  const src = `${config.ndlaApiUrl}/image-api/raw/id/${image.id}`;
  return (
    <>
      <img src={src} style={{ background: colors.brand.primary }} alt={image.alttext.alttext} />
      <div style={{ height: 5 }} />
      <MetaInformation title={image.caption.caption} action={imageAction} />
    </>
  );
};

export default SubjectpageBannerImage;
