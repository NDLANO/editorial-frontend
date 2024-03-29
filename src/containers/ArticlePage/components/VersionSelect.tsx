/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Select, SingleValue } from "@ndla/select";
import { Version } from "@ndla/types-taxonomy";
import { generateOptionGroups } from "../../../components/Taxonomy/OptGroupVersionSelector";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const Wrapper = styled.div`
  margin-top: ${spacing.normal};
  margin-bottom: ${spacing.small};
`;

interface Props {
  onVersionChanged: (value: SingleValue) => void;
  versions?: Version[];
}

const getCurrentTaxVersion = (versions: Version[], oldTaxVersion: string): SingleValue => {
  const currentVersion = versions?.find((version) => version.hash === oldTaxVersion);
  return currentVersion ? { value: currentVersion.hash, label: currentVersion.name } : null;
};

const VersionSelect = ({ versions = [], onVersionChanged }: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const { t } = useTranslation();

  const fakeDefault = useMemo(
    () => ({
      value: "",
      label: t("diff.defaultVersion"),
    }),
    [t],
  );

  const currentVersion = getCurrentTaxVersion(versions, taxonomyVersion) ?? fakeDefault;
  const options = useMemo(
    () =>
      versions.map((version) => ({
        id: version.hash,
        name: version.name,
        type: version.versionType,
      })),
    [versions],
  );
  const optGroups = useMemo(
    () =>
      [{ label: "", options: [fakeDefault] }].concat(
        generateOptionGroups(options, t).map((g) => ({
          label: g.label,
          options: g.options.map((o) => ({ value: o.id, label: o.name })),
        })),
      ),
    [fakeDefault, options, t],
  );

  return (
    <Wrapper>
      <Select<false>
        options={optGroups}
        value={currentVersion}
        onChange={onVersionChanged}
        prefix={`${t("taxonomy.version")}: `}
      />
    </Wrapper>
  );
};

export default VersionSelect;
