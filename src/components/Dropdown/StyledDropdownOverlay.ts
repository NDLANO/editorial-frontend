/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { misc, spacing, shadows, stackOrder } from "@ndla/core";

interface Props {
  withArrow: boolean;
}

export const StyledDropdownOverlay = styled.div`
  position: absolute;
  z-index: ${stackOrder.dropdown - stackOrder.offsetSingle};
  background: #fff;
  padding: ${spacing.normal};
  box-shadow: ${shadows.levitate1};
  border-radius: ${misc.borderRadius};
  animation-duration: 400ms;
  animation-name: fadeInOverlay;
  ${(props: Props) =>
    props.withArrow
      ? css`
          &:before {
            content: "";
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
