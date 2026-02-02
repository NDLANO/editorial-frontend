/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LinkMedium } from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import { fetchConnectionsForNode } from "../../modules/nodes/nodeApi";
import { useSearchNodes } from "../../modules/nodes/nodeQueries";
import { toStructure } from "../../util/routeHelpers";
import { DialogCloseButton } from "../DialogCloseButton";

interface Props {
  nodes: Node[] | undefined;
}

const StyledUl = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

export const LinkConnections = ({ nodes }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const connections = useQueries({
    queries:
      nodes?.map((node) => {
        return {
          queryKey: ["linkConnections", { taxonomyVersion, id: node.id }],
          queryFn: () => fetchConnectionsForNode({ taxonomyVersion, id: node.id }),
        };
      }) ?? [],
  });

  const uses = useMemo(() => {
    return connections.reduce<string[]>((acc, query) => {
      if (query.isSuccess) {
        const filtered = query.data.filter((conn) => conn.type === "referrer");
        return acc.concat(filtered.map((conn) => conn.targetId));
      }
      return acc;
    }, []);
  }, [connections]);

  const nodesQuery = useSearchNodes({ ids: uses, taxonomyVersion }, { enabled: !!uses.length });

  if (!uses.length) {
    return null;
  }

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <IconButton
          size="small"
          variant="secondary"
          title={t("form.linkConnections.title")}
          aria-label={t("form.linkConnections.title")}
        >
          <LinkMedium />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("form.linkConnections.title")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <StyledUl>
            {nodesQuery.data?.results.map((node) => (
              <li key={node.id}>
                <SafeLink to={toStructure(node.path)}>{node.name}</SafeLink>
              </li>
            ))}
          </StyledUl>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
