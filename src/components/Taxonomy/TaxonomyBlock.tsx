/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Button, SelectLabel, Text } from "@ndla/primitives";
import { Node, Version } from "@ndla/types-taxonomy";
import { RESOURCE_TYPE_LEARNING_PATH, TAXONOMY_ADMIN_SCOPE } from "../../constants";
import { useSession } from "../../containers/Session/SessionProvider";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import { postNode } from "../../modules/nodes/nodeApi";
import { createResourceResourceType } from "../../modules/taxonomy";
import { FormContent } from "../FormikForm";
import { TaxonomyConnectionErrors } from "./TaxonomyConnectionErrors";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";
import OptGroupVersionSelector from "../Taxonomy/OptGroupVersionSelector";

interface BaseProps {
  nodes: Node[];
  versions: Version[];
  hasTaxEntries: boolean;
  nodeType: "resource" | "topic";
  children?: ReactNode;
  resourceLanguage: string;
  resourceId: number;
  resourceTitle: string;
}

interface ResourceProps extends BaseProps {
  nodeType: "resource";
  resourceType: "article" | "learningpath";
}

interface TopicProps extends BaseProps {
  nodeType: "topic";
  resourceType?: never;
}

type Props = ResourceProps | TopicProps;

export const TaxonomyBlock = ({
  hasTaxEntries,
  nodeType,
  resourceType,
  nodes,
  versions,
  children,
  resourceLanguage,
  resourceId,
  resourceTitle,
}: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const qc = useQueryClient();

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  const onVersionChanged = useCallback(
    (version: Version) => {
      if (version.hash === taxonomyVersion) return;
      changeVersion(version.hash);
    },
    [changeVersion, taxonomyVersion],
  );

  const createNodeConnection = useCallback(async () => {
    const contentType = nodeType === "resource" ? resourceType : "article";
    const nodeLocation = await postNode({
      body: {
        contentUri: `urn:${contentType}:${resourceId}`,
        name: resourceTitle ?? "",
        nodeType: nodeType === "resource" ? "RESOURCE" : "TOPIC",
      },
      taxonomyVersion,
    });
    if (resourceType === "learningpath") {
      await createResourceResourceType({
        body: {
          resourceId: nodeLocation.replace("/v1/nodes/", ""),
          resourceTypeId: RESOURCE_TYPE_LEARNING_PATH,
        },
        taxonomyVersion,
      });
    }
    await qc.invalidateQueries({
      queryKey: nodeQueryKeys.nodes({
        contentURI: `urn:${contentType}:${resourceId}`,
        taxonomyVersion,
        language: resourceLanguage,
        includeContexts: true,
      }),
    });
  }, [nodeType, qc, resourceId, resourceLanguage, resourceTitle, resourceType, taxonomyVersion]);

  return (
    <FormContent>
      {!hasTaxEntries && <Text color="text.error">{t("errorMessage.missingTax")}</Text>}
      {!!isTaxonomyAdmin && (
        <>
          <TaxonomyConnectionErrors type={nodeType} nodes={nodes} />
          <OptGroupVersionSelector
            currentVersion={taxonomyVersion}
            onVersionChanged={onVersionChanged}
            versions={versions}
          >
            <SelectLabel>{t("taxonomy.version")}</SelectLabel>
          </OptGroupVersionSelector>
        </>
      )}
      {nodes[0]?.id.length || nodeType === "topic" ? (
        children
      ) : (
        <>
          <Text>{t("errorMessage.noTaxNode")}</Text>
          <Button onClick={createNodeConnection}>{t("errorMessage.createNode")}</Button>
        </>
      )}
    </FormContent>
  );
};
