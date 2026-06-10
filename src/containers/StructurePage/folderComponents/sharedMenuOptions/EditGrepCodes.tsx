/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "@ndla/types-backend/taxonomy-api";
import { useMutation } from "@tanstack/react-query";
import { GREP_CODE_FORMATS } from "../../../../constants";
import { updateNodeMetadataMutationOptions } from "../../../../modules/nodes/nodeMutations";
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
  const { mutateAsync: patchMetadata } = useMutation(
    updateNodeMetadataMutationOptions({ rootId: isRootNode(node) ? undefined : rootId }),
  );

  const updateMetadata = async (codes: string[]) => {
    await patchMetadata({
      id,
      meta: { grepCodes: codes, visible: metadata.visible },
      taxonomyVersion,
    });
  };

  return (
    <GrepCodesForm
      codes={metadata?.grepCodes ?? []}
      onUpdate={updateMetadata}
      prefixFilter={[GREP_CODE_FORMATS.KOMPETANSEMALSETT, GREP_CODE_FORMATS.FAGKODE]}
    />
  );
};

export default EditGrepCodes;
