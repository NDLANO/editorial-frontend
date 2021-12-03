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
import { ConvertedDraftType, SearchResult } from '../../../../interfaces';
import { LearningResourceFormikType } from '../../../FormikForm/articleFormHooks';
import { UpdatedDraftApiType } from '../../../../modules/draft/draftApiInterfaces';
import { useSession } from '../../../Session/SessionProvider';

interface Props {
  fetchSearchTags: (input: string, language: string) => Promise<SearchResult>;
  handleSubmit: (
    values: LearningResourceFormikType,
    formikHelpers: FormikHelpers<LearningResourceFormikType>,
  ) => Promise<void>;
  article: Partial<ConvertedDraftType>;
  formIsDirty: boolean;
  getInitialValues: (article: Partial<ConvertedDraftType>) => LearningResourceFormikType;
  updateNotes: (art: UpdatedDraftApiType) => Promise<ConvertedDraftType>;
  getArticle: (preview: boolean) => UpdatedDraftApiType;
}

const LearningResourcePanels = ({
  fetchSearchTags,
  article,
  updateNotes,
  getArticle,
  getInitialValues,
  formIsDirty,
  handleSubmit,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { userAccess } = useSession();
  const locale = i18n.language;
  const formikContext = useFormikContext<LearningResourceFormikType>();
  const { values, setValues, errors, handleBlur } = formikContext;

  const showTaxonomySection = !!values.id && !!userAccess?.includes(TAXONOMY_WRITE_SCOPE);

  return (
    <Accordions>
      <AccordionSection
        id={'learning-resource-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.title || errors.introduction || errors.content)}
        startOpen>
        <LearningResourceContent
          formik={formikContext}
          handleSubmit={() => handleSubmit(values, formikContext)}
          handleBlur={handleBlur}
          values={values}
          article={article}
          locale={locale}
        />
      </AccordionSection>
      {showTaxonomySection && (
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
        <MetaDataField fetchSearchTags={fetchSearchTags} article={article} />
      </AccordionSection>
      <AccordionSection
        id={'learning-resource-grepCodes'}
        title={t('form.name.grepCodes')}
        className={'u-6/6'}
        hasError={!!errors.grepCodes}>
        <GrepCodesField grepCodes={article.grepCodes ?? []} />
      </AccordionSection>
      {config.ndlaEnvironment === 'test' && (
        <AccordionSection
          id={'learning-resource-related'}
          title={t('form.name.relatedContent')}
          className={'u-6/6'}
          hasError={!!(errors.conceptIds || errors.relatedContent)}>
          <RelatedContentFieldGroup values={values} locale={locale} />
        </AccordionSection>
      )}
      {values.id && (
        <AccordionSection
          id={'learning-resource-workflow'}
          title={t('form.workflowSection')}
          className={'u-6/6'}
          hasError={!!errors.notes}>
          <VersionAndNotesPanel
            article={article}
            articleId={values.id}
            getArticle={getArticle}
            getInitialValues={getInitialValues}
            setValues={setValues}
          />
        </AccordionSection>
      )}
    </Accordions>
  );
};

export default LearningResourcePanels;
