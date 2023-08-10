import { Fragment, useMemo } from 'react';
import styled from '@emotion/styled';
import { colors, fonts } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { ChevronRight } from '@ndla/icons/common';
import { Node } from '@ndla/types-taxonomy';
import { MinimalNodeChild } from '../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy';

interface Props {
  error?: boolean;
  type?: string;
  node: Node | MinimalNodeChild;
}

const StyledBreadCrumb = styled.div`
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

const Breadcrumb = ({ node, type, error }: Props) => {
  let url = '/structure';

  const crumbs = useMemo(() => {
    const paths = node.path
      .split('/')
      .filter((id) => id && !id.includes('resource:'))
      .map((id) => `urn:${id}`);
    return paths.map((path, index) => ({ id: path, name: node.breadcrumbs[index] }));
  }, [node.breadcrumbs, node.path]);

  return (
    <StyledBreadCrumb>
      {crumbs.map((crumb, index) => {
        url = `${url}/${crumb.id}`;
        return (
          <Fragment key={`${crumb.id}_${index}`}>
            <StyledSpan>
              <StyledLink data-visible={error ? true : node.metadata.visible} to={url}>
                {crumb.name}
              </StyledLink>
            </StyledSpan>
            {type !== 'topic-article' && index + 1 !== crumbs.length && <ChevronRight />}
          </Fragment>
        );
      })}
    </StyledBreadCrumb>
  );
};

export default Breadcrumb;
