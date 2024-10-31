/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MessageBox } from "@ndla/primitives";
import { HelmetWithTracker } from "@ndla/tracker";
import StructureContainer from "./StructureContainer";
import config from "../../config";
import { TaxonomyVersionProvider } from "../StructureVersion/TaxonomyVersionProvider";

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
      <HelmetWithTracker title={t("htmlTitles.programmePage")} />
      <StructureContainer
        rootNodeType="PROGRAMME"
        childNodeTypes={["PROGRAMME", "SUBJECT"]}
        rootPath="/programme/"
        showResourceColumn={false}
        messageBox={messageBox}
      />
    </TaxonomyVersionProvider>
  );
};

export default ProgrammePage;
