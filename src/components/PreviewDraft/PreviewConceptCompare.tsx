/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IConcept } from "@ndla/types-backend/concept-api";
import { ConceptWrapper } from "./PreviewConcept";
import PreviewConceptComponent from "./PreviewConceptComponent";
import { TwoArticleWrapper } from "./TwoArticleWrapper";
import { ConceptFormValues } from "../../containers/ConceptPage/conceptInterfaces";
import { conceptFormTypeToApiType } from "../../containers/ConceptPage/conceptTransformers";
import { useConcept } from "../../modules/concept/conceptQueries";
import { useLicenses } from "../../modules/draft/draftQueries";

const PreviewHeading = styled.h2`
  margin: 0;
`;

const PreviewTitleWrapper = styled.div`
  height: 90px;
`;

export interface CompareConceptPreviewProps {
  type: "conceptCompare";
  concept: IConcept;
  language: string;
}

export const PreviewConceptCompare = ({ concept, language }: CompareConceptPreviewProps) => {
  const [previewLanguage, setPreviewLanguage] = useState<string>(
    concept.supportedLanguages.find((l) => l !== language) ?? concept.supportedLanguages[0]!,
  );
  const apiConcept = useConcept({ id: concept.id, language: previewLanguage });
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t } = useTranslation();
  const { values } = useFormikContext<ConceptFormValues>();
  const formConcept = useMemo(
    () => conceptFormTypeToApiType(values, licenses!, values.conceptType, concept.updatedBy),
    [values, licenses, concept.updatedBy],
  );
  return (
    <TwoArticleWrapper>
      <ConceptWrapper>
        <PreviewTitleWrapper>
          <PreviewHeading>
            {t("form.previewLanguageArticle.title", {
              language: t(`languages.${language}`).toLowerCase(),
            })}
          </PreviewHeading>
        </PreviewTitleWrapper>
        <PreviewConceptComponent concept={formConcept} language={language} />
      </ConceptWrapper>
      <ConceptWrapper>
        <PreviewTitleWrapper>
          <PreviewHeading>
            {t("form.previewLanguageArticle.title", {
              language: t(`languages.${previewLanguage}`).toLowerCase(),
            })}
          </PreviewHeading>
          <select onChange={(evt) => setPreviewLanguage(evt.target.value)} value={previewLanguage}>
            {concept.supportedLanguages.map((language) => (
              <option key={language} value={language}>
                {t(`languages.${language}`)}
              </option>
            ))}
          </select>
        </PreviewTitleWrapper>
        {apiConcept.data && <PreviewConceptComponent concept={apiConcept.data} language={previewLanguage} />}
      </ConceptWrapper>
    </TwoArticleWrapper>
  );
};
