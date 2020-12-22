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
  padding: 0.7rem 1.3rem;
  margin: 0.3rem 0;
  border: ${props => (props.border ? '1px solid black' : 'none')};
  background-color: ${props => (props.border ? colors.brand.light : 'auto')};

  h2 {
    font-size: 1.2rem;
    margin: 0;
    font-weight: 600;

    svg {
      margin-right: 0.2rem;
    }
  }
  .c-radio-button-group {
    &__wrapper {
      padding: 0;
      height: 38.4px;
    }
    &__label {
      margin-right: 20px;
    }
  }
  .buttons {
    margin-top: 10px;

    .form-button {
      margin-right: 5px;
      &.secondary {
        &:not(:hover) {
          background-color: transparent;
          color: ${colors.brand.primary};
        }
      }
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

export const InputField = styled.div`
  flex-grow: ${props => (props.ratio ? props.ratio : 1)};

  label,
  p {
    margin: 0;
    text-transform: capitalize;
    font-weight: 600;
  }
  input {
    margin-bottom: 5px;
    border-radius: 4px;

    &[type='radio'] {
      width: auto;
      border-radius: auto;
      padding: auto;
    }
  }
`;

export const InputPair = styled.div`
  display: flex;

  ${InputField} {
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;
