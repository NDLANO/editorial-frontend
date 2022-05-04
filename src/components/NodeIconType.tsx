import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import { MenuBook } from '@ndla/icons/action';
import { Subject } from '@ndla/icons/contentType';
import Tooltip from '@ndla/tooltip';
import { colors } from '@ndla/core';
import { DiffType } from '../containers/NodeDiff/diffUtils';
import { NodeType } from '../modules/nodes/nodeApiTypes';
import { getNodeTypeFromNodeId } from '../modules/nodes/nodeUtil';

const iconCSS = css`
  height: 31px;
  width: 31px;
  color: ${colors.brand.primary};
`;

interface Props {
  node: DiffType<NodeType> | NodeType;
}

const NodeIconType = ({ node }: Props) => {
  const { t } = useTranslation();
  const nodeType =
    typeof node.id === 'string'
      ? getNodeTypeFromNodeId(node.id)
      : getNodeTypeFromNodeId(node.id.other ?? node.id.original!);

  const Icon = nodeType === 'SUBJECT' ? MenuBook : Subject;

  return (
    <Tooltip tooltip={t(`diff.nodeTypeTooltips.${nodeType}`)}>
      <Icon css={iconCSS} />
    </Tooltip>
  );
};

export default NodeIconType;
