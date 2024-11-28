/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import DateEdit from "./DateEdit";
import formatDate from "../../util/formatDate";

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
    <Text color="text.subtle">
      {creators.map((creator) => creator.name).join(", ")}
      {published ? ` - ${dateLabel}: ` : ""}
      {!!published && (allowEdit ? <DateEdit onChange={onChange} published={published} /> : formatDate(published))}
    </Text>
  );
};

export default memo(LastUpdatedLine);
