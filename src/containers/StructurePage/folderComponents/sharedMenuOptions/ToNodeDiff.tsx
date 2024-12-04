/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ExternalLinkLine } from "@ndla/icons";
import { SafeLinkButton } from "@ndla/safelink";
import { Node } from "@ndla/types-taxonomy";
import { useTaxonomyVersion } from "../../../../containers/StructureVersion/TaxonomyVersionProvider";
import { toNodeDiff } from "../../../../util/routeHelpers";

interface Props {
  node: Node;
}

const ToNodeDiff = ({ node }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  return (
    <SafeLinkButton
      size="small"
      variant="tertiary"
      to={toNodeDiff(node.id, taxonomyVersion, "default")}
      data-testid="toNodeDiff"
    >
      {t("diff.compareVersions")}
      <ExternalLinkLine />
    </SafeLinkButton>
  );
};
export default ToNodeDiff;
