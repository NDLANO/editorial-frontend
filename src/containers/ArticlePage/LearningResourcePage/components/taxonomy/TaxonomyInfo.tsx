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
import FieldHeader from "../../../../../components/Field/FieldHeader";

const InfoWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const StyledText = styled(Text, {
  variants: {
    visible: {
      false: {
        fontStyle: "italic",
        color: "text.subtle",
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
  return (
    <>
      <FieldHeader title={t("taxonomy.info.title")} subTitle={t("taxonomy.info.subTitle")} />
      {taxonomyElement && (
        <InfoWrapper>
          <StyledText asChild consumeCss visible={taxonomyElement.metadata.visible}>
            <div>{taxonomyElement.id}</div>
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
        </InfoWrapper>
      )}
    </>
  );
};

export default TaxonomyInfo;
