import { spacing, colors } from '@ndla/core';
import styled from '@emotion/styled';

export const StyledSearchResult = styled.div`
  display: flex;
`;

export const StyledSearchImageContainer = styled.div`
  display: inline-block;
  width: 10%;
  align-self: center;
  max-width: 10%;
  text-align: center;
  & img {
    max-height: 9.2rem;
  }
  & svg {
    margin: 1.3rem;
    width: 60px;
    height: 60px;
  }
`;

export const StyledSearchContent = styled.div`
  display: inline-block;
  width: 90%;
  align-self: center;
  padding-left: 1.3rem;
`;

export const StyledSearchTitle = styled.h1`
  font-size: 1.2rem;
  margin: 1.3rem 0 0.3rem;
  font-weight: 600;

  & svg {
    margin-right: 0.2rem;
  }
`;

export const StyledOtherLink = styled.span`
  &:not(:last-child) {
    &::after {
      content: ' / ';
    }
  }
`;

export const StyledSearchDescription = styled.p`
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0 0 1.2rem;
`;

export const StyledSearchBreadcrumbs = styled.div`
  display: flex;
  margin-top: 30px;
`;

export const StyledSearchBreadcrumb = styled.p`
  margin-right: ${spacing.small};
  font-size: 0.7rem;
  color: black;
  text-decoration: underline;
`;

export const NoShadowAnchor = styled.a`
  box-shadow: none;
  &:any-link {
    color: ${colors.brand.primary};
  }
`;

export const StyledSearchOtherLink = styled.span`
  &:not(:last-child) {
    &::after {
      content: ' / ';
    }
  }
`;
