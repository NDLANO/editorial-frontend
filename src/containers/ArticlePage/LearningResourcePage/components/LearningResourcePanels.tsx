/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { FormikHelpers, useFormikContext } from 'formik';
import { IUpdatedArticle, IArticle } from '@ndla/types-backend/draft-api';
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
import FormAccordions from '../../../../components/Accordion/FormAccordions';
import FormAccordion from '../../../../components/Accordion/FormAccordion';

interface Props {
  handleSubmit: (
    values: LearningResourceFormType,
    formikHelpers: FormikHelpers<LearningResourceFormType>,
  ) => Promise<void>;
  article?: IArticle;
  taxonomy?: ArticleTaxonomy;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
  existInTaxonomy: boolean;
  setExistInTaxonomy: (value: boolean) => void;
}

const LearningResourcePanels = ({
  article,
  taxonomy,
  updateNotes,
  handleSubmit,
  articleLanguage,
  existInTaxonomy,
  setExistInTaxonomy,
}: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const formikContext = useFormikContext<LearningResourceFormType>();
  const { values, errors, handleBlur } = formikContext;

  return (
    <FormAccordions defaultOpen={['learning-resource-content']}>
      <FormAccordion
        id={'learning-resource-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.title || errors.introduction || errors.content)}
      >
        <LearningResourceContent
          articleLanguage={articleLanguage}
          formik={formikContext}
          handleSubmit={() => handleSubmit(values, formikContext)}
          handleBlur={handleBlur}
          values={values}
        />
      </FormAccordion>
      {article && taxonomy && !!userPermissions?.includes(TAXONOMY_WRITE_SCOPE) && (
        <FormAccordion
          id={'learning-resource-taxonomy'}
          title={t('form.taxonomySection')}
          className={'u-6/6'}
          hasError={!existInTaxonomy}
        >
          <LearningResourceTaxonomy
            article={article}
            updateNotes={updateNotes}
            taxonomy={taxonomy}
            existInTaxonomy={existInTaxonomy}
            setExistInTaxonomy={setExistInTaxonomy}
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
        <CopyrightFieldGroup values={values} />
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
        >
          <VersionAndNotesPanel
            article={article}
            type="standard"
            currentLanguage={values.language}
          />
        </FormAccordion>
      )}
    </FormAccordions>
  );
};

export default LearningResourcePanels;
