import styled from '@emotion/styled';
import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldWithTitle = ({ title, children }: Props) => {
  return (
    <StyledDiv>
      <strong>{title}</strong>
      {children}
    </StyledDiv>
  );
};

export default FieldWithTitle;
