/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import SubjectpageForm from './components/SubjectpageForm';
import { useFetchSubjectpageData } from '../FormikForm/formikSubjectpageHooks';
import Spinner from '../../components/Spinner';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

interface Props extends RouteComponentProps {
  elementId: string;
  selectedLanguage: string;
  subjectpageId: string;
  isNewlyCreated: boolean;
}

const EditSubjectpage = ({
  t,
  elementId,
  selectedLanguage,
  subjectpageId,
  isNewlyCreated,
}: Props & tType) => {
  const { loading, subjectpage, updateSubjectpage, error } = useFetchSubjectpageData(
    elementId,
    selectedLanguage,
    subjectpageId,
  );

  if (error !== undefined) {
    return <NotFoundPage />;
  }

  if (loading || !subjectpage || !subjectpage.id) {
    return <Spinner withWrapper />;
  }

  return (
    <>
      <HelmetWithTracker title={`${subjectpage.title} ${t('htmlTitles.titleTemplate')}`} />
      <SubjectpageForm
        elementId={elementId}
        subjectpage={subjectpage}
        selectedLanguage={selectedLanguage}
        updateSubjectpage={updateSubjectpage}
        isNewlyCreated={isNewlyCreated}
      />
    </>
  );
};

export default withRouter(injectT(EditSubjectpage));
