/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useState, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { ButtonV2 } from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { InputV2 } from '@ndla/forms';
import { Node, NodeType } from '@ndla/types-taxonomy';
import {
  useAddNodeMutation,
  usePostNodeConnectionMutation,
} from '../../modules/nodes/nodeMutations';
import { nodeQueryKeys } from '../../modules/nodes/nodeQueries';
import handleError from '../../util/handleError';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

const StyledInputField = styled(InputV2)`
  border-radius: 4px;
  ::placeholder {
    color: ${colors.brand.neutral7};
  }
`;

const FormWrapper = styled.form`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: ${spacing.medium};
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

  const [inputValue, setInputValue] = useState('');
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
      const nodeId = nodeUrl.replace('/v1/nodes/', '');
      if (parentNode) {
        await connectNode(parentNode.id, nodeId);
      }
      setInputValue('');
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
      <StyledInputField
        label={t('taxonomy.newNode', { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
        name={t('taxonomy.newNode', { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
        labelHidden
        type="text"
        data-testid="addSubjectInputField"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={t('taxonomy.newNodeName')}
        error={error ? t('taxonomy.errorMessage') : undefined}
      />
      <ButtonV2 type="submit" onClick={handleClick} disabled={!inputValue}>
        {t('form.save')}
      </ButtonV2>
    </FormWrapper>
  );
};

export default AddNodeModalContent;
