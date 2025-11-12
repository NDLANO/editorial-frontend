/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { transform } from "@ndla/article-converter";
import { Badge } from "@ndla/primitives";
import { LearningPathV2DTO, LearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { ArticleByline, ArticleContent, ArticleFooter, ArticleTitle, ArticleWrapper } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";

interface TextStepProps {
  learningpath: LearningPathV2DTO;
  step: LearningStepV2DTO;
}

export const TextStep = ({ step, learningpath }: TextStepProps) => {
  const { t } = useTranslation();
  const id = useId();

  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={id}
          title={step.title.title}
          badges={<Badge>{t("contentTypes.external")}</Badge>}
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
