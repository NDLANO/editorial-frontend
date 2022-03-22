/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import css from '@emotion/css';
import { Home } from '@ndla/icons/common';
import { colors } from '@ndla/core';

import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { toCreateSubjectpage, toEditSubjectpage } from '../../../../util/routeHelpers';
import { getIdFromUrn } from '../../../../util/subjectHelpers';
import MenuItemButton from '../sharedMenuOptions/components/MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';

interface Props {
  node: NodeType;
}

const linkStyle = css`
  color: ${colors.brand.greyDark};
  &:hover {
    color: ${colors.brand.primary};
  }
`;

const EditSubjectpageOption = ({ node }: Props) => {
  const { t, i18n } = useTranslation();

  const link = node.contentUri
    ? toEditSubjectpage(node.id, i18n.language, getIdFromUrn(node.contentUri))
    : toCreateSubjectpage(node.id, i18n.language);

  return (
    <Link css={linkStyle} state={{ elementName: node?.name }} to={{ pathname: link }}>
      <MenuItemButton stripped data-testid="editSubjectpageOption">
        <RoundIcon small icon={<Home />} />
        {t('taxonomy.editSubjectpage')}
      </MenuItemButton>
    </Link>
  );
};

export default EditSubjectpageOption;
