/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { getNodeTypeFromNodeId } from "../../../../modules/nodes/nodeUtil";
import AddNodeDialogContent from "../../AddNodeDialogContent";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
    width: "100%",
  },
});

interface Props {
  node: Node;
  rootNodeId: string;
}

const AddProgramme = ({ node, rootNodeId }: Props) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
        <h2>
          {t("taxonomy.addNode", {
            nodeType: t("taxonomy.nodeType.PROGRAMME"),
          })}
        </h2>
      </Heading>
      <AddNodeDialogContent parentNode={node} rootId={rootNodeId} nodeType={getNodeTypeFromNodeId(rootNodeId)} />
    </Wrapper>
  );
};

export default AddProgramme;
