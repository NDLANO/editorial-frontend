import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { fonts } from '@ndla/core';
import { ChevronRight } from '@ndla/icons/common';
interface Props {
  breadcrumb: Array<{
    name: string;
  }>;
  type?: string;
}

const StyledBreadCrumb = styled('div')`
  flex-grow: 1;
  span:last-of-type {
    font-weight: ${fonts.weight.semibold};
  }
`;

export default function Breadcrumb({ breadcrumb, type }: Props) {
  return (
    <StyledBreadCrumb>
      {breadcrumb.map((path, index) => (
        <Fragment key={`${path.name}_${index}`}>
          <span css={{ 'white-space': 'nowrap' }}>{path.name}</span>
          {(type !== 'topic-article' || index + 1 !== breadcrumb.length) && (
            <ChevronRight />
          )}
        </Fragment>
      ))}
    </StyledBreadCrumb>
  );
}
