/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing, colors } from '@ndla/core';

interface Props {
  on: boolean;
  onClick: () => void;
  testId?: string;
  large?: boolean;
  labelOff?: string;
  labelOn?: string;
}

const ToggleSwitch = ({ on, onClick, testId, large, labelOff = 'T', labelOn = 'K' }: Props) => (
  <>
    <StyledLabel data-testid={testId} large={large} labelOn={labelOn}>
      <input checked={on} onChange={onClick} type="checkbox" />
      <StyledSlider large={large} labelOff={labelOff} />
    </StyledLabel>
  </>
);

interface SliderProps {
  large?: boolean;
  labelOff: string;
}

const StyledSlider = styled.span`
   position: absolute;
   cursor: pointer;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   height: 22px;
   background-color: white;
   border: 0.63px solid #a9a9a9;
   transition: 0.4s;
   border-radius: 10px;
 
   ${(props: SliderProps) =>
     props.large &&
     css`
       height: 26px;
       border-radius: 13px;

       &::before {
         height: 26px;
         width: 26px;
       }
     `}
 
   &::before {
     position: absolute;
     content: '${(props: SliderProps) => props.labelOff}';
     left: -3px;
     top: -0.63px;
     display: flex;
     justify-content: center;
     align-items: center;
     height: 22px;
     width: 22px;
     background-color: ${colors.brand.grey};
     color: black;
     transition: 0.4s;
     border-radius: 50%;
     font-size: 0.8rem;
   }
 `;

interface LabelProps {
  large?: boolean;
  labelOn: string;
}

const StyledLabel = styled.label`
   position: relative;
   display: inline-block;
   width: 37px;
   height: 22px;
 
   ${(props: LabelProps) =>
     props.large &&
     css`
       margin: 0 ${spacing.normal};
       height: 26px;
       width: 40px;
     `}
 
   & input {
     display: none;
   }
 
   & > input:checked + ${StyledSlider}::before {
     transform: translateX(20px);
     background-color: #507aa4;
     color: white;
     content: '${(props: LabelProps) => props.labelOn}';
     border: 0.91px solid #446b92;
   }
 `;

export default ToggleSwitch;
