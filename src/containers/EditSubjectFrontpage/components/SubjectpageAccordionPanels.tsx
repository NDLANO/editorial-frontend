/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikErrors } from "formik";
import { useTranslation } from "react-i18next";

import { PageContent } from "@ndla/primitives";
import { IArticle } from "@ndla/types-backend/draft-api";
import { ILearningPathV2 } from "@ndla/types-backend/learningpath-api";

import SubjectpageAbout from "./SubjectpageAbout";
import SubjectpageArticles from "./SubjectpageArticles";
import SubjectpageMetadata from "./SubjectpageMetadata";
import SubjectpageSubjectlinks from "./SubjectpageSubjectlinks";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import FormikField from "../../../components/FormikField";
import { FormContent } from "../../../components/FormikForm";
import { SubjectPageFormikType } from "../../../util/subjectHelpers";

interface Props {
  buildsOn: string[];
  connectedTo: string[];
  editorsChoices: (IArticle | ILearningPathV2)[];
  elementId: string;
  errors: FormikErrors<SubjectPageFormikType>;
  leadsTo: string[];
}

const SubjectpageAccordionPanels = ({ buildsOn, connectedTo, editorsChoices, elementId, errors, leadsTo }: Props) => {
  const { t } = useTranslation();

  const SubjectPageArticle = () => (
    <SubjectpageArticles editorsChoices={editorsChoices} elementId={elementId} fieldName={"editorsChoices"} />
  );

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
        <SubjectpageMetadata />
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
        <FormikField name={"editorsChoices"}>{SubjectPageArticle}</FormikField>
      </FormAccordion>
    </FormAccordions>
  );
};

export default SubjectpageAccordionPanels;
