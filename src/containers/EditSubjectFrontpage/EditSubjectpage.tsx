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
import { useFetchSubjectpageData } from '../FormikForm/formikSubjectpageHooks';
import Spinner from '../../components/Spinner';

interface Props {
  t: TranslateType;
  subjectId: number;
  selectedLanguage: string;
  subjectpageId: string;
  isNewlyCreated: boolean;
}

const EditSubjectpage: FC<RouteComponentProps & Props> = ({
  t,
  subjectId,
  selectedLanguage,
  subjectpageId,
  isNewlyCreated,
}) => {
  const { loading, subjectpage, updateSubjectpage } = useFetchSubjectpageData(
    subjectId,
    selectedLanguage,
    subjectpageId,
  );

  if (loading || !subjectpage || !subjectpage.id) {
    return <Spinner withWrapper />;
  }

  return (
    <>
      <HelmetWithTracker
        title={`${subjectpage.title} ${t('htmlTitles.titleTemplate')}`}
      />
      <SubjectpageForm
        subjectId={subjectId}
        subjectpage={subjectpage}
        selectedLanguage={selectedLanguage}
        updateSubjectpage={updateSubjectpage}
        isNewlyCreated={isNewlyCreated}
      />
    </>
  );
};

export default injectT(withRouter(EditSubjectpage));
