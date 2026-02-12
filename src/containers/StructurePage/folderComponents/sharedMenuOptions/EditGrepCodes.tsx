/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "@ndla/types-taxonomy";
import { useUpdateNodeMetadataMutation } from "../../../../modules/nodes/nodeMutations";
import { getRootIdForNode, isRootNode } from "../../../../modules/nodes/nodeUtil";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import GrepCodesForm from "../../resourceComponents/GrepCodesForm";

interface Props {
  node: Node;
}

const EditGrepCodes = ({ node }: Props) => {
  const rootId = getRootIdForNode(node);
  const { id, metadata } = node;
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: patchMetadata } = useUpdateNodeMetadataMutation();

  const updateMetadata = async (codes: string[]) => {
    await patchMetadata({
      id,
      metadata: { grepCodes: codes, visible: metadata.visible },
      rootId: isRootNode(node) ? undefined : rootId,
      taxonomyVersion,
    });
  };

  return <GrepCodesForm codes={metadata?.grepCodes ?? []} onUpdate={updateMetadata} prefixFilter={["KV", ""]} />;
};

export default EditGrepCodes;
