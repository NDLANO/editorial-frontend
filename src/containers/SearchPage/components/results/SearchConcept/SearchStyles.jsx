/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';

export const StyledInfo = styled.div`
  color: ${colors.text.light};
  line-height: 1rem;
  font-size: 0.7rem;
`;

export const StyledConceptView = styled.div`
  display: inline-block;
  width: 90%;
  align-self: center;
  padding-left: 1.3rem;

  h2 {
    font-size: 1.2rem;
    margin: 1.3rem 0 0.3rem;
    font-weight: 600;

    svg {
      margin-right: 0.2rem;
    }
  }
`;

export const StyledLink = styled(({ noShadow, other, ...rest }) => (
  <Link {...rest} />
))`
  &:any-link {
    color: ${colors.brand.primary};
  }

  box-shadow: ${props => (props.noShadow ? 'none' : 'inset 0 -1px')};

  ${props =>
    props.other
      ? css`
          &:not(:last-child) {
            &::after {
              content: ' / ';
            }
          }
        `
      : ''}
`;

export const StyledDescription = styled.p`
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0.2rem 0 1.2rem;
`;

export const Crumb = styled.p`
  margin: auto 13px auto 0px;
  font-size: 0.7rem;
  color: black;
  text-decoration: underline;
`;

export const StyledBreadcrumbs = styled.div`
  display: flex;
  margin-top: -20px;
`;
