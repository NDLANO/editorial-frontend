/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IStatus } from "@ndla/types-backend/concept-api";
import { FormActionsContainer } from "../../../components/FormikForm";
import SaveButton from "../../../components/SaveButton";
import EditorFooter from "../../../components/SlateEditor/EditorFooter";
import { SAVE_BUTTON_ID } from "../../../constants";
import { useConceptStateMachine } from "../../../modules/concept/conceptQueries";
import { isFormikFormDirty } from "../../../util/formHelper";
import { AlertDialogWrapper } from "../../FormikForm";
import { ConceptFormValues } from "../conceptInterfaces";

interface Props {
  entityStatus?: IStatus;
  conceptChanged: boolean;
  inModal?: boolean;
  savedToServer: boolean;
  isNewlyCreated: boolean;
  showSimpleFooter: boolean;
  onClose?: () => void;
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
  onClose,
  responsibleId,
}: Props) => {
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

  if (inModal) {
    return (
      <StyledFormActionsContainer>
        <Button variant="secondary" onClick={onClose}>
          {t("form.abort")}
        </Button>
        <SaveButton
          id={SAVE_BUTTON_ID}
          type={!inModal ? "submit" : "button"}
          loading={isSubmitting}
          formIsDirty={formIsDirty}
          showSaved={savedToServer && !formIsDirty}
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
