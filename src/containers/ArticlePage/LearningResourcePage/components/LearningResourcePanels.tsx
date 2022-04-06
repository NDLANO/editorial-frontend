/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { FormikHelpers, useFormikContext } from 'formik';
import { IUpdatedArticle, IArticle } from '@ndla/types-draft-api';
import config from '../../../../config';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { TAXONOMY_WRITE_SCOPE } from '../../../../constants';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import LearningResourceTaxonomy from './LearningResourceTaxonomy';
import LearningResourceContent from './LearningResourceContent';
import { LearningResourceFormType } from '../../../FormikForm/articleFormHooks';
import { useSession } from '../../../Session/SessionProvider';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';
import RevisionNotes from '../../components/RevisionNotes';

interface Props {
  handleSubmit: (
    values: LearningResourceFormType,
    formikHelpers: FormikHelpers<LearningResourceFormType>,
  ) => Promise<void>;
  article?: IArticle;
  taxonomy?: ArticleTaxonomy;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  getArticle: (preview: boolean) => IUpdatedArticle;
  articleLanguage: string;
}

const LearningResourcePanels = ({
  article,
  taxonomy,
  updateNotes,
  getArticle,
  handleSubmit,
  articleLanguage,
}: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const formikContext = useFormikContext<LearningResourceFormType>();
  const { values, errors, handleBlur } = formikContext;

  return (
    <Accordions>
      <AccordionSection
        id={'learning-resource-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.title || errors.introduction || errors.content)}
        startOpen>
        <LearningResourceContent
          articleLanguage={articleLanguage}
          formik={formikContext}
          handleSubmit={() => handleSubmit(values, formikContext)}
          handleBlur={handleBlur}
          values={values}
        />
      </AccordionSection>
      {article && taxonomy && !!userPermissions?.includes(TAXONOMY_WRITE_SCOPE) && (
        <AccordionSection
          id={'learning-resource-taxonomy'}
          title={t('form.taxonomySection')}
          className={'u-6/6'}>
          <LearningResourceTaxonomy
            article={article}
            updateNotes={updateNotes}
            taxonomy={taxonomy}
          />
        </AccordionSection>
      )}
      <AccordionSection
        id={'learning-resource-copyright'}
        title={t('form.copyrightSection')}
        className={'u-6/6'}
        hasError={
          !!(errors.creators || errors.rightsholders || errors.processors || errors.license)
        }>
        <CopyrightFieldGroup values={values} />
      </AccordionSection>
      <AccordionSection
        id={'learning-resource-metadata'}
        title={t('form.metadataSection')}
        className={'u-6/6'}
        hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}>
        <MetaDataField articleLanguage={articleLanguage} />
      </AccordionSection>
      <AccordionSection
        id={'learning-resource-grepCodes'}
        title={t('form.name.grepCodes')}
        className={'u-6/6'}
        hasError={!!errors.grepCodes}>
        <GrepCodesField />
      </AccordionSection>
      {config.ndlaEnvironment === 'test' && (
        <AccordionSection
          id={'learning-resource-related'}
          title={t('form.name.relatedContent')}
          className={'u-6/6'}
          hasError={!!(errors.conceptIds || errors.relatedContent)}>
          <RelatedContentFieldGroup />
        </AccordionSection>
      )}
      <AccordionSection
        id={'learning-resource-revisions'}
        title={t('form.name.revisions')}
        className={'u-6/6'}
        hasError={!!errors.revisionMeta}>
        <RevisionNotes />
      </AccordionSection>
      {article && (
        <AccordionSection
          id={'learning-resource-workflow'}
          title={t('form.workflowSection')}
          className={'u-6/6'}
          hasError={!!errors.notes}>
          <VersionAndNotesPanel
            article={article}
            getArticle={getArticle}
            type="standard"
            currentLanguage={values.language}
          />
        </AccordionSection>
      )}
    </Accordions>
  );
};

export default LearningResourcePanels;
