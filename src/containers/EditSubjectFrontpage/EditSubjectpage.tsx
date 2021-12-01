/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import SubjectpageForm from './components/SubjectpageForm';
import { useFetchSubjectpageData } from '../FormikForm/formikSubjectpageHooks';
import Spinner from '../../components/Spinner';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LocaleType } from '../../interfaces';

interface Props extends RouteComponentProps {
  elementId: string;
  selectedLanguage: LocaleType;
  subjectpageId: string;
  isNewlyCreated: boolean;
}

const EditSubjectpage = ({ elementId, selectedLanguage, subjectpageId, isNewlyCreated }: Props) => {
  const { t } = useTranslation();
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

export default withRouter(EditSubjectpage);
