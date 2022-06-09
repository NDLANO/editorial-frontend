/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { Hero, OneColumn } from '@ndla/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PreviewDraft from '../../components/PreviewDraft/PreviewDraft';
import * as articleApi from '../../modules/article/articleApi';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import * as draftApi from '../../modules/draft/draftApi';
import { queryResources } from '../../modules/taxonomy';
import { Resource } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { getContentTypeFromResourceTypes } from '../../util/resourceHelpers';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';
import LanguageSelector from './LanguageSelector';

const PreviewDraftPage = () => {
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
      <Hero contentType={contentType}>
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
