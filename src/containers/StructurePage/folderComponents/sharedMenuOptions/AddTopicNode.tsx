/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { useTranslation } from "react-i18next";
import PlannedResourceForm from "../../plannedResource/PlannedResourceForm";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
    width: "100%",
  },
});

interface Props {
  node: Node;
}

const AddTopicNode = ({ node }: Props) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
        <h2>{t("taxonomy.addTopicHeader")}</h2>
      </Heading>
      <PlannedResourceForm node={node} articleType="topic-article" />
    </Wrapper>
  );
};

export default AddTopicNode;
