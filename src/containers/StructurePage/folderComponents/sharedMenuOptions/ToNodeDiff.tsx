/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { colors } from '@ndla/core';
import { Taxonomy } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import MenuItemButton from './components/MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import { toNodeDiff } from '../../../../util/routeHelpers';
import { useTaxonomyVersion } from '../../../../containers/StructureVersion/TaxonomyVersionProvider';

interface Props {
  node: NodeType;
}

const StyledLink = styled(Link)`
  color: ${colors.brand.greyDark};
  &hover {
    color: ${colors.brand.primary};
  }
`;
const ToNodeDiff = ({ node }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  return (
    <StyledLink to={toNodeDiff(node.id, taxonomyVersion, 'default')}>
      <MenuItemButton data-testid="toNodeDiff">
        <RoundIcon small icon={<Taxonomy />} />
        {t('diff.compareVersions')}
      </MenuItemButton>
    </StyledLink>
  );
};
export default ToNodeDiff;
