/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import partition from "lodash/partition";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import { colors } from "@ndla/core";
import { Done } from "@ndla/icons/editor";
import { Button } from "@ndla/primitives";
import { IArticle } from "@ndla/types-backend/draft-api";
import { ILearningPathV2 } from "@ndla/types-backend/learningpath-api";
import { Node } from "@ndla/types-taxonomy";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import { FormActionsContainer } from "../../../../components/FormikForm";
import { OldSpinner } from "../../../../components/OldSpinner";
import RoundIcon from "../../../../components/RoundIcon";
import { PUBLISHED } from "../../../../constants";
import { fetchDrafts, updateStatusDraft } from "../../../../modules/draft/draftApi";
import { fetchLearningpaths, updateStatusLearningpath } from "../../../../modules/learningpath/learningpathApi";
import { fetchNodeResources } from "../../../../modules/nodes/nodeApi";
import { RESOURCE_META } from "../../../../queryKeys";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import ResourceItemLink from "../../resourceComponents/ResourceItemLink";
import MenuItemButton from "../sharedMenuOptions/components/MenuItemButton";

interface Props {
  node: Node;
}
const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.2em;
`;

const LinkWrapper = styled.div`
  a {
    color: ${colors.white};
    &:hover {
      color: ${colors.white};
    }
  }
  margin-top: 0.5em;
`;

const StyledSpinner = styled(OldSpinner)`
  margin: 0px 4px;
`;

const StyledDone = styled(Done)`
  margin: 0px 4px;
  color: green;
`;

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
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    setShowAlert(failedResources.length !== 0 && done);
  }, [failedResources, done]);

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
    <>
      <MenuItemButton onClick={() => setShowConfirmation(true)}>
        <RoundIcon small icon={<Done />} />
        {t("taxonomy.publish.button")}
      </MenuItemButton>
      {showDisplay && (
        <StyledDiv>
          {done ? <StyledDone /> : <StyledSpinner size="normal" />}
          {`${publishText} (${publishedCount}/${publishableCount})`}
        </StyledDiv>
      )}
      <AlertDialog
        title={t("errorMessage.description")}
        label={t("errorMessage.description")}
        show={showAlert}
        onCancel={() => setShowAlert(false)}
        text={t("taxonomy.publish.error")}
      >
        {failedResources.map((res, index) => (
          <LinkWrapper key={index}>
            <ResourceItemLink
              contentType={res.contentUri?.split(":")[1] === "article" ? "article" : "learning-resource"}
              contentUri={res.contentUri}
              name={res.name}
            />
          </LinkWrapper>
        ))}
      </AlertDialog>
      <AlertDialog
        title={t("taxonomy.publish.button")}
        label={t("taxonomy.publish.button")}
        show={showConfirmation}
        text={t("taxonomy.publish.info")}
        onCancel={() => setShowConfirmation(false)}
      >
        <FormActionsContainer>
          <Button onClick={() => setShowConfirmation(false)} variant="danger">
            {t("form.abort")}
          </Button>
          <Button
            onClick={() => {
              setShowConfirmation(false);
              publishResources();
            }}
            variant="secondary"
          >
            {t("taxonomy.publish.button")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
    </>
  );
};

export default PublishChildNodeResources;
