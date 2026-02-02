/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { TaxonomyVersionProvider } from "../StructureVersion/TaxonomyVersionProvider";
import { CurrentNodeProvider } from "./CurrentNodeProvider";
import StructureContainer from "./StructureContainer";

export const Component = () => <PrivateRoute component={<StructurePage />} />;

const StructurePage = () => {
  const { t } = useTranslation();
  return (
    <TaxonomyVersionProvider>
      <title>{t("htmlTitles.structurePage")}</title>
      <CurrentNodeProvider>
        <StructureContainer />
      </CurrentNodeProvider>
    </TaxonomyVersionProvider>
  );
};
