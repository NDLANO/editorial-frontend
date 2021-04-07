/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { withRouter } from 'react-router';
import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router-dom';
import { SubjectpageEditType } from '../../interfaces';
import SubjectpageForm from './components/SubjectpageForm';
import { useFetchSubjectpageData } from '../FormikForm/formikSubjectpageHooks';
import { toEditSubjectpage } from '../../util/routeHelpers';

interface Props extends RouteComponentProps {
  selectedLanguage: string;
  elementId: string;
  elementName: string;
}

const CreateSubjectpage = ({
  t,
  selectedLanguage,
  history,
  elementId,
  elementName,
}: Props & tType) => {
  const { createSubjectpage } = useFetchSubjectpageData(elementId, selectedLanguage, undefined);

  const createSubjectpageAndPushRoute = async (createdSubjectpage: SubjectpageEditType) => {
    const savedSubjectpage = await createSubjectpage(createdSubjectpage);
    history.push(toEditSubjectpage(elementId, selectedLanguage, savedSubjectpage.id));
  };

  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.createSubjectpage')} />
      <SubjectpageForm
        subjectpage={{ language: selectedLanguage, name: elementName }}
        selectedLanguage={selectedLanguage}
        updateSubjectpage={createSubjectpageAndPushRoute}
        elementId={elementId}
        isNewlyCreated={false}
      />
    </>
  );
};

export default injectT(withRouter(CreateSubjectpage));
