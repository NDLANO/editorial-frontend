/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ErrorWarningLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import { Button, Heading, MessageBox, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { usePutResourcesPrimaryMutation } from "../../../../modules/nodes/nodeMutations";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-end",
  },
});
const StyledCheckLine = styled(CheckLine, {
  base: { fill: "stroke.success" },
});

const StatusIndicatorContent = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

interface Props {
  node: Node;
  recursive?: boolean;
}

const SetResourcesPrimary = ({ node, recursive = false }: Props) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending, isError, isSuccess } = usePutResourcesPrimaryMutation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const setConnectedResourcesPrimary = async () => {
    await mutateAsync({ taxonomyVersion, id: node.id, recursive });
  };

  return (
    <Wrapper>
      <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
        <h2>{t("taxonomy.resourcesPrimary.recursiveButtonText")}</h2>
      </Heading>
      <MessageBox variant="warning">
        <ErrorWarningLine />
        <Text>{recursive ? t("taxonomy.resourcesPrimary.recursiveText") : t("taxonomy.resourcesPrimary.text")}</Text>
      </MessageBox>
      <StyledButton onClick={setConnectedResourcesPrimary} loading={isPending}>
        {t("alertModal.continue")}
      </StyledButton>
      {isSuccess && (
        <StatusIndicatorContent>
          <StyledCheckLine />
          <Text>{t("taxonomy.resourcesPrimary.success")}</Text>
        </StatusIndicatorContent>
      )}
      {isError && <Text color="text.error">{t("taxonomy.resourcesPrimary.error")}</Text>}
    </Wrapper>
  );
};

export default SetResourcesPrimary;
