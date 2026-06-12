/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeType } from "@ndla/types-backend/taxonomy-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { Form, FormActionsContainer } from "../../components/FormikForm";
import {
  getOptimisticNode,
  postNodeConnectionMutationOptions,
  postNodeMutationOptions,
} from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys, nodesQueryOptions } from "../../modules/nodes/nodeQueries";
import handleError from "../../util/handleError";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

const StyledForm = styled(Form, {
  base: {
    width: "100%",
  },
});

interface Props {
  onClose?: () => void;
  nodeType: NodeType;
  rootId?: string;
  parentNode?: Node;
}

const AddNodeDialogContent = ({ onClose, nodeType, rootId, parentNode }: Props) => {
  const { t, i18n } = useTranslation();
  const addNodeMutation = useMutation({
    ...postNodeMutationOptions(),
    onMutate: async (vars, ctx) => {
      // We're creating a child node, so we'll handle cache stuff when creating the connection.
      if (parentNode) return;

      const options = nodesQueryOptions({ nodeType: [nodeType], taxonomyVersion });
      await ctx.client.cancelQueries({ queryKey: options.queryKey });
      const previousQueries = ctx.client.getQueriesData<Node[]>({ queryKey: options.queryKey }) ?? [];
      const optimisticNode = getOptimisticNode(vars.body);
      ctx.client.setQueriesData<Node[]>({ queryKey: options.queryKey }, (old) => [...(old ?? []), optimisticNode]);
      return { previousQueries };
    },
    onSuccess: (_, __, ___, ctx) => {
      // We're creating a child node, so we'll invalidate once it's connected.
      if (parentNode) return;
      ctx.client.invalidateQueries({ queryKey: nodeQueryKeys.nodes({ nodeType: [nodeType], taxonomyVersion }) });
    },
    onError: (_, __, res, ctx) => res?.previousQueries.forEach(([key, data]) => ctx.client.setQueryData(key, data)),
  });

  const addNodeToParentMutation = useMutation({
    ...postNodeConnectionMutationOptions(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: nodeQueryKeys.childNodes({ id: rootId }) });
    },
  });
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  const addNode = async (name: string) => {
    return await addNodeMutation.mutateAsync({
      body: {
        name,
        language: i18n.language,
        nodeType: nodeType,
        root: !rootId,
      },
      taxonomyVersion,
    });
  };

  const handleClick = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const nodeUrl = await addNode(inputValue);
      const nodeId = nodeUrl.replace("/v1/nodes/", "");
      if (parentNode) {
        await addNodeToParentMutation.mutateAsync({
          body: { parentId: parentNode.id, childId: nodeId },
          taxonomyVersion,
        });
      }
      setInputValue("");
      onClose?.();
    } catch (error) {
      handleError(error);
      setError(true);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(false);
    setInputValue(e.target.value);
  };

  return (
    <StyledForm>
      <FieldRoot required invalid={error}>
        <FieldLabel srOnly>{t("taxonomy.newNode", { nodeType: t(`taxonomy.nodetype.${nodeType}`) })}</FieldLabel>
        <FieldErrorMessage>{t("taxonomy.errorMessage")}</FieldErrorMessage>
        <FieldInput
          type="text"
          data-testid="addSubjectInputField"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={t("taxonomy.newNodeName")}
        />
        <FormActionsContainer>
          <Button type="submit" onClick={handleClick} disabled={!inputValue}>
            {t("form.save")}
          </Button>
        </FormActionsContainer>
      </FieldRoot>
    </StyledForm>
  );
};

export default AddNodeDialogContent;
