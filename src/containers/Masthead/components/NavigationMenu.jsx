import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { colors, spacing, animations } from '@ndla/core';
import StyledListButton from '../../../components/StyledListButton';
import config from '../../../config';
import {
  toCreateLearningResource,
  toCreateTopicArticle,
  toCreateConcept,
  toCreateImage,
  toCreateAudioFile,
} from '../../../util/routeHelpers';

const OpenMenu = ({ t, close }) => {
  const StyledLink = StyledListButton.withComponent(Link);
  const StyledHrefLink = StyledListButton.withComponent('a');
  return (
    <StyledMenuContainer>
      <div>
        <nav>
          <div>
            <StyledLink to={toCreateLearningResource()} onClick={close}>
              <span>{t('subNavigation.subjectMatter')}</span>
            </StyledLink>
            <StyledLink to={toCreateTopicArticle()} onClick={close}>
              <span>{t('subNavigation.topicArticle')}</span>
            </StyledLink>
            <StyledLink to={toCreateImage()} onClick={close}>
              <span>{t('subNavigation.image')}</span>
            </StyledLink>
            <StyledLink to={toCreateAudioFile()} onClick={close}>
              <span>{t('subNavigation.audio')}</span>
            </StyledLink>
            <StyledLink to="/agreement/new" onClick={close}>
              <span>{t('subNavigation.agreement')}</span>
            </StyledLink>
            <StyledLink to={toCreateConcept()} onClick={close}>
              <span>Begrep</span>
            </StyledLink>
          </div>
          <div>
            <StyledHrefLink
              href={config.learningpathFrontendDomain}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}>
              <span>{t('subNavigation.learningPathLink')}</span>
            </StyledHrefLink>
            <StyledLink to={'/notions'} onClick={close}>
              <span>{t('subNavigation.concept')}</span>
            </StyledLink>
            <StyledLink to="/structure" onClick={close}>
              <span>{t('subNavigation.structure')}</span>
            </StyledLink>
            <StyledLink to="/film" onClick={close}>
              <span>{t('subNavigation.film')}</span>
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
