/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getLocalTimeZone, parseAbsoluteToLocal, today } from "@internationalized/date";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IRevisionMetaDTO } from "@ndla/types-backend/draft-api";
import { Dictionary } from "../../../interfaces";
import { NodeResourceMeta, ResourceWithNodeConnectionAndMeta } from "../../../modules/nodes/nodeApiTypes";
import { getExpirationDate } from "../../../util/revisionHelpers";

const StyledIcon = styled("div", {
  base: {
    borderRadius: "full",
    border: "2px solid",
    borderColor: "stroke.default",
    width: "medium",
    height: "medium",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: "0",
  },
});

interface Props {
  resources: ResourceWithNodeConnectionAndMeta[];
  contentMeta: Dictionary<NodeResourceMeta>;
  currentNode: ResourceWithNodeConnectionAndMeta;
}

export const isApproachingRevision = (revisions?: IRevisionMetaDTO[]) => {
  if (!revisions?.length) return false;
  const expirationDate = getExpirationDate(revisions);
  if (!expirationDate) return false;
  const currentDateAddYear = today(getLocalTimeZone()).add({ years: 1 });
  return parseAbsoluteToLocal(expirationDate).compare(currentDateAddYear) <= 0;
};

const ApproachingRevisionDate = ({ resources, currentNode, contentMeta }: Props) => {
  const { t } = useTranslation();

  const allRevisions = useMemo(() => {
    const resourceRevisions = resources.map((r) => r.contentMeta?.revisions).filter((r) => !!r);
    const currentNodeRevision = currentNode.contentUri ? contentMeta[currentNode.contentUri]?.revisions : undefined;
    if (!currentNodeRevision) return resourceRevisions;
    return resourceRevisions.concat([currentNodeRevision]);
  }, [contentMeta, currentNode.contentUri, resources]);

  const approachingRevision = useMemo(
    () => allRevisions.map((r) => isApproachingRevision(r)).filter((a) => !!a).length,
    [allRevisions],
  );

  return (
    <StyledIcon aria-label={t("form.responsible.revisionDate")} title={t("form.responsible.revisionDate")}>
      <Text textStyle="label.small" fontWeight="bold">
        {approachingRevision}
      </Text>
    </StyledIcon>
  );
};

export default ApproachingRevisionDate;
