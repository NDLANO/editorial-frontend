/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useMemo } from "react";
import { styled } from "@ndla/styled-system/jsx";
import PreviewConceptComponent from "./PreviewConceptComponent";
import { ConceptFormValues } from "../../containers/ConceptPage/conceptInterfaces";
import { conceptFormTypeToApiType } from "../../containers/ConceptPage/conceptTransformers";
import { useLicenses } from "../../modules/draft/draftQueries";

const ConceptWrapper = styled("div", {
  base: {
    paddingInline: "medium",
    paddingBlockEnd: "medium",
    width: "100%",
  },
});

export interface ConceptPreviewProps {
  type: "concept";
  language: string;
}

export const PreviewConcept = ({ language }: ConceptPreviewProps) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { values } = useFormikContext<ConceptFormValues>();

  const formConcept = useMemo(
    () => conceptFormTypeToApiType(values, licenses!, values.conceptType),
    [values, licenses],
  );

  return (
    <ConceptWrapper>
      <PreviewConceptComponent concept={formConcept} language={language} />
    </ConceptWrapper>
  );
};
