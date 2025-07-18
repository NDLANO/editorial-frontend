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
import { styled } from "@ndla/styled-system/jsx";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { ArticleByline, ArticleContent, ArticleFooter, ArticleTitle, ArticleWrapper, ResourceBox } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";
import { BaseStepProps } from "./types";
import { useFetchOpenGraph } from "../../../modules/opengraph/opengraphQueries";

const StyledArticleFooter = styled(ArticleFooter, {
  base: {
    "& > :is(:last-child)": {
      paddingBlockEnd: "xxlarge",
    },
  },
});

interface Props extends BaseStepProps {
  learningpath: ILearningPathV2DTO;
}

export const ExternalStep = ({ learningpathStep, learningpath }: Props) => {
  const { t } = useTranslation();
  const id = useId();
  const openGraphQuery = useFetchOpenGraph(learningpathStep.embedUrl?.url ?? "", {
    enabled: !!learningpathStep.embedUrl?.url,
  });

  if (openGraphQuery.isPending) {
    return <Spinner />;
  }

  return (
    <EmbedPageContent variant="content" css={{ paddingBlock: "medium" }}>
      <ArticleWrapper>
        <ArticleTitle
          title={learningpathStep.title.title}
          introduction={learningpathStep.introduction?.introduction}
          id={id}
          contentType="external"
        />
        <ArticleContent>
          <section>
            <ResourceBox
              title={openGraphQuery.data?.title ?? ""}
              caption={openGraphQuery.data?.description ?? ""}
              url={openGraphQuery.data?.url ?? learningpathStep.embedUrl?.url ?? ""}
              buttonText={t("learningpathForm.preview.openExternalLink")}
            />
          </section>
        </ArticleContent>
        <StyledArticleFooter>
          <ArticleByline authors={learningpath.copyright.contributors} bylineType="external" />
        </StyledArticleFooter>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
