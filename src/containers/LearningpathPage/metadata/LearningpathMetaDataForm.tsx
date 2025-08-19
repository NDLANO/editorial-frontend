/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikProps } from "formik";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createListCollection } from "@ark-ui/react";
import { CheckLine } from "@ndla/icons";
import {
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  FieldTextArea,
  Heading,
  Input,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import {
  ILearningPathV2DTO,
  INewLearningPathV2DTO,
  IUpdatedLearningPathV2DTO,
} from "@ndla/types-backend/learningpath-api";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { LearningpathMetaImageField } from "./LearningpathMetaImageField";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import { SearchTagsContent } from "../../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../../components/FormField";
import { Form, FormActionsContainer, FormContent } from "../../../components/FormikForm";
import validateFormik, { RulesType } from "../../../components/formikValidationSchema";
import LanguagePicker from "../../../components/HeaderWithLanguage/HeaderLanguagePicker";
import SaveMultiButton from "../../../components/SaveMultiButton";
import {
  usePatchLearningpathMutation,
  usePostLearningpathMutation,
} from "../../../modules/learningpath/learningpathMutations";
import { useLearningpathTags } from "../../../modules/learningpath/learningpathQueries";
import { routes, toLearningpath } from "../../../util/routeHelpers";
import useDebounce from "../../../util/useDebounce";
import RevisionNotes from "../../ArticlePage/components/RevisionNotes";
import { AlertDialogWrapper } from "../../FormikForm";
import { PreventWindowUnload } from "../../FormikForm/PreventWindowUnload";
import { LearningpathEnableClone } from "../components/LearningpathEnableClone";
import { LearningpathFormHeader } from "../components/LearningpathFormHeader";

interface LearningpathMetaDataFormValues {
  title: string;
  description: string;
  coverPhotoUrl?: string;
  tags: string[];
  // This field is only used for error checking in revisions
  revisionError?: string;
  revisionMeta: {
    note: string;
    revisionDate: string;
    status: string;
    new?: boolean;
  }[];
}

interface Props {
  learningpath?: ILearningPathV2DTO;
  language: string;
}

const learningpathApiTypeToFormType = (
  learningpath: ILearningPathV2DTO | undefined,
): LearningpathMetaDataFormValues => {
  return {
    title: learningpath?.title.title ?? "",
    description: learningpath?.description.description ?? "",
    coverPhotoUrl: learningpath?.coverPhoto?.url,
    tags: learningpath?.tags.tags ?? [],
    revisionMeta: learningpath?.revisions ?? [],
  };
};

const learningpathFormTypeToNewApiType = (
  values: LearningpathMetaDataFormValues,
  language: string,
): INewLearningPathV2DTO => {
  return {
    language,
    title: values.title,
    description: values.description,
    coverPhotoMetaUrl: values.coverPhotoUrl,
    tags: values.tags,
  };
};

const learningpathFormTypeToApiType = (
  learningpath: ILearningPathV2DTO,
  values: LearningpathMetaDataFormValues,
  language: string,
): IUpdatedLearningPathV2DTO => {
  return {
    revision: learningpath.revision,
    revisionMeta: values.revisionMeta,
    language,
    title: values.title,
    description: values.description,
    coverPhotoMetaUrl: values.coverPhotoUrl,
    tags: values.tags,
  };
};

const metaDataRules: RulesType<LearningpathMetaDataFormValues, ILearningPathV2DTO> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  introduction: {
    warnings: {
      languageMatch: true,
    },
  },
  revisionMeta: {
    test: (values) => {
      const emptyNote = values.revisionMeta?.find((meta) => meta.note.length === 0);
      if (emptyNote !== undefined) {
        return { translationKey: "validation.noEmptyRevision" };
      }
      return undefined;
    },
  },
  revisionError: {
    test: (values) => {
      const revisionItems = values.revisionMeta.length ?? 0;
      if (!revisionItems) {
        return { translationKey: "validation.missingRevision" };
      }
      const unfinishedRevision = values.revisionMeta.some((rev) => rev.status === "needs-revision");
      if (!unfinishedRevision) {
        return { translationKey: "validation.unfinishedRevision" };
      }
      return undefined;
    },
  },
};

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    justifyContent: "space-between",
  },
});

