/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { IConcept, IStatus } from '@ndla/types-concept-api';
import { isFormikFormDirty } from '../../../util/formHelper';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import { AlertModalWrapper, formClasses, ActionButton } from '../../FormikForm';
import { ConceptFormValues } from '../conceptInterfaces';
import { useConceptStateMachine } from '../../../modules/concept/conceptQueries';

interface Props {
  entityStatus?: IStatus;
  conceptChanged: boolean;
  inModal?: boolean;
  savedToServer: boolean;
  isNewlyCreated: boolean;
  showSimpleFooter: boolean;
  onClose?: () => void;
  onContinue: () => void;
  getApiConcept?: () => IConcept;
}

const ConceptFormFooter = ({
  entityStatus,
  conceptChanged,
  inModal,
  savedToServer,
  isNewlyCreated,
  showSimpleFooter,
  onClose,
  onContinue,
  getApiConcept,
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

  return (
    <>
      {inModal ? (
        <Field right>
          <ActionButton outline onClick={onClose}>
            {t('form.abort')}
          </ActionButton>
          <SaveButton
            {...formClasses}
            isSaving={isSubmitting}
            formIsDirty={formIsDirty}
            showSaved={savedToServer && !formIsDirty}
            submit={!inModal}
            disabled={disableSave}
            onClick={(evt: { preventDefault: () => void }) => {
              evt.preventDefault();
              submitForm();
            }}
          />
        </Field>
      ) : (
        <EditorFooter
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getApiConcept}
          entityStatus={entityStatus}
          statusStateMachine={conceptStateMachine.data}
          showSimpleFooter={showSimpleFooter}
          onSaveClick={submitForm}
          hideSecondaryButton
          isConcept
          isNewlyCreated={isNewlyCreated}
          hasErrors={isSubmitting || !formIsDirty || disableSave}
        />
      )}
      {!inModal && (
        <AlertModalWrapper
          formIsDirty={formIsDirty}
          isSubmitting={isSubmitting}
          onContinue={onContinue}
          severity="danger"
          text={t('alertModal.notSaved')}
        />
      )}
    </>
  );
};

export default ConceptFormFooter;
