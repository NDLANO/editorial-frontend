/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { SelectLabel } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { OptGroupVersionSelector } from "../../components/Taxonomy/OptGroupVersionSelector";
import { useVersions } from "../../modules/taxonomy/versions/versionQueries";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

const StickyDiv = styled("div", {
  base: {
    display: "flex",
    position: "sticky",
    bottom: "medium",
    zIndex: "docked",
    borderRadius: "xsmall",
    flexDirection: "column",
    left: "50%",
    width: "surface.xsmall",
    transformOrigin: "center",
    transform: "translateX(-50%)",
    padding: "xsmall",
    maxWidth: "surface.small",
  },
  defaultVariants: {
    versionType: "default",
  },
  variants: {
    versionType: {
      default: {
        background: "primary",
      },
      PUBLISHED: {
        background: "surface.success",
      },
      BETA: {
        background: "surface.warning",
      },
      ARCHIVED: {
        background: "surface.disabled.strong",
      },
    },
  },
});

const StyledSelectLabel = styled(SelectLabel, {
  base: {
    color: "text.onAction",
  },
});

const StickyVersionSelector = () => {
  const { t } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { data } = useVersions();
  const qc = useQueryClient();

  if (!data) return <></>;
  const currentVersion = data.find((version) => version.hash === taxonomyVersion);

  const onVersionChanged = (newVersionHash: string) => {
    const oldVersion = taxonomyVersion;
    changeVersion(newVersionHash);
    qc.removeQueries({
      predicate: (query) => {
        const qk = query.queryKey as [string, Record<string, any>];
        return qk[1]?.taxonomyVersion === oldVersion;
      },
    });
  };

  return (
    <StickyDiv versionType={currentVersion?.versionType ?? "default"}>
      <OptGroupVersionSelector
        versions={data}
        currentVersion={currentVersion?.hash}
        onVersionChanged={(version) => onVersionChanged(version.hash)}
      >
        <StyledSelectLabel>{t("taxonomy.currentVersion")}</StyledSelectLabel>
      </OptGroupVersionSelector>
    </StickyDiv>
  );
};

export default StickyVersionSelector;
