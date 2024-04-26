/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { UseQueryResult } from "@tanstack/react-query";
import { spacing, colors, stackOrder } from "@ndla/core";
import { MAX_PAGE_WIDTH } from "../../../constants";
import { SearchType } from "../../../interfaces";
import { SearchParamsBody } from "../../SearchPage/components/form/SearchForm";
import { ResultType } from "../../SearchPage/SearchContainer";

interface SubType {
  title: string;
  type: SearchType;
  url: string;
  icon: ReactElement;
  path: string;
  searchHook: (query: SearchParamsBody) => UseQueryResult<ResultType>;
}

const Container = styled.div`
  height: 10rem;
  position: relative;
  left: 0;
  width: 100%;
  z-index: ${stackOrder.offsetSingle};
`;

const ItemsWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  text-align: center;
  justify-content: space-between;
  height: 10rem;
  gap: 2rem;
  flex-flow: row;
  max-width: ${MAX_PAGE_WIDTH}px;
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
  color: ${(p) => (p.isActive ? colors.white : colors.brand.primary)};
  background-color: ${(p) => (p.isActive ? colors.brand.primary : colors.white)};
`;

const StyledNavLink = styled(NavLink)`
  align-self: center;
  display: block;
  text-align: center;
  color: ${colors.brand.primary};
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
  svg {
    width: 3rem;
    height: 3rem;
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
      {subtypes.map((subtype) => (
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
