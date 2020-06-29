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
import { fetchSubjectFrontpage } from '../../modules/frontpage/frontpageApi';
import { fetchSubject } from '../../modules/taxonomy/taxonomyApi';
import { TranslateType } from '../../interfaces';
import SubjectpageForm from './components/SubjectpageForm';

interface Props {
  t: TranslateType;
  subjectId: number;
  selectedLanguage: string;
}

const emptySubjectpage = {
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

// @ts-ignore
const EditSubjectpage : FC<RouteComponentProps & Props> = ({
  t,
  subjectId,
  selectedLanguage,
}) => {
  const [subjectpage, setSubjectpage] = useState(emptySubjectpage);

  useEffect(() => {
    const fetchSubjectData = async (subjectId: number) => {
      try {
        const subject: Subject = await fetchSubject(subjectId);
        const subjectpageId = subject.contentUri.split(':').pop() || '';

        fetchFrontpageData(subjectpageId);
      } catch (e) {}
    };

    const fetchFrontpageData = async (subjectpageId: string) => {
      try {
        const subjectpage = await fetchSubjectFrontpage(subjectpageId);
        setSubjectpage(subjectpage);
      } catch (e) {}
    };

    fetchSubjectData(subjectId);
  }, []);

  if (subjectpage === undefined){
    return;
  }

  return (
    <>
      { <HelmetWithTracker
          title={`${subjectpage.name} ${t('htmlTitles.titleTemplate')}`}
      />}
      <SubjectpageForm
        subjectId={subjectId}
        subject={subjectpage}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
};

export default injectT(withRouter(EditSubjectpage));
