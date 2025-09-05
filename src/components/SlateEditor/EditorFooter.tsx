/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHref, useLocation } from "react-router";
import { ShareBoxLine } from "@ndla/icons";
import { Button, FieldRoot } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IStatusDTO as ConceptStatus } from "@ndla/types-backend/concept-api";
import { PUBLISHED, SAVE_DEBOUNCE_MS } from "../../constants";
import PrioritySelect from "../../containers/FormikForm/components/PrioritySelect";
import ResponsibleSelect from "../../containers/FormikForm/components/ResponsibleSelect";
import StatusSelect from "../../containers/FormikForm/components/StatusSelect";
import { ConceptStatusStateMachineType, DraftStatusStateMachineType } from "../../interfaces";
import { usePutLearningpathStatusMutation } from "../../modules/learningpath/learningpathMutations";
import { NewlyCreatedLocationState, routes, toPreviewDraft } from "../../util/routeHelpers";
import { FormField } from "../FormField";
import { PreviewResourceDialog } from "../PreviewDraft/PreviewResourceDialog";
import SaveMultiButton from "../SaveMultiButton";

interface Props {
  type: "article" | "concept" | "learningpath";
  formIsDirty: boolean;
  savedToServer: boolean;
  onSaveClick: () => void;
  statusStateMachine?: ConceptStatusStateMachineType | DraftStatusStateMachineType;
  hideSecondaryButton: boolean;
  hasErrors?: boolean;
}

interface FormValues {
  id: number;
  language: string;
  revision?: number;
  status: ConceptStatus;
  priority?: string;
  supportedLanguages: string[];
}

const LinksWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "5xsmall",
    alignItems: "flex-start",
  },
});

const FooterWrapper = styled("div", {
  base: {
    position: "sticky",
    bottom: "4xsmall",
    zIndex: "docked",
    display: "grid",
    gridTemplateColumns: "1fr repeat(3, minmax(150px, max-content)) min-content",
    justifyContent: "space-between",
    rowGap: "xsmall",
    columnGap: "medium",
    padding: "small",
    boxShadow: "medium",
    marginInline: "-xsmall",
    borderRadius: "xsmall",
    border: "1px solid",
    borderColor: "stroke.default",
    alignItems: "center",
    background: "background.default",
    desktopDown: {
      display: "flex",
      flexWrap: "wrap",
    },
  },
});

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    whiteSpace: "nowrap",
  },
});

interface LanguageButtonProps {
  supportedLanguages: string[] | undefined;
  language: string | undefined;
}

const REQUIRED_LANGUAGES = ["nb", "nn"];

const LanguageButton = ({ supportedLanguages, language }: LanguageButtonProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const href = useHref(location);

  if (
    language &&
    REQUIRED_LANGUAGES.every((lang) => supportedLanguages?.includes(lang)) &&
    REQUIRED_LANGUAGES.includes(language)
  ) {
    const targetLanguage = language === "nb" ? "nn" : "nb";

    return (
      <StyledSafeLinkButton variant="link" to={href.split("/").slice(0, -1).concat(targetLanguage).join("/")}>
        {t(`languages.${targetLanguage}`)}
      </StyledSafeLinkButton>
    );
  }
};

function EditorFooter<T extends FormValues>({
  formIsDirty,
  savedToServer,
  onSaveClick,
  statusStateMachine,
  hideSecondaryButton,
  hasErrors,
  type,
}: Props) {
  const { t } = useTranslation();
  const { values, initialValues, setFieldValue, isSubmitting } = useFormikContext<T>();
  const location = useLocation();
  const [shouldSave, setShouldSave] = useState(false);
  const putLearningpathStatusMutation = usePutLearningpathStatusMutation(values.language);

  useEffect(() => {
    if (!shouldSave) return;
    onSaveClick();
    setShouldSave(false);
  }, [onSaveClick, shouldSave]);

  const onUpdateStatus = useCallback(
    (value: string | undefined) => {
      setFieldValue("status", { current: value });
      if (value === PUBLISHED) {
        setTimeout(() => setShouldSave(true), SAVE_DEBOUNCE_MS);
      }
    },
    [setFieldValue],
  );

  return (
    <FooterWrapper>
      {!!values.id && (
        <LinksWrapper>
          {type === "concept" && (
            <PreviewResourceDialog
              type="concept"
              language={values.language}
              activateButton={<Button variant="link">{t("form.preview.button")}</Button>}
            />
          )}
          {type === "article" && (
            <SafeLinkButton variant="link" to={toPreviewDraft(values.id, values.language)} target="_blank">
              {t("form.preview.button")}
              <ShareBoxLine size="small" />
            </SafeLinkButton>
          )}
          {type === "learningpath" && (
            <SafeLinkButton variant="link" to={routes.learningpath.preview(values.id, values.language)} target="_blank">
              {t("form.preview.button")}
              <ShareBoxLine size="small" />
            </SafeLinkButton>
          )}
          <LanguageButton language={values.language} supportedLanguages={values.supportedLanguages} />
        </LinksWrapper>
      )}
      {type !== "concept" && (
        <FormField name="priority">
          {({ field, helpers }) => (
            <FieldRoot>
              <PrioritySelect priority={field.value} updatePriority={helpers.setValue} />
            </FieldRoot>
          )}
        </FormField>
      )}
      <FormField name="responsibleId">
        {({ field, helpers }) => (
          <FieldRoot>
            <ResponsibleSelect responsible={field.value} onSave={helpers.setValue} />
          </FieldRoot>
        )}
      </FormField>
      {!!values.id && type !== "learningpath" && (
        <FormField name="status">
          {({ field }) => (
            <FieldRoot>
              <StatusSelect
                status={field.value}
                updateStatus={onUpdateStatus}
                statusStateMachine={statusStateMachine}
                initialStatus={initialValues.status.current}
              />
            </FieldRoot>
          )}
        </FormField>
      )}
      {!!values.status && type === "learningpath" && values.status.current !== PUBLISHED && (
        <Button
          disabled={
            formIsDirty || isSubmitting || !!location.state?.isNewlyCreated || values.status.current === PUBLISHED
          }
          loading={putLearningpathStatusMutation.isPending}
          onClick={async () => {
            await putLearningpathStatusMutation.mutateAsync({
              learningpathId: values.id,
              status: PUBLISHED,
            });
          }}
        >
          {t("form.publish")}
        </Button>
      )}
      <SaveMultiButton
        isSaving={isSubmitting}
        formIsDirty={formIsDirty}
        showSaved={!formIsDirty && (savedToServer || !!(location.state as NewlyCreatedLocationState)?.isNewlyCreated)}
        onClick={(saveAsNew) => {
          setFieldValue("saveAsNew", saveAsNew);
          setTimeout(() => setShouldSave(true), SAVE_DEBOUNCE_MS);
        }}
        hideSecondaryButton={hideSecondaryButton}
        hasErrors={!!hasErrors}
      />
    </FooterWrapper>
  );
}

export default memo(EditorFooter);
