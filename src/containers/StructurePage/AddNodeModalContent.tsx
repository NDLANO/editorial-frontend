/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useState, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, InputV3, Label } from "@ndla/forms";
import { Node, NodeType } from "@ndla/types-taxonomy";
import { FormControl } from "../../components/FormField";
import { useAddNodeMutation, usePostNodeConnectionMutation } from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";
import handleError from "../../util/handleError";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

const FormWrapper = styled.form`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: ${spacing.medium};
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: ${spacing.normal};
`;

interface Props {
  onClose: () => void;
  nodeType: NodeType;
  rootId?: string;
  parentNode?: Node;
}

const AddNodeModalContent = ({ onClose, nodeType, rootId, parentNode }: Props) => {
  const { t } = useTranslation();
  const addNodeMutation = useAddNodeMutation();
  const compkey = nodeQueryKeys.childNodes({ id: rootId });
  const addNodeToParentMutation = usePostNodeConnectionMutation({
    onSuccess: (_) => {
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
      onClose();
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
    <FormWrapper>
      <StyledFormControl isRequired isInvalid={error}>
        <Label visuallyHidden>{t("taxonomy.newNode", { nodeType: t(`taxonomy.nodetype.${nodeType}`) })}</Label>
        <InputWrapper>
          <InputV3
            type="text"
            data-testid="addSubjectInputField"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t("taxonomy.newNodeName")}
          />
          <ButtonV2 type="submit" onClick={handleClick} disabled={!inputValue}>
            {t("form.save")}
          </ButtonV2>
        </InputWrapper>
        <FieldErrorMessage>{t("taxonomy.errorMessage")}</FieldErrorMessage>
      </StyledFormControl>
    </FormWrapper>
  );
};

export default AddNodeModalContent;
