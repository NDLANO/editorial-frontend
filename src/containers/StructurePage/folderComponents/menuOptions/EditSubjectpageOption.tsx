/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { Home } from '@ndla/icons/common';
import { Link } from 'react-router-dom';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './MenuItemButton';
import { toEditSubjectpage, toCreateSubjectpage } from '../../../../util/routeHelpers';
import { SubjectType, TranslateType } from '../../../../interfaces';
import * as taxonomyApi from '../../../../modules/taxonomy/taxonomyApi';
import { getIdFromUrn } from '../../../../util/subjectHelpers';
import '../../../../style/link.css';

interface Props {
  t: TranslateType;
  id: string;
  locale: string;
}

const EditSubjectpageOption = ({ t, id, locale }: Props) => {
  const [subject, setSubject] = useState<SubjectType>();

  const fetchSubject = async () => {
    const fetchedSubject = await taxonomyApi.fetchSubject(id);
    setSubject(fetchedSubject);
  };

  useEffect(() => {
    fetchSubject();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const link = subject?.contentUri
    ? toEditSubjectpage(id, locale, getIdFromUrn(subject.contentUri))
    : toCreateSubjectpage(id, locale);

  return (
    <Link
      className={'link'}
      to={{
        pathname: link,
        state: {
          elementName: subject?.name,
        },
      }}>
      <MenuItemButton stripped data-testid="editSubjectpageOption">
        <RoundIcon small icon={<Home />} />
        {t('taxonomy.editSubjectpage')}
      </MenuItemButton>
    </Link>
  );
};

export default injectT(EditSubjectpageOption);
