/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import { Home } from '@ndla/icons/common';
import { Link } from 'react-router-dom';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './MenuItemButton';
import { toEditSubjectpage, toCreateSubjectpage } from '../../../../util/routeHelpers';
import { fetchSubject as apiFetchSubject } from '../../../../modules/taxonomy/subjects';
import { getIdFromUrn } from '../../../../util/subjectHelpers';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  id: string;
  locale: string;
}

const linkStyle = css`
  color: ${colors.brand.greyDark};
  &:hover {
    color: ${colors.brand.primary};
  }
`;

const EditSubjectpageOption = ({ id, locale }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [subject, setSubject] = useState<SubjectType>();

  useEffect(() => {
    const fetchSubject = async () => {
      const fetchedSubject = await apiFetchSubject({ id, taxonomyVersion });
      setSubject(fetchedSubject);
    };
    fetchSubject();
  }, [id, taxonomyVersion]);

  const link = subject?.contentUri
    ? toEditSubjectpage(id, locale, getIdFromUrn(subject.contentUri))
    : toCreateSubjectpage(id, locale);

  return (
    <Link css={linkStyle} state={{ elementName: subject?.name }} to={{ pathname: link }}>
      <MenuItemButton stripped data-testid="editSubjectpageOption">
        <RoundIcon small icon={<Home />} />
        {t('taxonomy.editSubjectpage')}
      </MenuItemButton>
    </Link>
  );
};

export default EditSubjectpageOption;
