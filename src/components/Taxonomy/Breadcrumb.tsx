import { Fragment } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, fonts } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { ChevronRight } from '@ndla/icons/common';
import { TaxonomyElement } from '../../modules/taxonomy/taxonomyApiInterfaces';
interface Props {
  breadcrumb: Array<TaxonomyElement>;
  type?: string;
}

interface StyleProps {
  isVisible?: boolean;
}

const StyledBreadCrumb = styled('div')`
  flex-grow: 1;
  span:last-of-type {
    font-weight: ${fonts.weight.semibold};
  }
`;

const StyledLink = styled(SafeLink)<StyleProps>`
  font-style: ${props => !props.isVisible && 'italic'};
  color: ${props => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
`;

export default function Breadcrumb({ breadcrumb, type }: Props) {
  let url = '/structure';
  return (
    <StyledBreadCrumb>
      {breadcrumb.map((path, index) => {
        url = `${url}/${path.id}`;
        return (
          <Fragment key={`${path.name}_${index}`}>
            <span
              css={css`
                white-space: 'nowrap';
              `}>
              <StyledLink isVisible={path.metadata ? path.metadata.visible : true} to={url}>
                {path.name}
              </StyledLink>
            </span>
            {type !== 'topic-article' && index + 1 !== breadcrumb.length && <ChevronRight />}
          </Fragment>
        );
      })}
    </StyledBreadCrumb>
  );
}
