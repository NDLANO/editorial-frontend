/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { useUpdateNodeMetadataMutation } from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";

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
  node: Node;
  taxonomyVersion: string;
  articleId: number;
  articleLanguage: string;
}

export const TaxonomyVisibility = ({ node, taxonomyVersion, articleId, articleLanguage }: Props) => {
  const { t } = useTranslation();
  const updateNodeMetadataMutation = useUpdateNodeMetadataMutation();
  const qc = useQueryClient();

  const updateVisibility = async (visible: boolean) => {
    await updateNodeMetadataMutation.mutateAsync({ id: node.id, taxonomyVersion, metadata: { visible } });
    await qc.invalidateQueries({
      queryKey: nodeQueryKeys.nodes({
        contentURI: `urn:article:${articleId}`,
        language: articleLanguage,
        taxonomyVersion,
        includeContexts: true,
      }),
    });
  };

  return (
    <Wrapper>
      <StyledText visible={node.metadata.visible}>
        <b>ID: </b>
        <span>{node.id}</span>
      </StyledText>
      <StyledSwitchRoot
        checked={node.metadata.visible}
        onCheckedChange={(details) => updateVisibility(details.checked)}
      >
        <SwitchLabel>{t("metadata.changeVisibility")}</SwitchLabel>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchHiddenInput />
      </StyledSwitchRoot>
      {!!updateNodeMetadataMutation.isError && <Text>{t("taxonomy.errors.failedToUpdateConnection")}</Text>}
    </Wrapper>
  );
};
