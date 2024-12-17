/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { addYears } from "date-fns";
import { FastField, FieldArray, FieldProps, useField } from "formik";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons";
import {
  Button,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  FieldsetHelper,
  FieldsetLegend,
  FieldsetRoot,
  IconButton,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Revision } from "../../../constants";
import { formatDateForBackend } from "../../../util/formatDate";
import { ArticleFormType } from "../../FormikForm/articleFormHooks";
import InlineDatePicker from "../../FormikForm/components/InlineDatePicker";
import { useMessages } from "../../Messages/MessagesProvider";

export type RevisionMetaFormType = ArticleFormType["revisionMeta"];

const FieldWrapper = styled(FieldsetRoot, {
  base: {
    display: "flex",
    flexDirection: "row",
    gap: "xsmall",
    width: "100%",
    alignItems: "center",
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    flex: "1",
  },
});

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-start",
  },
});

const RevisionNotes = () => {
  const { t } = useTranslation();
  const [, { value }] = useField<RevisionMetaFormType>("revisionMeta");

  const { createMessage } = useMessages();

  return (
    <FieldArray
      name="revisionMeta"
      render={(arrayHelpers) => (
        <FieldsetRoot>
          <FieldsetLegend>{t("form.name.revisions")}</FieldsetLegend>
          <FieldsetHelper>{t("form.revisions.description")}</FieldsetHelper>
          {value.map((_, index) => (
            <FieldsetRoot key={`revision-${index}`} name={`revision.${index}`}>
              <FieldsetLegend srOnly>{t("form.revisions.revisionNumber", { number: index + 1 })}</FieldsetLegend>
              <FieldWrapper>
                <FastField name={`revisionMeta.${index}.note`}>
                  {({ field, meta }: FieldProps) => (
                    <StyledFieldRoot required invalid={!!meta.error}>
                      <FieldLabel srOnly>{t("form.name.note")}</FieldLabel>
                      <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                      <FieldInput
                        {...field}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        placeholder={t("form.revisions.inputPlaceholder")}
                        data-testid="revisionInput"
                      />
                    </StyledFieldRoot>
                  )}
                </FastField>
                <FastField name={`revisionMeta.${index}.revisionDate`}>
                  {({ field, meta, form }: FieldProps) => (
                    <FieldRoot required invalid={!!meta.error}>
                      <FieldLabel srOnly>{t("form.name.date")}</FieldLabel>
                      <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                      <InlineDatePicker
                        aria-label={t("form.revisions.datePickerTooltip")}
                        value={field.value}
                        name={`revision_date_${index}`}
                        onChange={(evt) => {
                          form.setFieldValue(field.name, evt.target.value, true);
                        }}
                        title={t("form.revisions.datePickerTooltip")}
                      />
                    </FieldRoot>
                  )}
                </FastField>
                <FastField name={`revisionMeta.${index}.status`}>
                  {({ field, meta, form }: FieldProps) => (
                    <FieldRoot invalid={!!meta.error}>
                      <SwitchRoot
                        title={t("form.revisions.switchTooltip")}
                        checked={field.value === Revision.revised}
                        onCheckedChange={(details) => {
                          const status = details.checked ? Revision.revised : Revision.needsRevision;
                          form.setFieldValue(field.name, status);
                          if (status === Revision.revised) {
                            createMessage({
                              translationKey: "form.revisions.reminder",
                              severity: "info",
                              timeToLive: 0,
                            });
                          }
                        }}
                      >
                        <SwitchLabel srOnly>{t("form.revisions.switchTooltip")}</SwitchLabel>
                        <SwitchControl>
                          <SwitchThumb />
                        </SwitchControl>
                        <SwitchHiddenInput />
                      </SwitchRoot>
                    </FieldRoot>
                  )}
                </FastField>
                <IconButton
                  variant="danger"
                  aria-label={t("form.revisions.deleteTooltip")}
                  title={t("form.revisions.deleteTooltip")}
                  onClick={() => arrayHelpers.remove(index)}
                >
                  <DeleteBinLine />
                </IconButton>
              </FieldWrapper>
            </FieldsetRoot>
          ))}
          <StyledButton
            variant="secondary"
            onClick={() =>
              arrayHelpers.push({
                note: "",
                revisionDate: formatDateForBackend(addYears(new Date(), 5)),
                status: "needs-revision",
                new: true,
              })
            }
          >
            {t("form.revisions.add")}
          </StyledButton>
        </FieldsetRoot>
      )}
    />
  );
};

export default memo(RevisionNotes);
