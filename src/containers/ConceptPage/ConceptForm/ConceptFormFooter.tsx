/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { Button, DialogCloseTrigger, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IStatusDTO } from "@ndla/types-backend/concept-api";
import { FormField } from "../../../components/FormField";
import { FormActionsContainer } from "../../../components/FormikForm";
import SaveButton from "../../../components/SaveButton";
import EditorFooter from "../../../components/SlateEditor/EditorFooter";
import { SAVE_BUTTON_ID } from "../../../constants";
import ResponsibleSelect from "../../../containers/FormikForm/components/ResponsibleSelect";
import StatusSelect from "../../../containers/FormikForm/components/StatusSelect";
import { useConceptStateMachine } from "../../../modules/concept/conceptQueries";
import { isFormikFormDirty } from "../../../util/formHelper";
import { AlertDialogWrapper } from "../../FormikForm";
import { ConceptFormValues } from "../conceptInterfaces";

interface Props {
  entityStatus?: IStatusDTO;
  conceptChanged: boolean;
  inDialog?: boolean;
  savedToServer: boolean;
  showSimpleFooter: boolean;
}

const StyledFormActionsContainer = styled(FormActionsContainer, {
  base: {
    marginBlockStart: "xsmall",
  },
});

const ConceptFormFooter = ({ entityStatus, conceptChanged, inDialog, savedToServer, showSimpleFooter }: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ConceptFormValues>();
  const conceptStateMachine = useConceptStateMachine();
  const { values, errors, initialValues, dirty, isSubmitting, submitForm } = formikContext;
  const formIsDirty = isFormikFormDirty({
    values,
    initialValues,
    dirty,
    changed: conceptChanged,
  });

  const disableSave = Object.keys(errors).length > 0;

  if (inDialog) {
    return (
      <StyledFormActionsContainer>
        <FormField name="status">
          {({ field, helpers }) => (
            <FieldRoot>
              <StatusSelect
                status={field.value}
                updateStatus={(value) => helpers.setValue({ current: value })}
                statusStateMachine={conceptStateMachine.data}
                entityStatus={entityStatus ?? field.value}
              />
            </FieldRoot>
          )}
        </FormField>
        <FormField name="responsibleId">
          {({ field, helpers }) => (
            <FieldRoot>
              <ResponsibleSelect responsible={field.value} onSave={(value) => helpers.setValue(value ?? null)} />
            </FieldRoot>
          )}
        </FormField>
        <DialogCloseTrigger asChild>
          <Button variant="secondary">{t("form.abort")}</Button>
        </DialogCloseTrigger>
        <SaveButton
          id={SAVE_BUTTON_ID}
          type={"button"}
          loading={isSubmitting}
          formIsDirty={formIsDirty}
          showSaved={!!savedToServer && !formIsDirty}
          disabled={disableSave}
          onClick={(evt: { preventDefault: () => void }) => {
            evt.preventDefault();
            submitForm();
          }}
        />
      </StyledFormActionsContainer>
    );
  }

  return (
    <>
      <EditorFooter
        formIsDirty={formIsDirty}
        savedToServer={savedToServer}
        entityStatus={entityStatus}
        statusStateMachine={conceptStateMachine.data}
        showSimpleFooter={showSimpleFooter}
        onSaveClick={submitForm}
        hideSecondaryButton
        isConcept
        hasErrors={isSubmitting || !formIsDirty || disableSave}
      />
      <AlertDialogWrapper
        formIsDirty={formIsDirty}
        isSubmitting={isSubmitting}
        severity="danger"
        text={t("alertDialog.notSaved")}
      />
    </>
  );
};

export default ConceptFormFooter;
