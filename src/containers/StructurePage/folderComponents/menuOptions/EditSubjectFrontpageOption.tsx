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
import { Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './MenuItemButton';
import CreateConcept from '../../../ConceptPage/CreateConcept';
import { toEditFrontpage } from '../../../../util/routeHelpers';
import { TranslateType } from '../../../../interfaces';

interface Props {
  t: TranslateType;
  //onClose: function;
  contentUri: string;
  id: string;
  selectedLanguage: string;
}

const EditSubjectFrontpageOption = ({
  t,
  contentUri,
  id,
  selectedLanguage,
}: Props) => {
  return (
    <>
      <Link to={'/asd'}>
        <MenuItemButton
          stripped
          data-testid="editSubjectPageButton"
          onClick={() => {}}>
          <RoundIcon small icon={<Pencil />} />
          {t('form.file.editSubjectFrontPage')}
        </MenuItemButton>
      </Link>
    </>
  );
};

export default injectT(EditSubjectFrontpageOption);
