import styled, { css } from 'react-emotion';
import { colors, spacing, fonts, misc } from '@ndla/core';

/* CSS */
const buttonAddition = css`
  opacity: 0;
  height: auto;
  padding: 0 ${spacing.small};
  margin: 3px ${spacing.xsmall};
  transition: background 200ms ease;
  ${fonts.sizes(14, 1.1)};
`;

const checkboxItemCSS = css`
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

const checkboxItemSelectedCSS = css`
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

const checkboxItemHoverCSS = css`
  &:before {
    width: 5px;
    transition: width 100ms ease;
  }
  &:after {
    width: 10px;
    transition: width 150ms ease 100ms;
  }
`;

const flexCenterAlign = css`
  display: flex;
  align-items: center;
`;

const listClass = css`
  > div {
    > .filestructure {
      display: flex;
      margin-left: auto;
    }
  }

  > div:hover {
    > .filestructure {
      > button {
        opacity: 1;
      }
    }
  }
`;

/* Styled components */

const StyledFilterHeading = styled('span')`
  ${fonts.sizes(16, 1.2)} font-weight: ${fonts.weight.semibold};
  text-transform: uppercase;
  color: ${colors.text.primary};
  opacity: ${props => (props.show ? 1 : 0)};
  display: flex;
  align-items: center;
  padding-right: ${spacing.small};
  white-space: no-wrap;
`;

const BreadCrumb = styled('div')`
  flex-grow: 1;
  span:last-of-type {
    font-weight: ${fonts.weight.semibold};
  }
`;

const Checked = styled('div')`
  ${fonts.sizes(16, 1.1)} font-weight: ${fonts.weight.semibold};
  display: flex;
  align-items: center;
  span {
    margin: 0 ${spacing.xsmall};
  }
  svg {
    fill: ${colors.support.green};
  }
`;

const StyledFilterButton = styled('button')`
  border: 0;
  margin: 0 0 0 ${spacing.xsmall};
  background: none;
  transition: opacity 100ms ease;
  ${flexCenterAlign};
  justify-content: center;
  text-align: left;
  padding: ${spacing.xsmall};
  color: ${colors.brand.primary};
  ${fonts.sizes(14, 1.2)} white-space: no-wrap;
  &:disabled {
    color: ${colors.brand.light};
  }
  > span:first-child {
    ${checkboxItemCSS};
  }
  &:not(:disabled) {
    &:hover,
    &:focus {
      > span:first-child {
        ${checkboxItemHoverCSS};
      }
    }
  }
  &.checkboxItem--checked {
    > span:first-child {
      ${checkboxItemSelectedCSS};
    }
  }
`;

const Connections = styled('div')`
  ${flexCenterAlign};
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
`;

const ConnectionsWrapper = styled('div')`
  padding-bottom: ${spacing.small};
`;

const ErrorLabel = styled('div')`
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
  ${flexCenterAlign};
  ${fonts.sizes(14, 1.1)};
  svg {
    margin-right: ${spacing.xsmall};
  }
`;

const StyledFilterCheckBox = styled('button')`
  border: 0;
  background: none;
  ${flexCenterAlign};
  justify-content: center;
  text-align: left;
  padding: ${spacing.xsmall};
  color: ${colors.text.primary};
  ${fonts.sizes(16, 1.1)} font-weight: ${fonts.weight.semibold};
  > span:first-child {
    ${checkboxItemCSS};
    margin-right: ${spacing.small};
  }
  &:hover,
  &:focus {
    > span:first-child {
      ${checkboxItemHoverCSS};
    }
  }
  &.checkboxItem--checked {
    > span:first-child {
      ${checkboxItemSelectedCSS};
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

const FilterTable = styled('table')`
  width: 100%;
  td:first-child {
    width: 100%;
  }
`;

const PrimaryConnectionButton = styled('button')`
  background: ${colors.support.green};
  border: 0;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall} ${spacing.small};
  margin-right: ${spacing.xsmall};
  text-transform: uppercase;
  opacity: 0.3;
  transition: opacity 100ms ease;
  &:hover,
  &:focus {
    opacity: 1;
  }
  ${fonts.sizes(14, 1.1)} font-weight: ${fonts.weight.semibold};
  ${props =>
    props.primary &&
    css`
      opacity: 1;
    `};
`;

const RemoveConnectionButton = styled('button')`
  border: 0;
  border-radius: 100%;
  padding: 0;
  background: none;
  width: ${spacing.normal};
  height: ${spacing.normal};
  transition: background 100ms ease;
  ${flexCenterAlign};
  justify-content: center;
  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const SubjectName = styled('div')`
  padding: ${props => (props.firstSubject ? spacing.small : spacing.medium)} 0
    ${spacing.xsmall};
`;

const TitleModal = styled('h1')`
  color: ${colors.text.primary};
`;

export {
  buttonAddition,
  flexCenterAlign,
  StyledFilterHeading,
  BreadCrumb,
  Checked,
  StyledFilterButton,
  listClass,
  Connections,
  ConnectionsWrapper,
  ErrorLabel,
  StyledRelevanceButton,
  StyledFilterCheckBox,
  StyledFilterListTableRow,
  FilterTable,
  PrimaryConnectionButton,
  RemoveConnectionButton,
  SubjectName,
  TitleModal,
};
