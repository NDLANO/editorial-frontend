import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { colors, spacing, animations } from '@ndla/core';
import { StyledMenuItem } from './StyledMenuItem';
import config from '../../../config';
import {
  toCreateLearningResource,
  toCreateTopicArticle,
  toCreateImage,
  toCreateAudioFile,
} from '../../../util/routeHelpers';

const OpenMenu = ({ t, close }) => {
  const StyledNormalLink = StyledMenuItem.withComponent('a');
  return (
    <StyledMenuContainer>
      <div>
        <nav>
          <div>
            <StyledMenuItem to={toCreateLearningResource()} onClick={close}>
              <span>{t('subNavigation.subjectMatter')}</span>
            </StyledMenuItem>
            <StyledMenuItem to={toCreateTopicArticle()} onClick={close}>
              <span>{t('subNavigation.topicArticle')}</span>
            </StyledMenuItem>
            <StyledMenuItem to={toCreateImage()} onClick={close}>
              <span>{t('subNavigation.image')}</span>
            </StyledMenuItem>
            <StyledMenuItem to={toCreateAudioFile()} onClick={close}>
              <span>{t('subNavigation.audio')}</span>
            </StyledMenuItem>
            <StyledMenuItem to="/agreement/new" onClick={close}>
              <span>{t('subNavigation.agreement')}</span>
            </StyledMenuItem>
          </div>
          <div>
            <StyledNormalLink
              href={config.learningpathFrontendDomain}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}>
              <span>{t('subNavigation.learningPathLink')}</span>
            </StyledNormalLink>
            <StyledMenuItem to={'/notions'} onClick={close}>
              <span>{t('subNavigation.concept')}</span>
            </StyledMenuItem>
            <StyledMenuItem to="/structure" onClick={close}>
              <span>{t('subNavigation.structure')}</span>
            </StyledMenuItem>
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
