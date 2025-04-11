/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useState, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Button, FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeType } from "@ndla/types-taxonomy";
import { Form, FormActionsContainer } from "../../components/FormikForm";
import { useAddNodeMutation, usePostNodeConnectionMutation } from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";
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
  const { t } = useTranslation();
  const addNodeMutation = useAddNodeMutation();
  const compkey = nodeQueryKeys.childNodes({ id: rootId });
  const addNodeToParentMutation = usePostNodeConnectionMutation({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: compkey });
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
        nodeType: nodeType,
        root: !rootId,
      },
      taxonomyVersion,
    });
  };

  const connectNode = async (parentId: string, childId: string) => {
    await addNodeToParentMutation.mutateAsync({
      body: {
        parentId,
        childId,
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
        await connectNode(parentNode.id, nodeId);
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
