/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MessageBox } from "@ndla/primitives";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { TaxonomyVersionProvider } from "../StructureVersion/TaxonomyVersionProvider";
import { CurrentNodeProvider } from "./CurrentNodeProvider";
import StructureContainer from "./StructureContainer";

export const Component = () => <PrivateRoute component={<ProgrammePage />} />;

const ProgrammePage = () => {
  const { t } = useTranslation();
  const messageBox = useMemo(
    () => (
      <MessageBox>
        <a href={`${config.ndlaFrontendDomain}?versionHash=default`} target="_blank" rel="noreferrer">
          {t("taxonomy.previewProgrammes")}
        </a>
      </MessageBox>
    ),
    [t],
  );

  return (
    <TaxonomyVersionProvider>
      <title>{t("htmlTitles.programmePage")}</title>
      <CurrentNodeProvider>
        <StructureContainer
          rootNodeType="PROGRAMME"
          childNodeTypes={["PROGRAMME", "SUBJECT"]}
          rootPath="/programme/"
          showResourceColumn={false}
          messageBox={messageBox}
        />
      </CurrentNodeProvider>
    </TaxonomyVersionProvider>
  );
};
