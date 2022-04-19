import styled from '@emotion/styled';
import { ReactNode } from 'react';
import DiffSeparator from './DiffSeparator';
import { DiffResultType } from './diffUtils';

interface Props {
  children?: ReactNode;
  left?: boolean;
  type: DiffResultType;
}

const diffTypePositionColorMap: Record<DiffResultType, { left: string; right: string }> = {
  ADDED: {
    left: 'transparent',
    right: 'green',
  },
  MODIFIED: {
    left: 'transparent',
    right: 'yellow',
  },
  DELETED: {
    left: 'red',
    right: 'transparent',
  },
  NONE: {
    left: 'transparent',
    right: 'transparent',
  },
};

interface StyledDiffInnerFieldProps {
  position: 'left' | 'right';
  type: DiffResultType;
}

const StyledDiffInnerField = styled.div<StyledDiffInnerFieldProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => diffTypePositionColorMap[props.type][props.position]};
`;
export const DiffInnerField = ({ children, type, left }: Props) => {
  return (
    <StyledDiffInnerField type={type} position={left ? 'left' : 'right'}>
      <DiffSeparator type={type} />
      {children}
    </StyledDiffInnerField>
  );
};

export const DiffField = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr;
`;
