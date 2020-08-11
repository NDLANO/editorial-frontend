/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { withRouter } from 'react-router';
import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router-dom';
import { SubjectpageEditType, TranslateType } from '../../interfaces';
import SubjectpageForm from './components/SubjectpageForm';
import { useFetchSubjectpageData } from '../FormikForm/formikSubjectpageHooks';
import { toEditSubjectpage } from '../../util/routeHelpers';

interface Props {
  t: TranslateType;
  selectedLanguage: string;
  history: RouteComponentProps['history'];
  subjectId: string;
  subjectName: string;
}

const CreateSubjectpage: FC<RouteComponentProps & Props> = ({
  t,
  selectedLanguage,
  history,
  subjectId,
  subjectName,
}) => {
  const { createSubjectpage } = useFetchSubjectpageData(
    subjectId,
    selectedLanguage,
    undefined,
  );

  const createSubjectpageAndPushRoute = async (
    createdSubjectpage: SubjectpageEditType,
  ) => {
    const savedSubjectpage = await createSubjectpage(createdSubjectpage);
    history.push(
      toEditSubjectpage(subjectId, selectedLanguage, savedSubjectpage.id),
    );
  };

  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.createSubjectpage')} />
      <SubjectpageForm
        subjectpage={{ language: selectedLanguage, name: subjectName }}
        selectedLanguage={selectedLanguage}
        updateSubjectpage={createSubjectpageAndPushRoute}
        subjectId={subjectId}
      />
    </>
  );
};

export default injectT(withRouter(CreateSubjectpage));
