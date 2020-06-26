/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, FC } from 'react';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps, withRouter } from 'react-router-dom';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { fetchSubjectFrontpage } from '../../modules/frontpage/frontpageApi';
import { fetchSubject } from '../../modules/taxonomy/taxonomyApi';
import { TranslateType } from '../../interfaces';
import SubjectFrontpageForm from './components/SubjectFrontpageForm';

interface Props {
  t: TranslateType;
  subjectId: number;
  selectedLanguage: string;
}

const emptyFrontpage = {
  id: '',
  name: '',
  filters: [],
  layout: '',
  twitter: '',
  facebook: '',
  banner: {
    mobileUrl: '',
    mobileId: 0,
    desktopUrl: '',
    desktopId: 0,
  },
  about: {
    visualElement: {
      type: '',
      url: '',
      alt: '',
      resource_id: '',
    },
    title: '',
    description: '',
  },
  metaDescription: '',
  topical: '',
  mostRead: [],
  editorsChoices: [],
  latestContent: [],
  goTo: [],
};

interface Subject {
  id: string;
  contentUri: string;
  name: string;
  path: string;
}

const EditSubjectFrontpage: FC<RouteComponentProps<{}> & Props> = ({
  t,
  subjectId,
  selectedLanguage,
}) => {
  const [frontpage, setFrontpage] = useState(emptyFrontpage);

  useEffect(() => {
    const fetchSubjectData = async (subjectId: number) => {
      try {
        const subject: Subject = await fetchSubject(subjectId);
        const frontpageId = subject.contentUri.split(':').pop() || '';

        fetchFrontpageData(frontpageId);
      } catch (e) {}
    };

    const fetchFrontpageData = async (frontpageId: string) => {
      try {
        const frontpage = await fetchSubjectFrontpage(frontpageId);
        setFrontpage(frontpage);
      } catch (e) {}
    };

    fetchSubjectData(subjectId);
  }, []);

  return (
    <OneColumn>
      <HelmetWithTracker
        title={`${frontpage.name} ${t('htmlTitles.titleTemplate')}`}
      />
      <SubjectFrontpageForm
        subjectId={subjectId}
        subject={frontpage}
        selectedLanguage={selectedLanguage}
      />
    </OneColumn>
  );
};

export default injectT(withRouter(EditSubjectFrontpage));
