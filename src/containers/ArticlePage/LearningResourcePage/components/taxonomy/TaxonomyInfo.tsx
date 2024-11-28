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
import { TaxNode } from "./TaxonomyBlock";

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

interface Props {
  taxonomyElement?: TaxNode;
  updateMetadata: (visible: boolean) => void;
}

const TaxonomyInfo = ({ taxonomyElement, updateMetadata }: Props) => {
  const { t } = useTranslation();
  if (!taxonomyElement) return null;
  return (
    <>
      <StyledText visible={taxonomyElement.metadata.visible}>
        <b>ID: </b>
        <span>{taxonomyElement.id}</span>
      </StyledText>
      <SwitchRoot
        checked={taxonomyElement.metadata?.visible ?? true}
        onCheckedChange={(details) => updateMetadata(details.checked)}
      >
        <SwitchLabel>{t("metadata.changeVisibility")}</SwitchLabel>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchHiddenInput />
      </SwitchRoot>
    </>
  );
};

export default TaxonomyInfo;
