/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { colors, spacing, fonts } from '@ndla/core';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface ItemTitleButtonProps {
  isVisible?: boolean;
  hasChildNodes?: boolean;
  lastItemClickable?: boolean;
  isRootNode?: boolean;
  arrowDirection?: number;
}

export const itemTitleArrow = css`
  &:before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 9px solid ${colors.text.primary};
    margin-right: ${spacing.xsmall};
  }
`;

export const itemTitleLinked = css`
  &:before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-bottom: 2px solid ${colors.brand.light};
    border-left: 2px solid ${colors.brand.light};
    border-bottom-left-radius: 2px;
    margin-right: ${spacing.xsmall};
  }
`;

export const ItemTitleButton = styled.button<ItemTitleButtonProps>`
  ${fonts.sizes(16, 1)};
  font-weight: ${fonts.weight.semibold};
  border: 0;
  background: 0;
  color: ${(props) => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
  display: flex;
  align-items: center;
  text-align: left;
  font-style: ${(props) => !props.isVisible && 'italic'};

  ${(props) => props.hasChildNodes && itemTitleArrow};
  ${(props) =>
    props.lastItemClickable &&
    css`
      cursor: pointer;
    `};
  ${(props) => !props.hasChildNodes && !props.isRootNode && itemTitleLinked};

  &:before {
    transition: transform 200ms ease;
    transform: rotate(${(props) => props.hasChildNodes && props.arrowDirection}deg);
  }
`;

interface StyledItemBarProps {
  highlight?: boolean;
}

export const StyledItemBar = styled.div<StyledItemBarProps>`
  display: flex;
  align-items: center;
  min-height: 40px;
  border-bottom: 1px solid ${colors.brand.greyLighter};
  background: ${(props) => props.highlight && colors.brand.lighter};

  &:hover {
    background: ${(props) => (props.highlight ? colors.brand.light : '#f1f5f8')};
  }
`;

interface StyledStructureItemProps {
  greyedOut?: boolean;
  connectionId?: string;
}

export const StyledStructureItem = styled.div<StyledStructureItemProps>`
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${spacing.normal};
  ${(props) =>
    props.greyedOut &&
    css`
      > div > button {
        color: rgb(32, 88, 143, 0.5);
      }
    `};
`;

export const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

export const StyledIcon = styled.button`
  display: flex;
  align-items: center;

  border: 0;
  background: transparent;

  svg:hover {
    fill: ${colors.favoriteColor};
    cursor: pointer;
  }
`;
