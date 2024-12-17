/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikErrors } from "formik";
import { useTranslation } from "react-i18next";

import { FieldErrorMessage, FieldRoot, PageContent } from "@ndla/primitives";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";

import SubjectpageAbout from "./SubjectpageAbout";
import SubjectpageArticles from "./SubjectpageArticles";
import SubjectpageMetadata from "./SubjectpageMetadata";
import SubjectpageSubjectlinks from "./SubjectpageSubjectlinks";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { SubjectPageFormikType } from "../../../util/subjectHelpers";

interface Props {
  buildsOn: string[];
  connectedTo: string[];
  editorsChoices: (IArticleDTO | ILearningPathV2DTO)[];
  elementId: string;
  errors: FormikErrors<SubjectPageFormikType>;
  leadsTo: string[];
  isSubmitting: boolean;
}

const SubjectpageAccordionPanels = ({
  buildsOn,
  connectedTo,
  editorsChoices,
  elementId,
  errors,
  leadsTo,
  isSubmitting,
}: Props) => {
  const { t } = useTranslation();

  return (
    <FormAccordions defaultOpen={["about"]}>
      <FormAccordion
        id="about"
        title={t("subjectpageForm.about")}
        hasError={["title", "description", "visualElement"].some((field) => field in errors)}
      >
        <PageContent variant="content">
          <SubjectpageAbout />
        </PageContent>
      </FormAccordion>
      <FormAccordion
        id="metadata"
        title={t("subjectpageForm.metadata")}
        hasError={["metaDescription", "desktopBannerId", "mobileBannerId"].some((field) => field in errors)}
      >
        <SubjectpageMetadata isSubmitting={isSubmitting} />
      </FormAccordion>
      <FormAccordion
        id="subjectlinks"
        title={t("subjectpageForm.subjectlinks")}
        hasError={["connectedTo", "buildsOn", "leadsTo"].some((field) => field in errors)}
      >
        <FormContent>
          <SubjectpageSubjectlinks subjectIds={connectedTo} fieldName={"connectedTo"} />
          <SubjectpageSubjectlinks subjectIds={buildsOn} fieldName={"buildsOn"} />
          <SubjectpageSubjectlinks subjectIds={leadsTo} fieldName={"leadsTo"} />
        </FormContent>
      </FormAccordion>
      <FormAccordion
        id="articles"
        title={t("subjectpageForm.articles")}
        hasError={["editorsChoices"].some((field) => field in errors)}
      >
        <FormField name="editorsChoices">
          {({ meta }) => (
            <FieldRoot invalid={!!meta.error}>
              <SubjectpageArticles editorsChoices={editorsChoices} elementId={elementId} fieldName={"editorsChoices"} />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FieldRoot>
          )}
        </FormField>
      </FormAccordion>
    </FormAccordions>
  );
};

export default SubjectpageAccordionPanels;
