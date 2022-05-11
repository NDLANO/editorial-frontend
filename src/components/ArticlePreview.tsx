/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticleSummaryV2 } from '@ndla/types-article-api';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

const Container = styled.div`
  padding: ${spacing.small};
  border: 1px solid #ddd;
  background-color: white;
  width: 100%;
  height: 150px;
  display: flex;
`;

const ImageWrapper = styled.div`
  text-align: center;
  margin-right: ${spacing.small};
  flex: 1 1 auto;
  max-width: 180px;
  & img {
    max-height: 100%;
  }
  & svg {
    margin: ${spacing.medium};
    width: 60px;
    height: 60px;
  }
`;

const Content = styled.div`
  flex: 2 4 auto;
  overflow: hidden;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.8;
  color: #444;
`;

const Description = styled.p`
  font-size: 0.8rem;
  margin: 0;
`;

interface Props {
  article: Pick<IArticleSummaryV2, 'title' | 'metaDescription'> & {
    metaUrl?: string;
  };
  imageWidth?: number;
}

const ArticlePreview = ({ article, imageWidth = 200 }: Props) => {
  const imageUrl = article.metaUrl ? `${article.metaUrl}?width=${imageWidth}` : undefined;
  return (
    <Container data-testid="articlePreview">
      <ImageWrapper>
        <img src={imageUrl ?? '/placeholder.png'} alt="" />
      </ImageWrapper>
      <Content>
        <Title>{article.title.title}</Title>
        <Description>{article.metaDescription?.metaDescription}</Description>
      </Content>
    </Container>
  );
};

export default ArticlePreview;
