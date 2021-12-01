/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Home } from '@ndla/icons/common';
import { Link } from 'react-router-dom';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './MenuItemButton';
import { toEditSubjectpage, toCreateSubjectpage } from '../../../../util/routeHelpers';
import { fetchSubject as apiFetchSubject } from '../../../../modules/taxonomy/subjects';
import { getIdFromUrn } from '../../../../util/subjectHelpers';
import '../../../../style/link.css';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

interface Props {
  id: string;
  locale: string;
}

const EditSubjectpageOption = ({ id, locale }: Props) => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState<SubjectType>();

  useEffect(() => {
    const fetchSubject = async () => {
      const fetchedSubject = await apiFetchSubject(id);
      setSubject(fetchedSubject);
    };
    fetchSubject();
  }, [id]);

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

export default EditSubjectpageOption;
