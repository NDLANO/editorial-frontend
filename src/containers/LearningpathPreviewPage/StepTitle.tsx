/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { transform } from "@ndla/article-converter";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { Heading } from "@ndla/primitives";
import { LearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { ArticleWrapper, ArticleContent, ArticleHeader, LicenseLink } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";

interface Props {
  step: LearningStepV2DTO;
}

export const StepTitle = ({ step }: Props) => {
  const { i18n } = useTranslation();
  return step.showTitle || step.description ? (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        {!!step.showTitle && (
          <ArticleHeader>
            <Heading>{step.title.title}</Heading>
            <LicenseLink license={getLicenseByAbbreviation(step.license?.license ?? "", i18n.language)} />
          </ArticleHeader>
        )}
        <ArticleContent>
          {!!step.description && <section>{transform(step.description.description, {})}</section>}
        </ArticleContent>
      </ArticleWrapper>
    </EmbedPageContent>
  ) : null;
};
