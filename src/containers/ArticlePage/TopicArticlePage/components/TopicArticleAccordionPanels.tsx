import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { useFormikContext } from 'formik';
import config from '../../../../config';
import TopicArticleContent from './TopicArticleContent';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import TopicArticleTaxonomy from './TopicArticleTaxonomy';
import { TAXONOMY_WRITE_SCOPE } from '../../../../constants';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import { TopicArticleFormType } from '../../../FormikForm/articleFormHooks';
import { DraftApiType, UpdatedDraftApiType } from '../../../../modules/draft/draftApiInterfaces';
import { useSession } from '../../../Session/SessionProvider';

interface Props {
  handleSubmit: () => Promise<void>;
  article?: DraftApiType;
  updateNotes: (art: UpdatedDraftApiType) => Promise<DraftApiType>;
  getArticle: () => UpdatedDraftApiType;
  articleLanguage: string;
}

const TopicArticleAccordionPanels = ({
  handleSubmit,
  article,
  updateNotes,
  getArticle,
  articleLanguage,
}: Props) => {
  const { t } = useTranslation();
  const { userAccess } = useSession();
  const { values, errors, setValues } = useFormikContext<TopicArticleFormType>();
  return (
    <Accordions>
      <AccordionSection
        id={'topic-article-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.title || errors.introduction || errors.content || errors.visualElement)}
        startOpen>
        <TopicArticleContent handleSubmit={handleSubmit} values={values} />
      </AccordionSection>
      {article && !!userAccess?.includes(TAXONOMY_WRITE_SCOPE) && (
        <AccordionSection
          id={'topic-article-taxonomy'}
          title={t('form.taxonomySection')}
          className={'u-6/6'}>
          <TopicArticleTaxonomy article={article} updateNotes={updateNotes} />
        </AccordionSection>
      )}
      <AccordionSection
        id={'topic-article-copyright'}
        title={t('form.copyrightSection')}
        className={'u-6/6'}
        hasError={
          !!(errors.creators || errors.rightsholders || errors.processors || errors.license)
        }>
        <CopyrightFieldGroup values={values} />
      </AccordionSection>
      <AccordionSection
        id={'topic-article-metadata'}
        title={t('form.metadataSection')}
        className={'u-6/6'}
        hasError={!!(errors.metaDescription || errors.tags)}>
        <MetaDataField articleLanguage={articleLanguage} />
      </AccordionSection>
      <AccordionSection
        id={'topic-article-grepCodes'}
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
          id={'topic-article-workflow'}
          title={t('form.workflowSection')}
          className={'u-6/6'}
          hasError={!!errors.notes}>
          <VersionAndNotesPanel article={article} getArticle={getArticle} setValues={setValues} />
        </AccordionSection>
      )}
    </Accordions>
  );
};

export default TopicArticleAccordionPanels;