export const LearningpathMetaDataForm = ({ learningpath, language }: Props) => {
  const [savedToServer, setSavedToServer] = useState(false);
  const [inputQuery, setInputQuery] = useState<string>("");
  const debouncedQuery = useDebounce(inputQuery, 200);
  const { t } = useTranslation();
  const postLearningpathMutation = usePostLearningpathMutation();
  const patchLearningpathMutation = usePatchLearningpathMutation();
  const initialValues = learningpathApiTypeToFormType(learningpath);
  const initialErrors = useMemo(() => validateFormik(initialValues, metaDataRules, t), [initialValues, t]);
  const navigate = useNavigate();
  const tagSelectorTranslations = useTagSelectorTranslations();

  const languages = useMemo(() => {
    return [
      { key: "nn", title: t("languages.nn"), include: true },
      { key: "en", title: t("languages.en"), include: true },
      { key: "nb", title: t("languages.nb"), include: true },
      { key: "sma", title: t("languages.sma"), include: true },
      { key: "se", title: t("languages.se"), include: true },
      { key: "und", title: t("languages.und"), include: false },
      { key: "de", title: t("languages.de"), include: true },
      { key: "es", title: t("languages.es"), include: true },
      { key: "zh", title: t("languages.zh"), include: true },
      { key: "ukr", title: t("languages.ukr"), include: true },
    ];
  }, [t]);

  const emptyLanguages = useMemo(
    () =>
      languages.filter(
        (lang) => lang.key !== language && !learningpath?.supportedLanguages.includes(lang.key) && lang.include,
      ),
    [language, languages, learningpath],
  );

  const tagsQuery = useLearningpathTags();

  const collection = useMemo(() => {
    return createListCollection({
      items: tagsQuery.data?.tags.filter((item) => item.includes(debouncedQuery)).slice(0, 50) ?? [],
      itemToValue: (item) => item,
      itemToString: (item) => item,
    });
  }, [debouncedQuery, tagsQuery.data?.tags]);

  const validate = useCallback(
    (values: LearningpathMetaDataFormValues) => validateFormik(values, metaDataRules, t),
    [t],
  );

  const handleSubmit = useCallback(
    async (values: LearningpathMetaDataFormValues) => {
      if (learningpath) {
        const apiValue = learningpathFormTypeToApiType(learningpath, values, language);
        await patchLearningpathMutation.mutateAsync({ id: learningpath.id, learningpath: apiValue });
        setSavedToServer(true);
      } else {
        const apiValue = learningpathFormTypeToNewApiType(values, language);
        const res = await postLearningpathMutation.mutateAsync(apiValue);
        navigate(routes.learningpath.edit(res.id, language, "steps"));
      }
    },
    [language, learningpath, navigate, patchLearningpathMutation, postLearningpathMutation],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
    >
      {({ errors, ...formikProps }: FormikProps<LearningpathMetaDataFormValues>) => {
        const formIsDirty =
          formikProps.dirty || !!(learningpath && !learningpath.supportedLanguages.includes(language));
        return (
          <Form>
            {!!learningpath && <LearningpathEnableClone />}
            <PreventWindowUnload preventUnload={formIsDirty} />
            {!learningpath && <LearningpathFormHeader learningpath={learningpath} language={language} />}
            <HeadingWrapper>
              <Heading asChild consumeCss>
                <h2>{t("learningpathForm.metadata.heading")}</h2>
              </Heading>
              {!!learningpath && (
                <LanguagePicker id={learningpath.id} editUrl={toLearningpath} emptyLanguages={emptyLanguages} />
              )}
            </HeadingWrapper>
            <FormContent>
              <FormField name="title">
                {({ field, meta }) => (
                  <FieldRoot required invalid={!!meta.error}>
                    <FieldLabel>{t("learningpathForm.metadata.titleLabel")}</FieldLabel>
                    <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                    <FieldInput {...field} />
                  </FieldRoot>
                )}
              </FormField>
              <FormField name="description">
                {({ field, meta }) => (
                  <FieldRoot required invalid={!!meta.error}>
                    <FieldLabel>{t("learningpathForm.metadata.descriptionLabel")}</FieldLabel>
                    <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                    <FieldTextArea {...field} />
                  </FieldRoot>
                )}
              </FormField>
              <FormField name="tags">
                {({ field, meta, helpers }) => (
                  <FieldRoot invalid={!!meta.error}>
                    <TagSelectorRoot
                      collection={collection}
                      value={field.value}
                      onValueChange={(details) => helpers.setValue(details.value)}
                      translations={tagSelectorTranslations}
                      inputValue={inputQuery}
                      onInputValueChange={(details) => setInputQuery(details.inputValue)}
                    >
                      <TagSelectorLabel>{t("form.tags.label")}</TagSelectorLabel>
                      <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                      <SearchTagsTagSelectorInput asChild>
                        <Input placeholder={t("form.tags.searchPlaceholder")} />
                      </SearchTagsTagSelectorInput>
                      <SearchTagsContent isFetching={tagsQuery.isFetching} hits={collection.items.length}>
                        {collection.items.map((item) => (
                          <ComboboxItem key={item} item={item}>
                            <ComboboxItemText>{item}</ComboboxItemText>
                            <ComboboxItemIndicator asChild>
                              <CheckLine />
                            </ComboboxItemIndicator>
                          </ComboboxItem>
                        ))}
                      </SearchTagsContent>
                    </TagSelectorRoot>
                  </FieldRoot>
                )}
              </FormField>
              <LearningpathMetaImageField language={language} />
            </FormContent>
            <FormAccordions defaultOpen={[]}>
              <FormAccordion
                id="revision"
                title={t("form.name.revisions")}
                hasError={!!errors.revisionMeta || !!errors.revisionError}
              >
                <RevisionNotes />
              </FormAccordion>
            </FormAccordions>
            <FormActionsContainer>
              <SaveMultiButton
                isSaving={formikProps.isSubmitting}
                formIsDirty={formIsDirty}
                showSaved={!!savedToServer && !formikProps.dirty}
                hasErrors={!!Object.keys(errors).length}
                hideSecondaryButton
                onClick={formikProps.submitForm}
              />
            </FormActionsContainer>
            <AlertDialogWrapper
              isSubmitting={formikProps.isSubmitting}
              formIsDirty={formIsDirty}
              severity="danger"
              text={t("alertDialog.notSaved")}
            />
          </Form>
        );
      }}
    </Formik>
  );
};
