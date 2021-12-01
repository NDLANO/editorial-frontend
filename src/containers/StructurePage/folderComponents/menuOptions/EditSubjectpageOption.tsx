/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Home } from '@ndla/icons/common';
import { Link } from 'react-router-dom';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './components/MenuItemButton';
import { toEditSubjectpage, toCreateSubjectpage } from '../../../../util/routeHelpers';
import { getIdFromUrn } from '../../../../util/subjectHelpers';
import '../../../../style/link.css';
import { NodeType } from '../../../../modules/taxonomy/nodes/nodeApiTypes';

interface Props {
  node: NodeType;
}

const EditSubjectpageOption = ({ node }: Props) => {
  const { t, i18n } = useTranslation();

  const link = node.contentUri
    ? toEditSubjectpage(node.id, i18n.language, getIdFromUrn(node.contentUri))
    : toCreateSubjectpage(node.id, i18n.language);

  return (
    <Link
      className={'link'}
      to={{
        pathname: link,
        state: {
          elementName: node?.name,
        },
      }}>
      <MenuItemButton stripped data-testid="editSubjectpageOption">
        <RoundIcon small icon={<Home />} />
        {t('taxonomy.editSubjectpage')}
      </MenuItemButton>
    </Link>
  );
};

export default EditSubjectpageOption;
