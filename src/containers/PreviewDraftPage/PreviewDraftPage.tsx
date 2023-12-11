/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { HelmetWithTracker } from '@ndla/tracker';
import { Hero, HeroContentType, OneColumn } from '@ndla/ui';
import LanguageSelector from './LanguageSelector';
import PreviewDraft from '../../components/PreviewDraft/PreviewDraft';
import { useDraft } from '../../modules/draft/draftQueries';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { getContentTypeFromResourceTypes } from '../../util/resourceHelpers';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

const StyledOneColumn = styled(OneColumn)`
  &[data-wide='true'] {
    background-color: ${colors.background.lightBlue};
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    padding: 0 ${spacing.normal};
    max-width: 100%;
  }
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
      <StyledOneColumn data-wide={isFrontpage}>
        <PreviewDraft
          type="article"
          draft={draft.data!}
          label={label}
          contentType={contentType}
          language={language}
        />
      </StyledOneColumn>
    </>
  );
};

export default PreviewDraftPage;
