import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, spacing, fonts, misc } from '@ndla/core';

/* CSS */

const checkboxItemStyle = css`
  border: 2px solid ${colors.brand.tertiary};
  background: transparent;
  width: 18px;
  height: 18px;
  margin: 4px ${spacing.xsmall} 4px 0;
  border-radius: 2px;
  position: relative;

  &:before {
    content: '';
    width: 0px;
    height: 2px;
    border-radius: 2px;
    position: absolute;
    background: ${colors.brand.tertiary};
    transform: rotate(45deg);
    transition: width 50ms ease;
    transform-origin: 0% 0%;
    top: 7px;
    left: 4px;
  }

  &:after {
    content: '';
    width: 0px;
    height: 2px;
    border-radius: 2px;
    position: absolute;
    background: ${colors.brand.tertiary};
    transform: rotate(305deg);
    transition: width 50ms ease;
    transform-origin: 0% 0%;
    top: 10px;
    left: 5px;
  }
`;

const checkboxItemSelectedStyle = css`
  background: ${colors.brand.primary};
  border: 2px solid ${colors.brand.primary};
  &:before {
    width: 5px;
    transition: width 100ms ease;
    background: #fff;
  }
  &:after {
    width: 10px;
    transition: width 150ms ease 100ms;
    background: #fff;
  }
`;

const checkboxItemHoverStyle = css`
  &:before {
    width: 5px;
    transition: width 100ms ease;
  }
  &:after {
    width: 10px;
    transition: width 150ms ease 100ms;
  }
`;

const flexButtonCenterAlignStyle = css`
  display: flex;
  align-items: center;
`;

/* Styled components */

const StyledConnections = styled('div')`
  ${flexButtonCenterAlignStyle}
  justify-content: space-between;
  background: ${props =>
    props.error ? `${colors.support.red}11` : colors.brand.greyLightest};
  padding: ${spacing.xsmall};
  margin-bottom: 2px;
  border-radius: ${misc.borderRadius};
  span {
    padding: ${spacing.xsmall};
    ${fonts.sizes(16, 1.1)} &:nth-child(2) {
      font-weight: ${fonts.weight.semibold};
    }
  }
  ${props =>
    props.shared &&
    css`
      background: none;
      border: 2px dashed ${colors.brand.tertiary};
      flex-direction: row-reverse;
      margin-left: ${spacing.normal};
      > div:last-child:before {
        content: '';
        position: absolute;
        transform: translate(-${spacing.normal}, 4px);
        border-bottom-left-radius: ${misc.borderRadius};
        display: inline-block;
        border: 2px solid ${colors.brand.tertiary};
        height: 10px;
        width: 10px;
        border-right: none;
        border-top: none;
      }
    `};
`;

const StyledConnectionsWrapper = styled('div')`
  padding-bottom: ${spacing.small};
`;

const StyledErrorLabel = styled('div')`
  background: ${colors.support.red};
  border: 0;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall} ${spacing.small};
  margin-right: ${spacing.xsmall};
  text-transform: uppercase;
  color: #fff;
  ${fonts.sizes(14, 1.1)} font-weight: ${fonts.weight.semibold};
  ${props =>
    props.primary &&
    css`
      opacity: 1;
    `};
`;

const StyledRelevanceButton = styled('button')`
  border: 0;
  background: none;
  transition: opacity 200ms ease;
  opacity: ${props => (props.selected ? 1 : 0.3)};
  &:hover,
  &:focus {
    opacity: 1;
  }
  ${flexButtonCenterAlignStyle};
  ${fonts.sizes(14, 1.1)};
  svg {
    margin-right: ${spacing.xsmall};
  }
`;

const StyledFilterCheckBox = styled('button')`
  border: 0;
  background: none;
  ${flexButtonCenterAlignStyle};
  justify-content: center;
  text-align: left;
  padding: ${spacing.xsmall};
  color: ${colors.text.primary};
  ${fonts.sizes(16, 1.1)} font-weight: ${fonts.weight.semibold};
  > span:first-of-type {
    ${checkboxItemStyle};
    margin-right: ${spacing.small};
  }
  &:hover,
  &:focus {
    > span:first-of-type {
      ${checkboxItemHoverStyle};
    }
  }
  &.checkboxItem--checked {
    > span:first-of-type {
      ${checkboxItemSelectedStyle};
    }
  }
`;

const StyledFilterListTableRow = styled('tr')`
  border-bottom: 1px solid ${colors.brand.lighter};
  td:last-child {
    transition: opacity 200ms ease;
    &:hover {
      opacity: 1;
    }
  }
  ${props =>
    !props.active &&
    css`
      td:last-child {
        opacity: 0;
      }
      &:hover,
      &:focus-within {
        td:last-child {
          opacity: 1;
        }
      }
    `};
`;

const StyledFilterTable = styled('table')`
  width: 100%;
  td:first-child {
    width: 100%;
  }
`;

const connectionButtonStyle = css`
  border: 0;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall} ${spacing.small};
  margin-right: ${spacing.xsmall};
  text-transform: uppercase;
  ${fonts.sizes(14, 1.1)} font-weight: ${fonts.weight.semibold};
`;

const StyledPrimaryConnectionButton = styled('button')`
  ${connectionButtonStyle}
  background: ${colors.support.green};
  opacity: 0.3;
  transition: opacity 100ms ease;
  &:hover,
  &:focus {
    opacity: 1;
  }
  ${props =>
    props.primary &&
    css`
      opacity: 1;
    `};
`;

const StyledDuplicateConnectionLabel = styled('div')`
  ${connectionButtonStyle}
  background: ${colors.brand.light};
`;

const StyledRemoveConnectionButton = styled('button')`
  border: 0;
  border-radius: 100%;
  padding: 0;
  background: none;
  width: ${spacing.normal};
  height: ${spacing.normal};
  transition: background 100ms ease;
  ${flexButtonCenterAlignStyle};
  justify-content: center;
  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const StyledFilterButton = styled('button')`
  border: 0;
  margin: 0 0 0 ${spacing.xsmall};
  background: none;
  transition: opacity 100ms ease;
  ${flexButtonCenterAlignStyle};
  justify-content: center;
  text-align: left;
  padding: ${spacing.xsmall};
  color: ${colors.brand.primary};
  ${fonts.sizes(14, 1.2)} white-space: no-wrap;
  &:disabled {
    color: ${colors.brand.light};
  }
  > span:first-child {
    ${checkboxItemStyle};
  }
  &:not(:disabled) {
    &:hover,
    &:focus {
      > span:first-child {
        ${checkboxItemHoverStyle};
      }
    }
  }
  &.checkboxItem--checked {
    > span:first-child {
      ${checkboxItemSelectedStyle};
    }
  }
`;

const StyledSubjectName = styled('div')`
  padding: ${props => (props.firstSubject ? spacing.small : spacing.medium)} 0
    ${spacing.xsmall};
`;

export {
  flexButtonCenterAlignStyle,
  StyledConnections,
  StyledConnectionsWrapper,
  StyledErrorLabel,
  StyledFilterButton,
  StyledRelevanceButton,
  StyledFilterCheckBox,
  StyledFilterListTableRow,
  StyledFilterTable,
  StyledPrimaryConnectionButton,
  StyledRemoveConnectionButton,
  StyledDuplicateConnectionLabel,
  StyledSubjectName,
};
