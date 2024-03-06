/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { ReactElement, useMemo } from "react";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import PreviewConceptComponent from "./PreviewConceptComponent";
import { ConceptFormValues } from "../../containers/ConceptPage/conceptInterfaces";
import { conceptFormTypeToApiType } from "../../containers/ConceptPage/conceptTransformers";
import { useLicenses } from "../../modules/draft/draftQueries";

export const ConceptWrapper = styled.div`
  padding: 0 ${spacing.normal} ${spacing.normal} ${spacing.normal};
`;

export interface ConceptPreviewProps {
  type: "concept";
  language: string;
  activateButton?: ReactElement;
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
