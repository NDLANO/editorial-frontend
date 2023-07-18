/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { Code } from '@ndla/icons/editor';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  to: string;
  title: string;
  inHeader?: boolean;
}

interface StyledLinkProps {
  inHeader: boolean;
}

const shouldForwardProp = (prop: string) => prop !== 'inHeader';

const StyledLink = styled(Link, { shouldForwardProp })<StyledLinkProps>`
  box-shadow: none;
  &:hover svg,
  &:focus svg {
    border-color: ${colors.brand.primary};
    path:last-child {
      stroke: ${colors.brand.primary};
      fill: ${colors.brand.primary};
    }
  }
  svg {
    width: ${spacing.normal};
    height: ${spacing.normal};
    padding: 2px;
    border-radius: 50%;
    border: 2px solid ${colors.brand.light};

    path:last-child {
      stroke: ${colors.brand.light};
      fill: ${colors.brand.light};
    }
  }
  &[data-in-header='true'] {
    width: ${spacing.normal};
    padding-left: 0.4em;
    padding-right: 1.2em;
    svg {
      width: 18px;
      height: 18px;
      margin-bottom: 0.18em;
    }
  }
`;

export const EditMarkupLink = ({ title, to, inHeader }: Props) => {
  const location = useLocation();

  return (
    <StyledLink
      data-in-header={!!inHeader}
      inHeader={!!inHeader}
      data-testid="edit-markup-link"
      state={{ backUrl: location.pathname + location.search }}
      to={{ pathname: to }}
    >
      <Code title={title} />
    </StyledLink>
  );
};
