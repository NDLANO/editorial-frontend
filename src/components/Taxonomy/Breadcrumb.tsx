import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { fonts } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { ChevronRight } from '@ndla/icons/common';
interface Props {
  breadcrumb: Array<{
    id: string;
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
  let url = '/structure';
  return (
    <StyledBreadCrumb>
      {breadcrumb.map((path, index) => {
        url = `${url}/${path.id}`;
        return (
          <Fragment key={`${path.name}_${index}`}>
            <span css={{ 'white-space': 'nowrap' }}>
              <SafeLink to={url}>{path.name}</SafeLink>
            </span>
            {(type !== 'topic-article' || index + 1 !== breadcrumb.length) && (
              <ChevronRight />
            )}
          </Fragment>
        );
      })}
    </StyledBreadCrumb>
  );
}
