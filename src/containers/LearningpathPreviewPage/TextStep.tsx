/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { transform } from "@ndla/article-converter";
import { LearningPathV2DTO, LearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { ArticleByline, ArticleContent, ArticleFooter, ArticleTitle, ArticleWrapper } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";

interface TextStepProps {
  learningpath: LearningPathV2DTO;
  step: LearningStepV2DTO;
}

export const TextStep = ({ step, learningpath }: TextStepProps) => {
  const id = useId();

  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={id}
          title={step.title.title}
          contentType="external"
          introduction={step.introduction?.introduction}
        />
        <ArticleContent>
          {step.description ? <section>{transform(step.description.description, {})}</section> : null}
        </ArticleContent>
        <ArticleFooter>
          <ArticleByline authors={learningpath.copyright.contributors} />
        </ArticleFooter>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
