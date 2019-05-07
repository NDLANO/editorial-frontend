import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { animations, spacing, shadows, misc } from '@ndla/core';

export const StyledOverlay = styled.div`
  position: absolute;
  z-index: 9999;
  background: #fff;
  padding: ${spacing.normal};
  box-shadow: ${shadows.levitate1};
  border-radius: ${misc.borderRadius};
  animation-duration: 400ms;
  animation-name: fadeInOverlay;
  ${props =>
    props.withArrow
      ? css`
          &:before {
            content: '';
            display: block;
            position: absolute;
            top: -${spacing.small};
            width: 0;
            height: 0;
            border-left: ${spacing.small} solid transparent;
            border-right: ${spacing.small} solid transparent;
            border-bottom: ${spacing.small} solid #fff;
          }
          transform: translateY(${spacing.normal});
          @keyframes fadeInOverlay {
            0% {
              transform: translateY(${spacing.large});
              opacity: 0;
            }
            100% {
              transform: translateY(${spacing.normal});
              opacity: 1;
            }
          }
        `
      : css`
          transform: translateY(${spacing.small});
          @keyframes fadeInOverlay {
            0% {
              transform: translateY(${spacing.medium});
              opacity: 0;
            }
            100% {
              transform: translateY(${spacing.small});
              opacity: 1;
            }
          }
        `}
`;

export const StyledOverlayBackground = styled.div`
  display: block;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 9998;
  ${animations.fadeIn()}
`;
