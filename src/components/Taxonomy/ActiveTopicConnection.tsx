/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { misc, spacing, fonts, colors } from "@ndla/core";
import { DeleteBinLine } from "@ndla/icons/action";
import { IconButton } from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import Breadcrumb from "./Breadcrumb";
import RelevanceOptionSwitch from "./RelevanceOptionSwitch";
import { MinimalNodeChild } from "../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy";

interface Props {
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (connectionId: string) => void;
  node: MinimalNodeChild | Node;
  type: string;
  setRelevance?: (topicId: string, relevanceId: string) => void;
}

const StyledFlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const StyledPrimaryConnectionButton = styled.button`
  border: 0;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall} ${spacing.small};
  margin-right: ${spacing.xsmall};
  text-transform: uppercase;
  ${fonts.sizes(14, 1.1)};
  font-weight: ${fonts.weight.semibold};
  background: ${colors.support.green};
  opacity: 0.3;
  transition: opacity 100ms ease;
  cursor: pointer;
  &:hover,
  &:focus {
    opacity: 1;
  }
  &[data-primary="true"] {
    opacity: 1;
  }
`;

const StyledConnections = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.xsmall};
  background: ${colors.brand.greyLightest};
  padding: ${spacing.xsmall};
  margin-bottom: 2px;
  border-radius: ${misc.borderRadius};
  div > span {
    padding: ${spacing.xsmall};
    ${fonts.sizes(16, 1.1)};
  }
`;

const ActiveTopicConnection = ({ removeConnection, setPrimaryConnection, setRelevance, type, node }: Props) => {
  const { t } = useTranslation();

  if (type === "topic-article") {
    return (
      <StyledConnections>
        <Breadcrumb node={node} />
      </StyledConnections>
    );
  }
  return (
    <StyledConnections>
      <StyledFlexWrapper>
        <StyledPrimaryConnectionButton
          data-primary={"isPrimary" in node ? node.isPrimary : false}
          type="button"
          onClick={() => setPrimaryConnection?.(node.id)}
        >
          {t("form.topics.primaryTopic")}
        </StyledPrimaryConnectionButton>
        <Breadcrumb node={node} />
      </StyledFlexWrapper>
      <StyledFlexWrapper>
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
      </StyledFlexWrapper>
    </StyledConnections>
  );
};

export default ActiveTopicConnection;
