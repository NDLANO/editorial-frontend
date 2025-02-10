/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DialogCloseTrigger, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IStatusDTO } from "@ndla/types-backend/concept-api";
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
  inModal?: boolean;
  savedToServer: boolean;
  isNewlyCreated: boolean;
  showSimpleFooter: boolean;
  responsibleId?: string;
}

const StyledFormActionsContainer = styled(FormActionsContainer, {
  base: {
    marginBlockStart: "xsmall",
  },
});

const ConceptFormFooter = ({
  entityStatus,
  conceptChanged,
  inModal,
  savedToServer,
  isNewlyCreated,
  showSimpleFooter,
  responsibleId,
}: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ConceptFormValues>();
  const conceptStateMachine = useConceptStateMachine();
  const [responsible, setResponsible] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>("IN_PROGRESS");
  const [updated, setUpdated] = useState<IStatusDTO>({ current: "IN_PROGRESS", other: [] });
  const { values, errors, initialValues, dirty, isSubmitting, submitForm, setFieldValue } = formikContext;
  const formIsDirty = isFormikFormDirty({
    values,
    initialValues,
    dirty,
    changed: conceptChanged,
  });

  const disableSave = Object.keys(errors).length > 0;

  const updateResponsible = useCallback(
    async (responsible: string | undefined) => {
      setResponsible(responsible);
      setFieldValue("responsibleId", responsible ? responsible : null);
    },
    [setFieldValue],
  );

  const updateStatus = useCallback(
    async (status: string | undefined) => {
      setStatus(status);
      setFieldValue("status", { current: status });
      setUpdated({ current: status ?? "IN_PROGRESS", other: [] });
    },
    [setFieldValue],
  );

  if (inModal) {
    return (
      <StyledFormActionsContainer>
        <FieldRoot key="status-select">
          <StatusSelect
            status={status}
            setStatus={setStatus}
            onSave={updateStatus}
            statusStateMachine={conceptStateMachine.data}
            entityStatus={entityStatus ?? updated}
          />
        </FieldRoot>
        <FieldRoot key="responsible-select">
          <ResponsibleSelect
            key="concept-modal-responsible-select"
            responsible={responsible}
            setResponsible={setResponsible}
            onSave={updateResponsible}
            responsibleId={responsibleId}
          />
        </FieldRoot>
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
        isNewlyCreated={isNewlyCreated}
        hasErrors={isSubmitting || !formIsDirty || disableSave}
        responsibleId={responsibleId}
      />
      <AlertDialogWrapper
        formIsDirty={formIsDirty}
        isSubmitting={isSubmitting}
        severity="danger"
        text={t("alertModal.notSaved")}
      />
    </>
  );
};

export default ConceptFormFooter;
