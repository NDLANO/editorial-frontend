import { Fragment } from 'react';
import styled from '@emotion/styled';
import { colors, fonts } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { ChevronRight } from '@ndla/icons/common';
import { MinimalNodeChild } from '../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy';

interface Props {
  error?: boolean;
  type?: string;
  breadcrumb: MinimalNodeChild[];
}

const StyledBreadCrumb = styled('div')`
  flex-grow: 1;
  span:last-of-type {
    font-weight: ${fonts.weight.semibold};
  }
`;

const StyledLink = styled(SafeLink)`
  &[data-visible='false'] {
    font-style: italic;
    color: ${colors.brand.grey};
  }
  &[data-visible='true'] {
    color: ${colors.brand.primary};
  }
`;

const StyledSpan = styled.span`
  white-space: 'nowrap';
`;

export default function Breadcrumb({ breadcrumb, type, error }: Props) {
  let url = '/structure';
  return (
    <StyledBreadCrumb>
      {breadcrumb.map((path, index) => {
        url = `${url}/${path.id}`;
        return (
          <Fragment key={`${path.id}_${index}`}>
            <StyledSpan>
              <StyledLink
                data-visible={error ? true : path.metadata ? path.metadata.visible : true}
                to={url}
              >
                {path.name}
              </StyledLink>
            </StyledSpan>
            {type !== 'topic-article' && index + 1 !== breadcrumb.length && <ChevronRight />}
          </Fragment>
        );
      })}
    </StyledBreadCrumb>
  );
}
