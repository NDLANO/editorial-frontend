/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { transform } from "@ndla/article-converter";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { ArticleByline, ArticleContent, ArticleFooter, ArticleTitle, ArticleWrapper } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";
import { BaseStepProps } from "./types";

interface TextStepProps extends BaseStepProps {
  learningpath: ILearningPathV2DTO;
}

export const TextStep = ({ learningpathStep, learningpath }: TextStepProps) => {
  const id = useId();

  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={id}
          title={learningpathStep.title.title}
          contentType="external"
          introduction={learningpathStep.introduction?.introduction}
        />
        <ArticleContent>
          {learningpathStep.description ? (
            <section>{transform(learningpathStep.description.description, {})}</section>
          ) : null}
        </ArticleContent>
        <ArticleFooter>
          <ArticleByline authors={learningpath.copyright.contributors} />
        </ArticleFooter>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
