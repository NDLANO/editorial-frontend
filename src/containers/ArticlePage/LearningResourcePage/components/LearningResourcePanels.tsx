/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { IUpdatedArticle, IArticle } from '@ndla/types-backend/draft-api';
import { memo, useMemo } from 'react';
import { Node, TaxonomyContext } from '@ndla/types-taxonomy';
import config from '../../../../config';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { TAXONOMY_WRITE_SCOPE } from '../../../../constants';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import LearningResourceTaxonomy from './LearningResourceTaxonomy';
import LearningResourceContent from './LearningResourceContent';
import { HandleSubmitFunc, LearningResourceFormType } from '../../../FormikForm/articleFormHooks';
import { useSession } from '../../../Session/SessionProvider';
import RevisionNotes from '../../components/RevisionNotes';
import FormAccordions from '../../../../components/Accordion/FormAccordions';
import FormAccordion from '../../../../components/Accordion/FormAccordion';

interface Props {
  article?: IArticle;
  taxonomy?: Node[];
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  handleSubmit: HandleSubmitFunc<LearningResourceFormType>;
  articleLanguage: string;
  contexts?: TaxonomyContext[];
}

const LearningResourcePanels = ({
  article,
  taxonomy,
  updateNotes,
  articleLanguage,
  contexts,
  handleSubmit,
}: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { errors } = useFormikContext<LearningResourceFormType>();
  const defaultOpen = useMemo(() => ['learning-resource-content'], []);

  return (
    <FormAccordions defaultOpen={defaultOpen}>
      <FormAccordion
        id={'learning-resource-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.title || errors.introduction || errors.content)}
      >
        <LearningResourceContent
          articleLanguage={articleLanguage}
          articleId={article?.id}
          handleSubmit={handleSubmit}
        />
      </FormAccordion>
      {!!article && !!taxonomy && !!userPermissions?.includes(TAXONOMY_WRITE_SCOPE) && (
        <FormAccordion
          id={'learning-resource-taxonomy'}
          title={t('form.taxonomySection')}
          className={'u-6/6'}
          hasError={!contexts?.length}
        >
          <LearningResourceTaxonomy
            article={article}
            updateNotes={updateNotes}
            articleLanguage={articleLanguage}
            hasTaxEntries={!!contexts?.length}
          />
        </FormAccordion>
      )}
      <FormAccordion
        id={'learning-resource-copyright'}
        title={t('form.copyrightSection')}
        className={'u-6/6'}
        hasError={
          !!(errors.creators || errors.rightsholders || errors.processors || errors.license)
        }
      >
        <CopyrightFieldGroup />
      </FormAccordion>
      <FormAccordion
        id={'learning-resource-metadata'}
        title={t('form.metadataSection')}
        className={'u-6/6'}
        hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}
      >
        <MetaDataField articleLanguage={articleLanguage} />
      </FormAccordion>
      <FormAccordion
        id={'learning-resource-grepCodes'}
        title={t('form.name.grepCodes')}
        className={'u-6/6'}
        hasError={!!errors.grepCodes}
      >
        <GrepCodesField />
      </FormAccordion>
      {config.ndlaEnvironment === 'test' && (
        <FormAccordion
          id={'learning-resource-related'}
          title={t('form.name.relatedContent')}
          className={'u-6/6'}
          hasError={!!(errors.conceptIds || errors.relatedContent)}
        >
          <RelatedContentFieldGroup />
        </FormAccordion>
      )}
      <FormAccordion
        id={'learning-resource-revisions'}
        title={t('form.name.revisions')}
        className={'u-6/6'}
        hasError={!!errors.revisionMeta || !!errors.revisionError}
      >
        <RevisionNotes />
      </FormAccordion>
      {article && (
        <FormAccordion
          id={'learning-resource-workflow'}
          title={t('form.workflowSection')}
          className={'u-6/6'}
          hasError={!!errors.notes}
          data-testid={'learning-resource-workflow'}
        >
          <VersionAndNotesPanel
            article={article}
            type="standard"
            currentLanguage={articleLanguage}
          />
        </FormAccordion>
      )}
    </FormAccordions>
  );
};

export default memo(LearningResourcePanels);
