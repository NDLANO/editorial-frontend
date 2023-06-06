/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Launch, Audio, Podcast } from '@ndla/icons/common';
import styled from '@emotion/styled';
import { spacing, animations } from '@ndla/core';
import { Camera, Concept, H5P, Taxonomy, Video } from '@ndla/icons/editor';
import { List } from '@ndla/icons/action';
//@ts-ignore
import { ContentTypeBadge, constants } from '@ndla/ui';
import Tooltip from '@ndla/tooltip';
import StyledListButton from '../../../components/StyledListButton';
import config from '../../../config';
import {
  toCreateConcept,
  toCreateImage,
  toCreateAudioFile,
  toCreatePodcastFile,
  toCreatePodcastSeries,
  toEditNdlaFilm,
  toCreateFrontPageArticle,
  toCreateLearningResource,
  toCreateTopicArticle,
} from '../../../util/routeHelpers';
import { useSession } from '../../Session/SessionProvider';
import { AUDIO_ADMIN_SCOPE, DRAFT_ADMIN_SCOPE, TAXONOMY_ADMIN_SCOPE } from '../../../constants';

const StyledMenuItem = styled.span`
  display: flex;
  gap: ${spacing.xxsmall};
  align-items: center;
`;

const StyledMenuContainer = styled.div`
  right: 0;
  left: 0;
  transform: translateY(${spacing.xsmall});
  ${animations.fadeIn(animations.durations.superFast)};

  > div {
    max-width: 660px;
    margin: ${spacing.large} auto;
  }

  nav {
    display: flex;
    justify-content: space-between;

    > div {
      display: flex;
      flex-direction: column;
      width: calc(50% - ${spacing.normal});
    }
  }
`;

const DisabledHrefLink = styled(StyledListButton.withComponent('a'))`
  cursor: default;
`;

interface Props {
  close: () => void;
}

const OpenMenu = ({ close }: Props) => {
  const { t } = useTranslation();
  const StyledLink = StyledListButton.withComponent(Link);
  const StyledHrefLink = StyledListButton.withComponent('a');
  const { contentTypes } = constants;
  const { userPermissions } = useSession();
  return (
    <StyledMenuContainer>
      <div>
        <nav>
          <div>
            <DisabledHrefLink aria-disabled={true} role="link">
              <Tooltip tooltip={t('subNavigation.creationMovedInfo')}>
                <StyledMenuItem>
                  <ContentTypeBadge
                    type={contentTypes.SUBJECT_MATERIAL}
                    background
                    size="xx-small"
                  />
                  {t('subNavigation.subjectMatter')}
                </StyledMenuItem>
              </Tooltip>
            </DisabledHrefLink>
            <DisabledHrefLink aria-disabled={true} role="link">
              <Tooltip tooltip={t('subNavigation.creationMovedInfo')}>
                <StyledMenuItem>
                  <ContentTypeBadge type={contentTypes.TOPIC} background size="xx-small" />
                  {t('subNavigation.topicArticle')}
                </StyledMenuItem>
              </Tooltip>
            </DisabledHrefLink>
            <StyledLink to={toCreateConcept()} onClick={close}>
              <StyledMenuItem>
                <Concept /> {t('subNavigation.newConcept')}
              </StyledMenuItem>
            </StyledLink>
            <StyledLink to={toCreateFrontPageArticle()} onClick={close}>
              <StyledMenuItem>
                <ContentTypeBadge type={contentTypes.SUBJECT_MATERIAL} background size="xx-small" />
                {t('subNavigation.newFrontpageArticle')}
              </StyledMenuItem>
            </StyledLink>
            <StyledLink to={toCreateImage()} onClick={close}>
              <StyledMenuItem>
                <Camera />
                {t('subNavigation.image')}
              </StyledMenuItem>
            </StyledLink>
            <StyledLink to={toCreateAudioFile()} onClick={close}>
              <StyledMenuItem>
                <Audio />
                {t('subNavigation.audio')}
              </StyledMenuItem>
            </StyledLink>
            <StyledLink to={toCreatePodcastFile()} onClick={close}>
              <StyledMenuItem>
                <Podcast />
                {t('subNavigation.podcast')}
              </StyledMenuItem>
            </StyledLink>
            {userPermissions?.includes(AUDIO_ADMIN_SCOPE) && (
              <StyledLink to={toCreatePodcastSeries()} onClick={close}>
                <StyledMenuItem>
                  <List />
                  {t('subNavigation.podcastSeries')}
                </StyledMenuItem>
              </StyledLink>
            )}
          </div>
          <div>
            <StyledLink to="/structure" onClick={close}>
              <StyledMenuItem>
                <Taxonomy />
                {t('subNavigation.structure')}
              </StyledMenuItem>
            </StyledLink>
            {userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) && config.versioningEnabled && (
              <StyledLink to="/taxonomyVersions" onClick={close}>
                <StyledMenuItem>
                  <Taxonomy />
                  {t('subNavigation.taxonomyVersions')}
                </StyledMenuItem>
              </StyledLink>
            )}
            {config.versioningEnabled === 'true' && (
              <StyledLink to="publishRequests" onClick={close}>
                <StyledMenuItem>
                  <Taxonomy />
                  {t('subNavigation.publishRequests')}
                </StyledMenuItem>
              </StyledLink>
            )}
            <StyledLink to={toEditNdlaFilm()} onClick={close}>
              <StyledMenuItem>
                <ContentTypeBadge type={contentTypes.SUBJECT} background size="xx-small" />
                {t('subNavigation.film')}
              </StyledMenuItem>
            </StyledLink>
            <StyledLink to="/h5p" onClick={close}>
              <StyledMenuItem>
                <H5P />
                {t('subNavigation.h5p')}
              </StyledMenuItem>
            </StyledLink>
            {userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
              <StyledHrefLink
                href={config.brightcoveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
              >
                <StyledMenuItem>
                  <Video />
                  {t('subNavigation.brightcoveLink')}
                  <Launch />
                </StyledMenuItem>
              </StyledHrefLink>
            )}
            <StyledHrefLink
              href={config.learningpathFrontendDomain}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              <StyledMenuItem>
                <ContentTypeBadge type={contentTypes.LEARNING_PATH} background size="xx-small" />
                {t('subNavigation.learningPathLink')}
                <Launch />
              </StyledMenuItem>
            </StyledHrefLink>
          </div>
        </nav>
      </div>
    </StyledMenuContainer>
  );
};

export default OpenMenu;
