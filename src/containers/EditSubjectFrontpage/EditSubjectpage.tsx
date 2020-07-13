/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { TranslateType } from '../../interfaces';
import SubjectpageForm from './components/SubjectpageForm';
import { useSubjectpageFormHooks } from '../FormikForm/formikSubjectpageHooks';
import Spinner from '../../components/Spinner';

interface Props {
  t: TranslateType;
  subjectId: number;
  selectedLanguage: string;
}

const EditSubjectpage: FC<RouteComponentProps & Props> = ({
  t,
  subjectId,
  selectedLanguage,
}) => {
  const { loading, subjectpage } = useSubjectpageFormHooks(
    subjectId,
    selectedLanguage,
      t,
  );

  if (loading || !subjectpage || !subjectpage.id) {
    return <Spinner withWrapper />;
  }

  return (
    <>
      <HelmetWithTracker
        title={`${subjectpage.name} ${t('htmlTitles.titleTemplate')}`}
      />
      <SubjectpageForm
        subjectId={subjectId}
        subject={subjectpage}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
};

export default injectT(withRouter(EditSubjectpage));
