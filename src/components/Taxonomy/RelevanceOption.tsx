/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  Heading,
  Spinner,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { NodeChild, NodeConnectionPUT } from "@ndla/types-taxonomy";
import { TaxonomyNodeChild } from "./types";
import { RESOURCE_FILTER_CORE, RESOURCE_FILTER_SUPPLEMENTARY } from "../../constants";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import { useUpdateNodeConnectionMutation } from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

interface Props {
  node: TaxonomyNodeChild;
  currentNodeId: string;
}

const RelevanceOption = ({ node, currentNodeId }: Props) => {
  const [checked, setChecked] = useState((node.relevanceId ?? RESOURCE_FILTER_CORE) === RESOURCE_FILTER_CORE);
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const compKey = nodeQueryKeys.childNodes({
    id: currentNodeId,
    language: i18n.language,
  });
  const onUpdateConnection = async (id: string, { relevanceId }: NodeConnectionPUT) => {
    await qc.cancelQueries({ queryKey: compKey });
    const resources = qc.getQueryData<NodeChild[]>(compKey) ?? [];
    if (relevanceId) {
      const newResources = resources.map((res) => {
        if (res.id === id) {
          return { ...res, relevanceId: relevanceId };
        } else return res;
      });
      qc.setQueryData<NodeChild[]>(compKey, newResources);
    }
    return resources;
  };
  const { mutateAsync: updateNodeConnection, isPending } = useUpdateNodeConnectionMutation({
    onMutate: async ({ id, body }) => onUpdateConnection(id, body),
    onSettled: () => qc.invalidateQueries({ queryKey: compKey }),
  });

  const updateRelevanceId = async (relevanceId: string) => {
    await updateNodeConnection({
      id: node.connectionId,
      body: { relevanceId, primary: node.isPrimary, rank: node.rank },
      taxonomyVersion,
    });
  };
  return (
    <>
      <TitleWrapper>
        <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
          <h2>{t("taxonomy.resourceType.tabTitle")}</h2>
        </Heading>
        {!!isPending && <Spinner size="small" />}
      </TitleWrapper>
      <SwitchRoot
        checked={checked}
        title={t("form.topics.RGTooltip")}
        onCheckedChange={(details) => {
          updateRelevanceId(details.checked ? RESOURCE_FILTER_CORE : RESOURCE_FILTER_SUPPLEMENTARY);
          setChecked(details.checked);
        }}
      >
        <SwitchLabel>{t("form.topics.RGTooltip")}</SwitchLabel>
        <SwitchControl>
          <SwitchThumb>{checked ? "K" : "T"}</SwitchThumb>
        </SwitchControl>
        <SwitchHiddenInput />
      </SwitchRoot>
    </>
  );
};

export default RelevanceOption;
