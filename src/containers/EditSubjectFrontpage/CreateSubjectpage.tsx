/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router-dom';
import { INewSubjectFrontPageData } from '@ndla/types-frontpage-api';
import { LocaleType } from '../../interfaces';
import SubjectpageForm from './components/SubjectpageForm';
import { useFetchSubjectpageData } from '../FormikForm/formikSubjectpageHooks';
import { toEditSubjectpage } from '../../util/routeHelpers';

interface Props extends RouteComponentProps {
  selectedLanguage: LocaleType;
  elementId: string;
  elementName: string;
}

const CreateSubjectpage = ({ selectedLanguage, history, elementId, elementName }: Props) => {
  const { t } = useTranslation();
  const { createSubjectpage } = useFetchSubjectpageData(elementId, selectedLanguage, undefined);

  const createSubjectpageAndPushRoute = async (createdSubjectpage: INewSubjectFrontPageData) => {
    const savedSubjectpage = await createSubjectpage(createdSubjectpage);
    history.push(toEditSubjectpage(elementId, selectedLanguage, savedSubjectpage.id));
    return savedSubjectpage;
  };

  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.createSubjectpage')} />
      <SubjectpageForm
        selectedLanguage={selectedLanguage}
        createSubjectpage={createSubjectpageAndPushRoute}
        elementId={elementId}
        isNewlyCreated={false}
      />
    </>
  );
};

export default withRouter(CreateSubjectpage);
