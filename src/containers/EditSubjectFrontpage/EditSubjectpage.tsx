/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import { useParams } from 'react-router-dom';
import SubjectpageForm from './components/SubjectpageForm';
import { useFetchSubjectpageData } from '../FormikForm/formikSubjectpageHooks';
import Spinner from '../../components/Spinner';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LocaleType } from '../../interfaces';

interface Props {
  isNewlyCreated: boolean;
}

const EditSubjectpage = ({ isNewlyCreated }: Props) => {
  const { t } = useTranslation();
  const { elementId, subjectpageId, selectedLanguage } = useParams<
    'elementId' | 'subjectpageId' | 'selectedLanguage'
  >();
  const {
    loading,
    subjectpage,
    updateSubjectpage,
    error,
    editorsChoices,
    banner,
  } = useFetchSubjectpageData(elementId!, selectedLanguage as LocaleType, subjectpageId);

  if (error !== undefined) {
    return <NotFoundPage />;
  }

  if (loading || !subjectpage || !subjectpage.id) {
    return <Spinner withWrapper />;
  }

  return (
    <>
      <HelmetWithTracker title={`${subjectpage?.about?.title} ${t('htmlTitles.titleTemplate')}`} />
      <SubjectpageForm
        editorsChoices={editorsChoices}
        banner={banner}
        elementId={elementId!}
        subjectpage={subjectpage}
        selectedLanguage={selectedLanguage!}
        updateSubjectpage={updateSubjectpage}
        isNewlyCreated={isNewlyCreated}
      />
    </>
  );
};

export default EditSubjectpage;
