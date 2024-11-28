/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorWarningLine } from "@ndla/icons/common";
import { Button, Heading, MessageBox, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import { FormActionsContainer } from "../../../../components/FormikForm";
import { useDeleteNodeConnectionMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

interface Props {
  node: Node | NodeChild;
  onCurrentNodeChanged: (node?: Node) => void;
}

const DisconnectFromParent = ({ node, onCurrentNodeChanged }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: disconnectNode, isError, isPending } = useDeleteNodeConnectionMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();

  const onDisconnect = async (): Promise<void> => {
    if ("connectionId" in node) {
      await disconnectNode(
        {
          id: node.connectionId,
          taxonomyVersion,
        },
        {
          onSuccess: () => {
            qc.invalidateQueries({
              queryKey: nodeQueryKeys.childNodes({
                taxonomyVersion,
                language: i18n.language,
              }),
            });
            navigate(location.pathname.split(node.id)[0], { replace: true });
            onCurrentNodeChanged(undefined);
          },
        },
      );
    }
  };

  return (
    <Wrapper>
      <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
        <h2>{t("taxonomy.disconnectNode")}</h2>
      </Heading>
      <MessageBox variant="warning">
        <ErrorWarningLine />
        <Text>{t("taxonomy.publish.info")}</Text>
      </MessageBox>
      <FormActionsContainer>
        <Button loading={isPending} variant="danger" onClick={onDisconnect}>
          {t("alertModal.disconnect")}
        </Button>
      </FormActionsContainer>
      {!!isError && <Text color="text.error">{t("taxonomy.errorMessage")}</Text>}
    </Wrapper>
  );
};

export default DisconnectFromParent;
