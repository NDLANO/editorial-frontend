/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons/action";
import { Button, IconButton, ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import Breadcrumb from "./Breadcrumb";
import RelevanceOptionSwitch from "./RelevanceOptionSwitch";
import { MinimalNodeChild } from "../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy";

const StyledWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
  },
});

const StyledPrimaryConnectionButton = styled(Button, {
  base: {
    opacity: "0.3",
    _hover: { opacity: "1" },
    _focusVisible: { opacity: "1" },
  },
  variants: {
    primary: {
      true: { opacity: "1" },
    },
  },
});

interface Props {
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (connectionId: string) => void;
  node: MinimalNodeChild | Node;
  type: string;
  setRelevance?: (topicId: string, relevanceId: string) => void;
}

const ActiveTopicConnection = ({ removeConnection, setPrimaryConnection, setRelevance, type, node }: Props) => {
  const { t } = useTranslation();

  if (type === "topic-article") {
    return (
      <ListItemRoot context="list" variant="subtle" asChild consumeCss>
        <li>
          <Breadcrumb node={node} />
        </li>
      </ListItemRoot>
    );
  }
  return (
    <ListItemRoot context="list" variant="subtle" asChild consumeCss>
      <li>
        <StyledPrimaryConnectionButton
          size="small"
          primary={"isPrimary" in node ? node.isPrimary : false}
          variant="success"
          onClick={() => setPrimaryConnection?.(node.id)}
        >
          {t("form.topics.primaryTopic")}
        </StyledPrimaryConnectionButton>
        <ListItemContent>
          <ListItemHeading>
            <Breadcrumb node={node} />
          </ListItemHeading>
          <StyledWrapper>
            <RelevanceOptionSwitch
              relevanceId={node.relevanceId}
              onChange={(relevanceId) => setRelevance?.(node.id, relevanceId)}
            />
            <IconButton
              aria-label={t("taxonomy.removeResource")}
              title={t("taxonomy.removeResource")}
              variant="danger"
              size="small"
              onClick={() => removeConnection?.(node.id)}
            >
              <DeleteBinLine />
            </IconButton>
          </StyledWrapper>
        </ListItemContent>
      </li>
    </ListItemRoot>
  );
};

export default ActiveTopicConnection;
