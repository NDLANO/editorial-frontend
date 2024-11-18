/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledMetaInformation = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

const StyledTextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

interface Props {
  title?: string;
  copyright?: string;
  alt?: string;
  action: ReactNode;
}

const MetaInformation = ({ title, copyright, action, alt }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledMetaInformation>
      {action && <div>{action}</div>}
      <StyledTextWrapper>
        {!!title && (
          <div>
            <Text fontWeight="bold">{t("form.metaImage.imageTitle")}</Text>
            <Text>{title}</Text>
          </div>
        )}
        {!!copyright && (
          <div>
            <Text fontWeight="bold">{t("form.metaImage.copyright")}</Text>
            <Text>{copyright}</Text>
          </div>
        )}
        {!!alt && (
          <div>
            <Text fontWeight="bold">{t("form.name.alttext")}</Text>
            <Text>{alt}</Text>
          </div>
        )}
      </StyledTextWrapper>
    </StyledMetaInformation>
  );
};

export default MetaInformation;
