/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Spinner } from "@ndla/primitives";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { LearningpathTaxonomy } from "./LearningpathTaxonomy";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import { useNodes } from "../../../modules/nodes/nodeQueries";
import { useVersions } from "../../../modules/taxonomy/versions/versionQueries";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  learningpath: ILearningPathV2DTO;
  language: string;
}

export const LearningpathTaxonomyPart = ({ learningpath, language }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const nodesQuery = useNodes({
    contentURI: `urn:learningpath:${learningpath.id}`,
    taxonomyVersion,
    language,
    includeContexts: true,
  });

  const versionsQuery = useVersions();

  if (nodesQuery.isLoading || versionsQuery.isLoading) {
    return <Spinner />;
  }

  return (
    <FormAccordion id="taxonomy" title={t("form.taxonomySection")} hasError={!nodesQuery.data?.[0]?.contexts?.length}>
      <LearningpathTaxonomy
        learningpath={learningpath}
        resourceLanguage={language}
        nodes={nodesQuery.data}
        versions={versionsQuery.data}
      />
    </FormAccordion>
  );
};
