/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikErrors } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { IArticle } from '@ndla/types-backend/draft-api';
import { ILearningPathV2 } from '@ndla/types-backend/learningpath-api';
import { Node } from '@ndla/types-taxonomy';

import SubjectpageAbout from './SubjectpageAbout';
import SubjectpageArticles from './SubjectpageArticles';
import SubjectpageMetadata from './SubjectpageMetadata';
import SubjectpageSubjectlinks from './SubjectpageSubjectlinks';
import FormAccordion from '../../../components/Accordion/FormAccordion';
import FormAccordions from '../../../components/Accordion/FormAccordions';
import FormikField from '../../../components/FormikField';
import { useSearchNodes } from '../../../modules/nodes/nodeQueries';
import { SubjectPageFormikType } from '../../../util/subjectHelpers';

interface Props {
  buildsOn: string[];
  connectedTo: string[];
  editorsChoices: (IArticle | ILearningPathV2)[];
  elementId: string;
  errors: FormikErrors<SubjectPageFormikType>;
  leadsTo: string[];
}

const SubjectpageAccordionPanels = ({
  buildsOn,
  connectedTo,
  editorsChoices,
  elementId,
  errors,
  leadsTo,
}: Props) => {
  const { t } = useTranslation();

  const subjectsLinks = buildsOn.concat(connectedTo).concat(leadsTo);

  const { data: nodeData } = useSearchNodes(
    {
      page: 1,
      taxonomyVersion: 'default',
      nodeType: 'SUBJECT',
      pageSize: subjectsLinks.length,
      ids: subjectsLinks,
    },
    { enabled: subjectsLinks.length > 0 },
  );

  const subjectLinks = useMemo(() => {
    if (nodeData && nodeData.results.length > 0) {
      return nodeData.results;
    }
    return null;
  }, [nodeData]);

  const transformToNodes = (list: string[]) => {
    const nodeList: Node[] = [];
    for (const i in list) {
      const nodeFound = subjectLinks?.find((value) => value.id === list[i]);
      if (nodeFound) {
        nodeList.push(nodeFound);
      }
    }
    return nodeList;
  };

  const SubjectPageArticle = () => (
    <SubjectpageArticles
      editorsChoices={editorsChoices}
      elementId={elementId}
      fieldName={'editorsChoices'}
    />
  );

  return (
    <FormAccordions defaultOpen={['about']}>
      <FormAccordion
        id="about"
        title={t('subjectpageForm.about')}
        className="u-4/6@desktop u-push-1/6@desktop"
        hasError={['title', 'description', 'visualElement'].some((field) => field in errors)}
      >
        <SubjectpageAbout />
      </FormAccordion>
      <FormAccordion
        id="metadata"
        title={t('subjectpageForm.metadata')}
        className="u-6/6"
        hasError={['metaDescription', 'desktopBannerId', 'mobileBannerId'].some(
          (field) => field in errors,
        )}
      >
        <SubjectpageMetadata />
      </FormAccordion>
      <FormAccordion
        id="subjectlinks"
        title={t('subjectpageForm.subjectlinks')}
        className="u-6/6"
        hasError={['connectedTo', 'buildsOn', 'leadsTo'].some((field) => field in errors)}
      >
        <SubjectpageSubjectlinks
          subjects={transformToNodes(connectedTo)}
          fieldName={'connectedTo'}
        />
        <SubjectpageSubjectlinks subjects={transformToNodes(buildsOn)} fieldName={'buildsOn'} />
        <SubjectpageSubjectlinks subjects={transformToNodes(leadsTo)} fieldName={'leadsTo'} />
      </FormAccordion>
      <FormAccordion
        id="articles"
        title={t('subjectpageForm.articles')}
        className="u-6/6"
        hasError={['editorsChoices'].some((field) => field in errors)}
      >
        <FormikField name={'editorsChoices'}>{SubjectPageArticle}</FormikField>
      </FormAccordion>
    </FormAccordions>
  );
};

export default SubjectpageAccordionPanels;
