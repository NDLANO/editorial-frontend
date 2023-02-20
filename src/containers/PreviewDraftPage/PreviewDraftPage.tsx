/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { Hero, HeroContentType, OneColumn } from '@ndla/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PreviewDraft, { PreviewDraftV2 } from '../../components/PreviewDraft/PreviewDraft';
import * as articleApi from '../../modules/article/articleApi';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import * as draftApi from '../../modules/draft/draftApi';
import { queryResources } from '../../modules/taxonomy';
import { Resource } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { getContentTypeFromResourceTypes } from '../../util/resourceHelpers';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';
import LanguageSelector from './LanguageSelector';
import { useDraft } from '../../modules/draft/draftQueries';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { useDisableConverter } from '../../components/ArticleConverterContext';

const PreviewDraftPageV2 = () => {
  const params = useParams<'draftId' | 'language'>();
  const draftId = Number(params.draftId!);
  const language = params.language!;
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const draft = useDraft({ id: draftId, language });
  const resources = useNodes({
    contentURI: `urn:article:${draftId}`,
    taxonomyVersion,
    language,
    nodeType: 'RESOURCE',
  });

  if (resources.isLoading || draft.isLoading) {
    return null;
  }

  const label = resources.data?.[0]?.resourceTypes?.[0]?.name ?? '';
  const contentType = resources.data?.length
    ? getContentTypeFromResourceTypes(resources.data[0].resourceTypes).contentType
    : undefined;

  return (
    <>
      <Hero contentType={contentType as HeroContentType | undefined}>
        <LanguageSelector supportedLanguages={draft.data?.supportedLanguages ?? []} />
      </Hero>
      <HelmetWithTracker title={`${draft.data?.title?.title} ${t('htmlTitles.titleTemplate')}`} />
      <OneColumn>
        <PreviewDraftV2
          type="article"
          draft={draft.data!}
          label={label}
          contentType={contentType}
          language={language}
        />
      </OneColumn>
    </>
  );
};

const PreviewDraftPage = () => {
  const disableConverter = useDisableConverter();
  if (disableConverter) {
    return <PreviewDraftPageV2 />;
  }
  return <PreviewDraftPageV1 />;
};

const PreviewDraftPageV1 = () => {
  const params = useParams<'draftId' | 'language'>();
  const draftId = Number(params.draftId!);
  const language = params.language!;
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [draft, setDraft] = useState<ArticleConverterApiType | undefined>(undefined);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    if (!draftId) return;
    const fetchDraft = async () => {
      const fetchedDraft = await draftApi.fetchDraft(draftId, language);
      const convertedArticle = await articleApi.getPreviewArticle(fetchedDraft, language);
      setDraft(convertedArticle);
    };
    fetchDraft();
    const fetchResource = async () => {
      const fetchedResources = await queryResources({
        contentId: draftId,
        language,
        taxonomyVersion,
      });
      setResources(fetchedResources);
    };
    fetchResource();
  }, [draftId, language, taxonomyVersion]);

  if (!draft) {
    return null;
  }

  const hasResourceTypes = resources.length > 0;
  const contentTypeFromResourceType = hasResourceTypes
    ? getContentTypeFromResourceTypes(resources[0].resourceTypes)
    : undefined;

  const contentType = contentTypeFromResourceType?.contentType;
  const label = (hasResourceTypes && resources[0].resourceTypes[0]?.name) || '';

  return (
    <>
      <Hero contentType={contentType as HeroContentType | undefined}>
        <LanguageSelector supportedLanguages={draft.supportedLanguages} />
      </Hero>
      <HelmetWithTracker title={`${draft.title} ${t('htmlTitles.titleTemplate')}`} />
      <OneColumn>
        <PreviewDraft article={draft} contentType={contentType} language={language} label={label} />
      </OneColumn>
    </>
  );
};

export default PreviewDraftPage;
