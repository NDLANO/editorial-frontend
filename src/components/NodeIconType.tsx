import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { MenuBook } from '@ndla/icons/action';
import { Subject } from '@ndla/icons/contentType';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { DiffType } from '../containers/NodeDiff/diffUtils';
import { NodeType } from '../modules/nodes/nodeApiTypes';
import { getNodeTypeFromNodeId } from '../modules/nodes/nodeUtil';

const StyledMenuBook = styled(MenuBook)`
  height: 31px;
  width: 31px;
  color: ${colors.brand.primary};
`;

const StyledSubject = StyledMenuBook.withComponent(Subject);

interface Props {
  node: DiffType<NodeType> | NodeType;
}

const NodeIconType = ({ node }: Props) => {
  const { t } = useTranslation();
  const nodeType =
    typeof node.id === 'string'
      ? getNodeTypeFromNodeId(node.id)
      : getNodeTypeFromNodeId(node.id.other ?? node.id.original!);

  const Icon = nodeType === 'SUBJECT' ? StyledMenuBook : StyledSubject;

  return (
    <Tooltip tooltip={t(`diff.nodeTypeTooltips.${nodeType}`)}>
      <div>
        <Icon />
      </div>
    </Tooltip>
  );
};

export default NodeIconType;
