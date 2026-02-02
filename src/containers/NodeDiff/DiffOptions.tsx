/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectRoot, SelectValueText, Skeleton } from "@ndla/primitives";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { GenericSelectItem, GenericSelectTrigger } from "../../components/abstractions/Select";
import { OptGroupVersionSelector } from "../../components/Taxonomy/OptGroupVersionSelector";
import { useVersions } from "../../modules/taxonomy/versions/versionQueries";

const StyledDiffOptions = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const StyledOptionRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "xsmall",
  },
});

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "unset",
    minWidth: "surface.3xsmall",
  },
});

interface Props {
  originalHash: string;
  otherHash?: string;
}

interface DiffOptionProps {
  label: string;
  options: { id: string; label: string }[];
  name: string;
  placeholder?: string;
  value: string;
  onChange: (id: string) => void;
}

const DiffOption = ({ label, options, name, placeholder, value, onChange }: DiffOptionProps) => {
  const collection = useMemo(() => {
    return createListCollection({ items: options, itemToValue: (item) => item.id, itemToString: (item) => item.label });
  }, [options]);

  return (
    <SelectRoot
      collection={collection}
      value={[value]}
      positioning={{ sameWidth: true }}
      name={name}
      onValueChange={(details) => onChange(details.value[0])}
    >
      <SelectLabel>{label}</SelectLabel>
      <StyledGenericSelectTrigger>
        <SelectValueText placeholder={placeholder} />
      </StyledGenericSelectTrigger>
      <SelectContent>
        {collection.items.map((item) => (
          <GenericSelectItem item={item} key={item.id}>
            {item.label}
          </GenericSelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

const DiffOptions = ({ originalHash, otherHash }: Props) => {
  const [params, setParams] = useSearchParams();
  const { t } = useTranslation();
  const taxonomyVersions = useVersions();
  const originalVersion = originalHash ? taxonomyVersions.data?.find((v) => v.hash === originalHash) : undefined;
  const otherVersion = otherHash ? taxonomyVersions.data?.find((v) => v.hash === otherHash) : undefined;

  const nodeViewOptions = [
    { id: "all", label: t("diff.options.allNodes") },
    { id: "changed", label: t("diff.options.changedNodes") },
  ];

  const nodeFieldOptions = [
    { id: "all", label: t("diff.options.allFields") },
    { id: "changed", label: t("diff.options.changedFields") },
  ];

  const viewOptions = [
    { id: "tree", label: t("diff.options.tree") },
    { id: "flat", label: t("diff.options.flat") },
  ];

  const currentNodeViewOption = params.get("nodeView") ?? "changed";
  const currentNodeFieldOption = params.get("fieldView") ?? "changed";
  const currentViewOption = params.get("view") ?? "tree";

  const onOriginalHashChange = (hash: string) => {
    params.set("originalHash", hash.length ? hash : "default");
    setParams(params);
  };

  const onParamChange = (name: string, value: string) => {
    params.set(name, value);
    setParams(params);
  };

  if (taxonomyVersions.isLoading) {
    return (
      <>
        <Skeleton css={{ width: "40%", height: "medium" }} />
        <Stack direction="row" gap="small" justify="flex-start" align="flex-start">
          <Stack direction="column" gap="3xsmall" css={{ width: "30%" }}>
            <Skeleton css={{ width: "40%", height: "medium" }} />
            <Skeleton css={{ height: "xlarge" }} />
          </Stack>
          <Stack direction="column" gap="3xsmall" css={{ width: "30%" }}>
            <Skeleton css={{ width: "40%", height: "medium" }} />
            <Skeleton css={{ height: "xlarge" }} />
          </Stack>
          <Stack direction="column" gap="3xsmall" css={{ width: "15%" }}>
            <Skeleton css={{ width: "80%", height: "medium" }} />
            <Skeleton css={{ height: "xlarge" }} />
          </Stack>
        </Stack>
        <Stack direction="row" gap="small" justify="flex-start" align="flex-start">
          <Stack direction="column" gap="3xsmall" css={{ width: "15%" }}>
            <Skeleton css={{ width: "40%", height: "medium" }} />
            <Skeleton css={{ height: "xlarge" }} />
          </Stack>
          <Stack direction="column" gap="3xsmall" css={{ width: "15%" }}>
            <Skeleton css={{ width: "40%", height: "medium" }} />
            <Skeleton css={{ height: "xlarge" }} />
          </Stack>
        </Stack>
      </>
    );
  }

  return (
    <StyledDiffOptions>
      <span>{t("diff.options.about")}</span>
      <StyledOptionRow>
        <OptGroupVersionSelector
          versions={taxonomyVersions.data ?? []}
          currentVersion={originalVersion?.hash}
          onVersionChanged={(version) => onOriginalHashChange(version.hash)}
        >
          <SelectLabel>{t("diff.options.originalHashLabel")}</SelectLabel>
        </OptGroupVersionSelector>
        <OptGroupVersionSelector
          versions={taxonomyVersions.data ?? []}
          currentVersion={otherVersion?.hash}
          onVersionChanged={(version) => onParamChange("otherHash", version.hash.length ? version.hash : "default")}
        >
          <SelectLabel>{t("diff.options.otherHashLabel")}</SelectLabel>
        </OptGroupVersionSelector>
        <DiffOption
          options={viewOptions}
          onChange={(id) => onParamChange("view", id)}
          name="view"
          label={t("diff.options.viewLabel")}
          value={currentViewOption}
        />
      </StyledOptionRow>
      <StyledOptionRow>
        <DiffOption
          options={nodeViewOptions}
          onChange={(id) => onParamChange("nodeView", id)}
          name="nodeView"
          label={t("diff.options.nodeViewLabel")}
          value={currentNodeViewOption}
        />
        <DiffOption
          options={nodeFieldOptions}
          onChange={(id) => onParamChange("fieldView", id)}
          name="fieldView"
          label={t("diff.options.fieldViewLabel")}
          value={currentNodeFieldOption}
        />
      </StyledOptionRow>
    </StyledDiffOptions>
  );
};
export default DiffOptions;
