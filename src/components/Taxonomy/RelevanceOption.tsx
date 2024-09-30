/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { NodeChild, NodeConnectionPUT } from "@ndla/types-taxonomy";
import RelevanceOptionSwitch from "./RelevanceOptionSwitch";
import { ResourceWithNodeConnectionAndMeta } from "../../containers/StructurePage/resourceComponents/StructureResources";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import { usePutResourceForNodeMutation, useUpdateNodeConnectionMutation } from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";

interface Props {
  resource: ResourceWithNodeConnectionAndMeta;
  currentNodeId: string;
}

const RelevanceOption = ({ resource, currentNodeId }: Props) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const compKey = nodeQueryKeys.resources({
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

  const { mutateAsync: updateNodeConnection } = useUpdateNodeConnectionMutation({
    onMutate: async ({ id, body }) => onUpdateConnection(id, body),
    onSettled: () => qc.invalidateQueries({ queryKey: compKey }),
  });
  const { mutateAsync: updateResourceConnection } = usePutResourceForNodeMutation({
    onMutate: async ({ id, body }) => onUpdateConnection(id, body),
    onSettled: () => qc.invalidateQueries({ queryKey: compKey }),
  });

  const updateRelevanceId = async (relevanceId: string) => {
    const { connectionId, isPrimary, rank } = resource;
    const func = connectionId.includes("-resource") ? updateResourceConnection : updateNodeConnection;
    await func({
      id: connectionId,
      body: { relevanceId, primary: isPrimary, rank: rank },
      taxonomyVersion,
    });
  };

  return <RelevanceOptionSwitch relevanceId={resource?.relevanceId} onChange={updateRelevanceId} />;
};

export default RelevanceOption;
