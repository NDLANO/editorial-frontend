import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, spacing, fonts, misc } from '@ndla/core';

/* CSS */

const flexButtonCenterAlignStyle = css`
  display: flex;
  align-items: center;
`;

/* Styled components */

const StyledConnections = styled('div')`
  ${flexButtonCenterAlignStyle}
  justify-content: space-between;
  background: ${props => (props.error ? `${colors.support.red}11` : colors.brand.greyLightest)};
  padding: ${spacing.xsmall};
  margin-bottom: 2px;
  border-radius: ${misc.borderRadius};
  span {
    padding: ${spacing.xsmall};
    ${fonts.sizes(16, 1.1)} &:nth-of-type(2) {
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
  margin-left: ${spacing.xsmall};
  transition: background 100ms ease;
  ${flexButtonCenterAlignStyle};
  justify-content: center;
  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const StyledSubjectName = styled('div')`
  padding: ${props => (props.firstSubject ? spacing.small : spacing.medium)} 0 ${spacing.xsmall};
`;

export {
  flexButtonCenterAlignStyle,
  StyledConnections,
  StyledConnectionsWrapper,
  StyledErrorLabel,
  StyledRelevanceButton,
  StyledPrimaryConnectionButton,
  StyledRemoveConnectionButton,
  StyledDuplicateConnectionLabel,
  StyledSubjectName,
};
