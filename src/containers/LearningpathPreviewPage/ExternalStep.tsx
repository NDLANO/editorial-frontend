/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@ndla/primitives";
import { ILearningPathV2DTO, ILearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { ArticleByline, ArticleContent, ArticleFooter, ArticleTitle, ArticleWrapper, ResourceBox } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";
import { useFetchOpenGraph } from "../../modules/opengraph/opengraphQueries";

interface Props {
  learningpath: ILearningPathV2DTO;
  step: ILearningStepV2DTO;
}

export const ExternalStep = ({ step, learningpath }: Props) => {
  const { t } = useTranslation();
  const id = useId();
  const openGraphQuery = useFetchOpenGraph(step.embedUrl?.url ?? "", {
    enabled: !!step.embedUrl?.url,
  });

  if (openGraphQuery.isPending) {
    return <Spinner />;
  }

  return (
    <EmbedPageContent variant="content" css={{ paddingBlock: "medium" }}>
      <ArticleWrapper>
        <ArticleTitle
          title={step.title.title}
          introduction={step.introduction?.introduction}
          id={id}
          contentType="external"
        />
        <ArticleContent>
          <section>
            <ResourceBox
              title={openGraphQuery.data?.title ?? ""}
              caption={openGraphQuery.data?.description ?? ""}
              url={openGraphQuery.data?.url ?? step.embedUrl?.url ?? ""}
              buttonText={t("learningpathForm.preview.openExternalLink")}
            />
          </section>
        </ArticleContent>
        <ArticleFooter>
          <ArticleByline authors={learningpath.copyright.contributors} bylineType="external" />
        </ArticleFooter>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
