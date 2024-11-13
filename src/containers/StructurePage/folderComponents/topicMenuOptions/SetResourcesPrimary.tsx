/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorWarningLine } from "@ndla/icons/common";
import { Button, Heading, MessageBox, Spinner, Text } from "@ndla/primitives";
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

interface Props {
  node: Node;
  recursive?: boolean;
}

const SetResourcesPrimary = ({ node, recursive = false }: Props) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>();
  const { mutateAsync, isPending } = usePutResourcesPrimaryMutation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const setConnectedResourcesPrimary = async () => {
    setError(undefined);

    await mutateAsync(
      { taxonomyVersion, id: node.id, recursive },
      { onError: () => setError(t("taxonomy.resourcesPrimary.error")) },
    );
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
      <StyledButton onClick={setConnectedResourcesPrimary} disabled={isPending}>
        {t("alertModal.continue")}
        {isPending && <Spinner size="small" />}
      </StyledButton>
      {error && <Text color="text.error">{error}</Text>}
    </Wrapper>
  );
};

export default SetResourcesPrimary;
