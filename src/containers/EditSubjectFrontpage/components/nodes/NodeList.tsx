/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { DeleteForever } from '@ndla/icons/editor';
import { IconButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';

const NodeListWrapper = styled.div`
  margin-bottom: 15px;
  margin-top: 15px;
`;

const NodeWrapper = styled.div`
  align-items: center;
  background: ${colors.brand.greyLighter};
  display: flex;
  justify-content: space-between;
  margin: 5px;
  padding: 5px;
`;

interface Props {
  nodes: { name: string }[];
  nodeSet: string;
  onDelete: (list: string, id: string) => void;
}

const NodeList = ({ nodes, nodeSet, onDelete }: Props) => {
  const { t } = useTranslation();

  console.log(nodeSet);
  console.log(nodes);

  return (
    <NodeListWrapper>
      {nodes.map((node: any) => (
        <NodeWrapper key={`${nodeSet}-${node.id}`}>
          {node.name}
          <Tooltip tooltip={t('subjectpageForm.removeSubject')}>
            <IconButtonV2
              aria-label={t('subjectpageForm.removeSubject')}
              colorTheme="danger"
              onClick={() => onDelete(nodeSet, node.id)}
              variant="ghost"
            >
              <DeleteForever />
            </IconButtonV2>
          </Tooltip>
        </NodeWrapper>
      ))}
    </NodeListWrapper>
  );
};

export default NodeList;
