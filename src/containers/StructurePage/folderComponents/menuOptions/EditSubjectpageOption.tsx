/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from '@ndla/i18n';
import { Pencil } from '@ndla/icons/action';
import { Link } from 'react-router-dom';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './MenuItemButton';
import { toEditSubjectpage } from '../../../../util/routeHelpers';
import { TranslateType } from '../../../../interfaces';

interface Props {
  t: TranslateType;
  id: string;
  locale: string;
}

const EditSubjectpageOption = ({ t, id, locale }: Props) => {
  const subjectId = id.split(':').pop(); //finnes det en funksjon for dette?
  return (
    <>
      <Link to={toEditSubjectpage(subjectId, locale)}>
        <MenuItemButton stripped data-testid="editSubjectpageOption">
          <RoundIcon small icon={<Pencil />} />
          {t('form.file.editSubjectpage')}
        </MenuItemButton>
      </Link>
    </>
  );
};

export default injectT(EditSubjectpageOption);
