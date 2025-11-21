/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { keyBy } from "lodash-es";
import { useEffect, useRef, useState, ReactNode } from "react";
import { useLocation } from "react-router";
import { PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { NodeChild, NodeType } from "@ndla/types-taxonomy";
import { useCurrentNode } from "./CurrentNodeProvider";
import LeftColumn from "./LeftColumn";
import { PreferencesProvider } from "./PreferencesProvider";
import StructureResources from "./resourceComponents/StructureResources";
import SubjectBanner from "./resourceComponents/SubjectBanner";
import { RESOURCE_SECTION_ID } from "./utils";
import VersionSelector from "./VersionSelector";
import ErrorBoundary from "../../components/ErrorBoundary";
import { TAXONOMY_ADMIN_SCOPE, DRAFT_RESPONSIBLE } from "../../constants";
import { useAuth0Responsibles } from "../../modules/auth0/auth0Queries";
import { createGuard } from "../../util/guards";
import { useSession } from "../Session/SessionProvider";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

const StickyContainer = styled("div", {
  base: {
    position: "sticky",
    top: "xsmall",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const GridWrapper = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "xsmall",
    paddingBlock: "xsmall",
    desktopDown: {
      display: "flex",
      flexDirection: "column",
      gap: "xsmall",
    },
  },
});

const MessageBoxWrapper = styled("div", {
  base: {
    gridColumn: "1/-1",
  },
});

const isChildNode = createGuard<NodeChild>("connectionId");

interface Props {
  rootNodeType?: NodeType;
  childNodeTypes?: NodeType[];
  rootPath?: string;
  showResourceColumn?: boolean;
  messageBox?: ReactNode;
}

const StructureContainer = ({
  rootNodeType = "SUBJECT",
  childNodeTypes = ["TOPIC"],
  rootPath = "/structure/",
  showResourceColumn = true,
  messageBox,
}: Props) => {
  const location = useLocation();
  const paths = location.pathname.replace(rootPath, "").split("/");
  const { taxonomyVersion } = useTaxonomyVersion();
  const { currentNode, setCurrentNode } = useCurrentNode();
  const [shouldScroll, setShouldScroll] = useState(!!paths.length);

  const { userPermissions } = useSession();

  const firstRender = useRef(true);

  const { data: users } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    { select: (users) => keyBy(users, (u) => u.app_metadata.ndla_id) },
  );

  useEffect(() => {
    if (currentNode && shouldScroll) {
      document.getElementById(currentNode.id)?.scrollIntoView({ block: "center" });
      setShouldScroll(false);
    }
  }, [currentNode, shouldScroll]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      setCurrentNode(undefined);
    }
    setShouldScroll(true);
  }, [setCurrentNode, taxonomyVersion]);

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);
  return (
    <ErrorBoundary>
      <PageContent variant="wide">
        <PreferencesProvider>
          <GridWrapper>
            {!!messageBox && <MessageBoxWrapper>{messageBox}</MessageBoxWrapper>}
            <LeftColumn rootNodeType={rootNodeType} childNodeTypes={childNodeTypes} rootPath={rootPath} />
            {!!showResourceColumn && (
              <div>
                {!!currentNode && (
                  <StickyContainer id={RESOURCE_SECTION_ID}>
                    {currentNode.nodeType === "SUBJECT" && <SubjectBanner subjectNode={currentNode} users={users} />}
                    {isChildNode(currentNode) && <StructureResources currentChildNode={currentNode} users={users} />}
                  </StickyContainer>
                )}
              </div>
            )}
          </GridWrapper>
        </PreferencesProvider>
      </PageContent>
      {!!isTaxonomyAdmin && <VersionSelector />}
    </ErrorBoundary>
  );
};

export default StructureContainer;
