/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { Heading, PageContainer, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import DiffOptions from "./DiffOptions";
import NodeDiffcontainer from "./NodeDiffContainer";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "medium",
  },
});

export const Component = () => <PrivateRoute component={<NodeDiffPage />} />;

const NodeDiffPage = () => {
  const { nodeId } = useParams();
  const [params] = useSearchParams();
  const { t } = useTranslation();
  const originalHash = params.get("originalHash");
  const otherHash = params.get("otherHash") ?? "default";

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.nodeDiffPage")}</title>
        <Heading textStyle="heading.medium">{t("diff.compareVersions")}</Heading>
        {!originalHash || !nodeId ? (
          <Text color="text.error">{t("diff.error.originalHashRequired")}</Text>
        ) : (
          <>
            <DiffOptions originalHash={originalHash} otherHash={otherHash} />
            <NodeDiffcontainer originalHash={originalHash} otherHash={otherHash} nodeId={nodeId} />
          </>
        )}
      </main>
    </StyledPageContainer>
  );
};
