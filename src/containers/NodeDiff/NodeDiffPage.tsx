/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { HelmetWithTracker } from "@ndla/tracker";
import { OneColumn } from "@ndla/ui";
import DiffOptions from "./DiffOptions";
import NodeDiffcontainer from "./NodeDiffContainer";
import FooterWrapper from "../App/components/Footer";

const StyledNodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  padding-top: ${spacing.normal};
`;

const NodeDiffPage = () => {
  const { nodeId } = useParams();
  const [params] = useSearchParams();
  const { t } = useTranslation();
  const originalHash = params.get("originalHash");
  const otherHash = params.get("otherHash") ?? "default";

  if (!originalHash || !nodeId) {
    return (
      <OneColumn>
        <HelmetWithTracker title={t("htmlTitles.nodeDiffPage")} />
        <h1>{t("diff.error.originalHashRequired")}</h1>
      </OneColumn>
    );
  }

  return (
    <>
      <OneColumn>
        <HelmetWithTracker title={t("htmlTitles.nodeDiffPage")} />
        <StyledNodeContainer>
          <DiffOptions originalHash={originalHash} otherHash={otherHash} />
          <NodeDiffcontainer originalHash={originalHash} otherHash={otherHash} nodeId={nodeId} />
        </StyledNodeContainer>
      </OneColumn>
      <FooterWrapper />
    </>
  );
};
export default NodeDiffPage;
