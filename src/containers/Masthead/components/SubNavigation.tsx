import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { UseQueryResult } from 'react-query';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { SearchType } from '../../../interfaces';
import { SearchParams } from '../../SearchPage/components/form/SearchForm';
import { ResultType } from '../../SearchPage/SearchContainer';

interface SubType {
  title: string;
  type: SearchType;
  url: string;
  icon: ReactElement;
  path: string;
  searchHook: (query: SearchParams) => UseQueryResult<ResultType>;
}

const Container = styled.div`
  height: 10rem;
  position: relative;
  left: 0;
  width: 100%;
  z-index: 1;
  background-color: white;
`;

const ItemsWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  text-align: center;
  height: 10rem;
  flex-flow: row;
  max-width: 1024px;
  width: 100%;
  padding-left: ${spacing.normal};
  padding-right: ${spacing.normal};
`;

interface StyledSpanProps {
  isActive: boolean;
}

const StyledSpan = styled.span<StyledSpanProps>`
  padding: 0.3rem 1.2rem;
  border: 2px solid ${colors.brand.primary};
  text-transform: uppercase;
  margin-top: 1rem;
  color: ${p => (p.isActive ? colors.white : colors.brand.primary)};
  background-color: ${p => (p.isActive ? colors.brand.primary : colors.white)};
`;

const StyledNavLink = styled(NavLink)`
  align-self: center;
  display: block;
  text-align: center;
  color: ${colors.brand.primary};
  margin-right: 2rem;
  box-shadow: none;
  width: 8.5rem;
  font-size: 14px;
  &:hover,
  &:focus {
    box-shadow: none;
    & > span {
      background-color: ${colors.brand.primary};
      color: white;
    }
  }
  & > * {
    margin: 0 auto;
    display: block;
  }
`;

interface Props {
  subtypes: SubType[];
}

const SubNavigation = ({ subtypes }: Props) => (
  <Container>
    <ItemsWrapper>
      {subtypes.map(subtype => (
        <StyledNavLink key={`typemenu_${subtype.type}`} id={subtype.type} to={subtype.url}>
          {({ isActive }) => (
            <>
              {subtype.icon}
              <StyledSpan isActive={isActive}>{subtype.title}</StyledSpan>
            </>
          )}
        </StyledNavLink>
      ))}
    </ItemsWrapper>
  </Container>
);

export default SubNavigation;
