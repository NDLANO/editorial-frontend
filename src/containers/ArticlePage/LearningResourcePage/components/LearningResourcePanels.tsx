import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { FormikHelpers, useFormikContext } from 'formik';
import config from '../../../../config';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { TAXONOMY_WRITE_SCOPE } from '../../../../constants';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import LearningResourceTaxonomy from './LearningResourceTaxonomy';
import LearningResourceContent from './LearningResourceContent';
import { LearningResourceFormType } from '../../../FormikForm/articleFormHooks';
import { DraftApiType, UpdatedDraftApiType } from '../../../../modules/draft/draftApiInterfaces';
import { useSession } from '../../../Session/SessionProvider';

interface Props {
  handleSubmit: (
    values: LearningResourceFormType,
    formikHelpers: FormikHelpers<LearningResourceFormType>,
  ) => Promise<void>;
  article?: DraftApiType;
  updateNotes: (art: UpdatedDraftApiType) => Promise<DraftApiType>;
  getArticle: (preview: boolean) => UpdatedDraftApiType;
  articleLanguage: string;
}

const LearningResourcePanels = ({
  article,
  updateNotes,
  getArticle,
  handleSubmit,
  articleLanguage,
}: Props) => {
  const { t } = useTranslation();
  const { userAccess } = useSession();
  const formikContext = useFormikContext<LearningResourceFormType>();
  const { values, setValues, errors, handleBlur, setStatus } = formikContext;

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
      {article && !!userAccess?.includes(TAXONOMY_WRITE_SCOPE) && (
        <AccordionSection
          id={'learning-resource-taxonomy'}
          title={t('form.taxonomySection')}
          className={'u-6/6'}>
          <LearningResourceTaxonomy article={article} updateNotes={updateNotes} />
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
      {article && (
        <AccordionSection
          id={'learning-resource-workflow'}
          title={t('form.workflowSection')}
          className={'u-6/6'}
          hasError={!!errors.notes}>
          <VersionAndNotesPanel
            article={article}
            getArticle={getArticle}
            setValues={setValues}
            setStatus={setStatus}
            type="standard"
          />
        </AccordionSection>
      )}
    </Accordions>
  );
};

export default LearningResourcePanels;
