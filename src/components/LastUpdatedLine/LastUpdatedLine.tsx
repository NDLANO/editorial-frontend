/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import DateEdit from "./DateEdit";
import formatDate from "../../util/formatDate";

const StyledLastUpdatedLine = styled.div`
  color: ${colors.text.light};
  line-height: 1.4rem;
`;

interface Creator {
  name: string;
  type: string;
}

type Creators = Creator[];

interface Props {
  creators: Creators;
  allowEdit?: boolean;
  published?: string;
  onChange: (date: string) => void;
  contentType?: "topicArticle" | "concept";
}

const LastUpdatedLine = ({ creators, published, onChange, allowEdit = false, contentType = "topicArticle" }: Props) => {
  const { t } = useTranslation();
  const dateLabel = t(`${contentType}Form.info.lastUpdated`);
  return (
    <StyledLastUpdatedLine>
      {creators.map((creator) => creator.name).join(", ")}
      {published ? ` - ${dateLabel}: ` : ""}
      {published && (allowEdit ? <DateEdit onChange={onChange} published={published} /> : formatDate(published))}
    </StyledLastUpdatedLine>
  );
};

export default memo(LastUpdatedLine);
