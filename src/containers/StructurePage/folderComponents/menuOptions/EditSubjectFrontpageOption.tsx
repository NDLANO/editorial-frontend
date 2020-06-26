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
import { toEditFrontpage } from '../../../../util/routeHelpers';
import { TranslateType } from '../../../../interfaces';

interface Props {
  t: TranslateType;
  id: string;
  locale: string;
}

const EditSubjectFrontpageOption = ({ t, id, locale }: Props) => {
  const subjectId = id.split(':').pop(); //finnes det en funksjon for dette?
  return (
    <>
      <Link to={toEditFrontpage(subjectId, locale)}>
        <MenuItemButton stripped data-testid="editSubjectPageButton">
          <RoundIcon small icon={<Pencil />} />
          {t('form.file.editSubjectFrontPage')}
        </MenuItemButton>
      </Link>
    </>
  );
};

export default injectT(EditSubjectFrontpageOption);
