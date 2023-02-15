/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { AlertCircle, Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';
import { IArticle } from '@ndla/types-draft-api';
import config from '../../../config';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';
import { PUBLISHED } from '../../../constants';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';
import { getCountApproachingRevision, RevisionDateIcon } from './ApproachingRevisionDate';
import WrongTypeError from './WrongTypeError';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { getTaxonomyPathsFromTaxonomy } from '../../../components/HeaderWithLanguage/util';

const StyledCheckIcon = styled(Check)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.green};
`;

const StyledWarnIcon = styled(AlertCircle)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.yellow};
`;

const StyledLink = styled(SafeLink)`
  box-shadow: inset 0 0;
`;

const CheckedWrapper = styled.div`
  display: flex;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-align: center;
`;

interface Props {
  article: IArticle | undefined;
  contentMetaLoading: boolean;
  resource: ResourceWithNodeConnectionAndMeta;
  path?: string;
}

const StatusIcons = ({ article, contentMetaLoading, resource, path }: Props) => {
  const { selectedLanguage } = useParams();
  const { t } = useTranslation();

  const id = getIdFromUrn(resource?.contentMeta?.contentUri);
  const { taxonomy, loading: fetchArticleLoading } = useFetchArticleData(
    id,
    selectedLanguage ?? '',
  );
  const taxonomyPaths = useMemo(() => getTaxonomyPathsFromTaxonomy(taxonomy, id), [taxonomy, id]);

  const isApproachingRevision = useMemo(() => {
    if (!article) return false;
    return !!getCountApproachingRevision([article]);
  }, [article]);

  return (
    <IconWrapper>
      {isApproachingRevision ? (
        <RevisionDateIcon text="!" phrasesKey="form.responsible.revisionDateSingle" />
      ) : null}
      {!contentMetaLoading && (
        <WrongTypeError resource={resource} articleType={resource.contentMeta?.articleType} />
      )}
      {taxonomyPaths?.length > 2 && (
        <Tooltip tooltip={t('form.workflow.multipleTaxonomy')}>
          <IconWrapper>
            <StyledWarnIcon />
          </IconWrapper>
        </Tooltip>
      )}

      {(resource.contentMeta?.status?.current === PUBLISHED ||
        resource.contentMeta?.status?.other?.includes(PUBLISHED)) && (
        <PublishedWrapper path={path}>
          <Tooltip tooltip={t('form.workflow.published')}>
            <CheckedWrapper>
              <StyledCheckIcon />
            </CheckedWrapper>
          </Tooltip>
        </PublishedWrapper>
      )}
    </IconWrapper>
  );
};

const PublishedWrapper = ({ path, children }: { path?: string; children: ReactElement }) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  if (!path) {
    return children;
  }
  return (
    <StyledLink
      target="_blank"
      to={`${config.ndlaFrontendDomain}${path}?versionHash=${taxonomyVersion}`}>
      {children}
    </StyledLink>
  );
};

export default StatusIcons;
