/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import addYears from "date-fns/addYears";
import isBefore from "date-fns/isBefore";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IRevisionMeta } from "@ndla/types-backend/draft-api";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import { Dictionary } from "../../../interfaces";
import { NodeResourceMeta } from "../../../modules/nodes/nodeQueries";
import { getExpirationDate } from "../../ArticlePage/articleTransformers";

const Wrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledIcon = styled.div`
  background-color: transparent;
  // TODO: Update when color is added to colors
  border: 1px solid #c77623;
  color: #c77623;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  resources: ResourceWithNodeConnectionAndMeta[];
  contentMeta: Dictionary<NodeResourceMeta>;
  currentNode: ResourceWithNodeConnectionAndMeta;
}

export const isApproachingRevision = (revisions?: IRevisionMeta[]) => {
  if (!revisions?.length) return false;
  const expirationDate = getExpirationDate({ revisions: revisions });
  if (!expirationDate) return false;
  const currentDateAddYear = addYears(new Date(), 1);
  return isBefore(new Date(expirationDate), currentDateAddYear);
};

const ApproachingRevisionDate = ({ resources, currentNode, contentMeta }: Props) => {
  const { t } = useTranslation();

  const allRevisions = useMemo(() => {
    const resourceRevisions = resources.map((r) => r.contentMeta?.revisions).filter((r) => !!r);
    const currentNodeRevision = currentNode.contentUri ? contentMeta[currentNode.contentUri]?.revisions : undefined;
    return resourceRevisions.concat([currentNodeRevision]);
  }, [contentMeta, currentNode.contentUri, resources]);

  const approachingRevision = useMemo(
    () => allRevisions.map((r) => isApproachingRevision(r)).filter((a) => !!a).length,
    [allRevisions],
  );

  return (
    <Wrapper>
      <StyledIcon aria-label={t("form.responsible.revisionDate")} title={t("form.responsible.revisionDate")}>
        {approachingRevision}
      </StyledIcon>
    </Wrapper>
  );
};

export default ApproachingRevisionDate;
