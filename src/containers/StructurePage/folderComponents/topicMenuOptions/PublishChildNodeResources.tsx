/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import partition from "lodash/partition";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorWarningLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import { Button, Heading, MessageBox, Spinner, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticle } from "@ndla/types-backend/draft-api";
import { ILearningPathV2 } from "@ndla/types-backend/learningpath-api";
import { Node } from "@ndla/types-taxonomy";
import { PUBLISHED } from "../../../../constants";
import { fetchDrafts, updateStatusDraft } from "../../../../modules/draft/draftApi";
import { fetchLearningpaths, updateStatusLearningpath } from "../../../../modules/learningpath/learningpathApi";
import { fetchNodeResources } from "../../../../modules/nodes/nodeApi";
import { RESOURCE_META } from "../../../../queryKeys";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import ResourceItemLink from "../../resourceComponents/ResourceItemLink";

interface Props {
  node: Node;
}

const StatusIndicatorContent = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const StyledErrorTextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

const StyledCheckLine = styled(CheckLine, {
  base: { fill: "stroke.success" },
});

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-end",
  },
});

interface BaseResource {
  name: string;
  contentUri?: string | undefined;
}

const PublishChildNodeResources = ({ node }: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [showDisplay, setShowDisplay] = useState(false);
  const [failedResources, setFailedResources] = useState<BaseResource[]>([]);
  const [publishedCount, setPublishedCount] = useState(0);
  const [publishableCount, setPublishableCount] = useState(0);
  const [done, setDone] = useState(false);
  const qc = useQueryClient();

  const publishResources = async () => {
    setFailedResources([]);
    setDone(false);
    setPublishableCount(0);
    setPublishedCount(0);
    const nodeResources = await fetchNodeResources({
      id: node.id,
      language,
      taxonomyVersion,
    });
    const allResources = [{ name: node.name, contentUri: node.contentUri }, ...nodeResources];
    const withContentUri = allResources.filter((res) => !!res.contentUri);
    setPublishableCount(allResources.length);
    setShowDisplay(true);
    const [draftResources, learningpathResources] = partition(withContentUri, (res) => {
      const [, resourceType] = res.contentUri!.split(":");
      return resourceType === "article";
    });
    const draftIds = draftResources.map((res) => Number(res.contentUri!.split(":")[2]));
    const learningpathIds = learningpathResources.map((res) => Number(res.contentUri!.split(":")[2]));
    const [drafts, learningpaths]: [IArticle[], ILearningPathV2[]] = await Promise.all([
      fetchDrafts(draftIds),
      fetchLearningpaths(learningpathIds),
    ]);
    const [unpublishedDrafts, publishedDrafts] = partition(drafts, (draft) => draft.status.current !== PUBLISHED);
    const [unpublishedLearningpaths, publishedLearningpaths] = partition(
      learningpaths,
      (lp) => lp.status !== PUBLISHED,
    );

    setPublishedCount((prev) => prev + publishedDrafts.length + publishedLearningpaths.length);

    const draftPromises = unpublishedDrafts.map((draft) =>
      updateStatusDraft(draft.id, PUBLISHED)
        .then((_) => setPublishedCount((c) => c + 1))
        .catch((_) =>
          setFailedResources((prev) =>
            prev.concat({
              name: draft.title?.title ?? "",
              contentUri: `url:article:${draft.id}`,
            }),
          ),
        ),
    );
    const learningpathPromises = unpublishedLearningpaths.map((lp) =>
      updateStatusLearningpath(lp.id, PUBLISHED)
        .then((_) => setPublishedCount((c) => c + 1))
        .catch((_) =>
          setFailedResources((prev) =>
            prev.concat({
              name: lp.title.title,
              contentUri: `url:learningpath:${lp.id}`,
            }),
          ),
        ),
    );
    await Promise.all([...draftPromises, ...learningpathPromises]);
    await qc.invalidateQueries({ queryKey: [RESOURCE_META, {}] });
    setDone(true);
  };

  const publishText = t(`taxonomy.publish.${done ? "done" : "waiting"}`);

  return (
    <Wrapper>
      <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
        <h2>{t("taxonomy.publish.button")}</h2>
      </Heading>
      <MessageBox variant="warning">
        <ErrorWarningLine />
        <Text>{t("taxonomy.publish.info")}</Text>
      </MessageBox>
      <StyledButton onClick={() => publishResources()}>{t("taxonomy.publish.button")}</StyledButton>
      {showDisplay && (
        <StatusIndicatorContent aria-live="polite">
          <StatusIndicatorContent>{done ? <StyledCheckLine /> : <Spinner size="small" />}</StatusIndicatorContent>
          <Text>{`${publishText} (${publishedCount}/${publishableCount})`}</Text>
        </StatusIndicatorContent>
      )}
      {failedResources.length > 0 && (
        <MessageBox variant="error">
          <ErrorWarningLine />
          <StyledErrorTextWrapper>
            <Text>{t("taxonomy.publish.error")}</Text>
            <div>
              {failedResources.map((res, index) => (
                <div key={index}>
                  <ResourceItemLink
                    contentType={res.contentUri?.split(":")[1] === "article" ? "article" : "learning-resource"}
                    contentUri={res.contentUri}
                    name={res.name}
                    key={index}
                  />
                </div>
              ))}
            </div>
          </StyledErrorTextWrapper>
        </MessageBox>
      )}
    </Wrapper>
  );
};

export default PublishChildNodeResources;
