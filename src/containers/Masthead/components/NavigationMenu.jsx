import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';
import { Launch } from '@ndla/icons/common';
import styled from '@emotion/styled';
import { colors, spacing, animations } from '@ndla/core';
import { Camera, Concept, H5P, Taxonomy } from '@ndla/icons/editor';
import { List } from '@ndla/icons/action';
import { Audio, Podcast } from '@ndla/icons/common';
import { ContentTypeBadge, constants } from '@ndla/ui';
import StyledListButton from '../../../components/StyledListButton';
import config from '../../../config';
import {
  toCreateLearningResource,
  toCreateTopicArticle,
  toCreateConcept,
  toCreateImage,
  toCreateAudioFile,
  toCreatePodcastFile,
  toCreatePodcastSeries,
  toEditNdlaFilm,
} from '../../../util/routeHelpers';

const OpenMenu = ({ t, close }) => {
  const StyledLink = StyledListButton.withComponent(Link);
  const StyledHrefLink = StyledListButton.withComponent('a');
  const { contentTypes } = constants;
  return (
    <StyledMenuContainer>
      <div>
        <nav>
          <div>
            <StyledLink to={toCreateLearningResource()} onClick={close}>
              <span>
                <ContentTypeBadge type={contentTypes.SUBJECT_MATERIAL} background size="xx-small" />{' '}
                {t('subNavigation.subjectMatter')}
              </span>
            </StyledLink>
            <StyledLink to={toCreateTopicArticle()} onClick={close}>
              <span>
                <ContentTypeBadge type={contentTypes.TOPIC} background size="xx-small" />{' '}
                {t('subNavigation.topicArticle')}
              </span>
            </StyledLink>
            <StyledLink to={toCreateConcept()} onClick={close}>
              <span>
                <Concept /> {t('subNavigation.newConcept')}
              </span>
            </StyledLink>
            <StyledLink to={toCreateImage()} onClick={close}>
              <span>
                <Camera /> {t('subNavigation.image')}
              </span>
            </StyledLink>
            <StyledLink to={toCreateAudioFile()} onClick={close}>
              <span>
                <Audio /> {t('subNavigation.audio')}
              </span>
            </StyledLink>
          </div>
          <div>
            <StyledLink to="/structure" onClick={close}>
              <span>
                <Taxonomy /> {t('subNavigation.structure')}
              </span>
            </StyledLink>
            <StyledLink to={toEditNdlaFilm()} onClick={close}>
              <span>
                <ContentTypeBadge type={contentTypes.SUBJECT} background size="xx-small" />{' '}
                {t('subNavigation.film')}
              </span>
            </StyledLink>
            <StyledLink to="/h5p" onClick={close}>
              <span>
                <H5P /> {t('subNavigation.h5p')}
              </span>
            </StyledLink>
            <StyledHrefLink
              href={config.learningpathFrontendDomain}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}>
              <span>
                <ContentTypeBadge type={contentTypes.LEARNING_PATH} background size="xx-small" />{' '}
                {t('subNavigation.learningPathLink')} <Launch />
              </span>
            </StyledHrefLink>
            <StyledLink to={toCreatePodcastFile()} onClick={close}>
              <span>
                <Podcast /> {t('subNavigation.podcast')}
              </span>
            </StyledLink>
            <StyledLink to={toCreatePodcastSeries()} onClick={close}>
              <span>
                <List /> {t('subNavigation.podcastSeries')}
              </span>
            </StyledLink>
          </div>
        </nav>
      </div>
    </StyledMenuContainer>
  );
};

const StyledMenuContainer = styled.div`
  background: ${colors.brand.greyLightest};
  position: absolute;
  right: 0;
  left: 0;
  transform: translateY(6px);
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

OpenMenu.propTypes = {
  close: PropTypes.func,
};

export default injectT(OpenMenu);
