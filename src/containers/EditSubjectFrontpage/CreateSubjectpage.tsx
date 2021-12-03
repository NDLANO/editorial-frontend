/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { LocaleType, SubjectpageEditType } from '../../interfaces';
import SubjectpageForm from './components/SubjectpageForm';
import { useFetchSubjectpageData } from '../FormikForm/formikSubjectpageHooks';
import { toEditSubjectpage } from '../../util/routeHelpers';

const CreateSubjectpage = () => {
  const { t } = useTranslation();
  const params = useParams<'selectedLanguage' | 'elementId'>();
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const elementId = params.elementId!;
  const location = useLocation();
  const elementName = location.state?.elementName;
  const navigate = useNavigate();
  const { createSubjectpage } = useFetchSubjectpageData(elementId, selectedLanguage, undefined);

  const createSubjectpageAndPushRoute = async (createdSubjectpage: SubjectpageEditType) => {
    const savedSubjectpage = await createSubjectpage(createdSubjectpage);
    const savedId = savedSubjectpage?.id;
    if (savedId) {
      navigate(toEditSubjectpage(elementId, selectedLanguage, savedId));
    }
    return savedSubjectpage;
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

export default CreateSubjectpage;
