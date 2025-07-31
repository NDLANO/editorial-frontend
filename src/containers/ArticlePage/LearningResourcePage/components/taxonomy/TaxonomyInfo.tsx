/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { TaxNode } from "../../../../../components/Taxonomy/types";

const StyledText = styled(Text, {
  variants: {
    visible: {
      false: {
        "& span": {
          fontStyle: "italic",
          color: "text.subtle",
        },
      },
    },
  },
});

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const StyledSwitchRoot = styled(SwitchRoot, {
  base: { width: "fit-content" },
});

interface Props {
  taxonomyElement?: TaxNode;
  updateMetadata: (visible: boolean) => void;
}

const TaxonomyInfo = ({ taxonomyElement, updateMetadata }: Props) => {
  const { t } = useTranslation();
  if (!taxonomyElement) return null;
  return (
    <Wrapper>
      <StyledText visible={taxonomyElement.metadata.visible}>
        <b>ID: </b>
        <span>{taxonomyElement.id}</span>
      </StyledText>
      <StyledSwitchRoot
        checked={taxonomyElement.metadata?.visible ?? true}
        onCheckedChange={(details) => updateMetadata(details.checked)}
      >
        <SwitchLabel>{t("metadata.changeVisibility")}</SwitchLabel>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchHiddenInput />
      </StyledSwitchRoot>
    </Wrapper>
  );
};

export default TaxonomyInfo;
