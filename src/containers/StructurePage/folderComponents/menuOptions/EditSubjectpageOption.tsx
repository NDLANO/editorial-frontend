/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { Pencil } from '@ndla/icons/action';
import { Link } from 'react-router-dom';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './MenuItemButton';
import {
  toEditSubjectpage,
  toCreateSubjectpage,
} from '../../../../util/routeHelpers';
import { SubjectType, TranslateType } from '../../../../interfaces';
import * as taxonomyApi from '../../../../modules/taxonomy/taxonomyApi';
import {
  getIdFromUrn,
  getSubjectIdFromUrn,
} from '../../../../util/subjectHelpers';

interface Props {
  t: TranslateType;
  id: string;
  locale: string;
}

const EditSubjectpageOption = ({ t, id, locale }: Props) => {
  const [subject, setSubject] = useState<SubjectType>();
  const subjectId = getSubjectIdFromUrn(id);

  const fetchSubject = async () => {
    const fetchedSubject = await taxonomyApi.fetchSubject(subjectId);
    setSubject(fetchedSubject);
  };

  useEffect(() => {
    fetchSubject();
  }, []);

  //TODO: Hvilken id vil vi ha i url? Subjectid eller subjectpage?
  // Eventuelt urn i stedet for id? De som eventuelt ikke går i url, legges i location state til link
  const link = subject?.contentUri
    ? toEditSubjectpage(subjectId, locale, getIdFromUrn(subject.contentUri))
    : toCreateSubjectpage(subjectId, locale);

  return (
    <>
      <Link
        to={{
          pathname: link,
          state: {
            subjectName: subject?.name,
            subjectpageId: getIdFromUrn(subject?.contentUri),
            subjectId: subjectId,
          },
        }}>
        <MenuItemButton stripped data-testid="editSubjectpageOption">
          <RoundIcon small icon={<Pencil />} />
          {t('form.file.editSubjectpage')}
        </MenuItemButton>
      </Link>
    </>
  );
};

export default injectT(EditSubjectpageOption);
