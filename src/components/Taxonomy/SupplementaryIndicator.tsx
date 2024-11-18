/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledWrapper = styled("div", {
  base: {
    borderRadius: "full",
    border: "2px solid",
    borderColor: "stroke.subtle",
    width: "medium",
    height: "medium",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: "0",
  },
});

export const SupplementaryIndicator = () => {
  const { t } = useTranslation();
  return (
    <StyledWrapper aria-label={t("taxonomy.supplementary")} title={t("taxonomy.supplementary")}>
      <Text color="text.subtle" textStyle="label.small" fontWeight="bold">
        T
      </Text>
    </StyledWrapper>
  );
};
