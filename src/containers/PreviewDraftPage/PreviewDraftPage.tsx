/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { Hero, HeroContentType, OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import PreviewDraft from '../../components/PreviewDraft/PreviewDraft';
import { getContentTypeFromResourceTypes } from '../../util/resourceHelpers';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';
import LanguageSelector from './LanguageSelector';
import { useDraft } from '../../modules/draft/draftQueries';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { isFrontpageArticle } from '../ArticlePage/FrontpageArticlePage/components/FrontpageArticleProvider';
import { spacing } from '@ndla/core';

const frontpageBackgroundColor = css`
  background-color: #f7fafd;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin: unset;
  max-width: unset;
`;

const frontpageCss = css`
  ${frontpageBackgroundColor};
  padding: 0 ${spacing.normal};
`;

const PreviewDraftPage = () => {
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

  const isFrontpage = draft.data?.articleType === 'frontpage-article';
  const isWideFrontpage = isFrontpageArticle(draft.data?.id!);
  return (
    <>
      <Hero
        contentType={
          isFrontpage ? 'frontpage-article' : (contentType as HeroContentType | undefined)
        }
      >
        <LanguageSelector supportedLanguages={draft.data?.supportedLanguages ?? []} />
      </Hero>

      <HelmetWithTracker title={`${draft.data?.title?.title} ${t('htmlTitles.titleTemplate')}`} />
      <OneColumn
        css={isFrontpage ? (isWideFrontpage ? frontpageCss : frontpageBackgroundColor) : undefined}
      >
        <PreviewDraft
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

export default PreviewDraftPage;
