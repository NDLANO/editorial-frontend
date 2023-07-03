/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import styled from '@emotion/styled';
import { IConcept, IStatus } from '@ndla/types-backend/concept-api';
import { spacing } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { isFormikFormDirty } from '../../../util/formHelper';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import SaveButton from '../../../components/SaveButton';
import { AlertModalWrapper } from '../../FormikForm';
import { ConceptFormValues } from '../../ConceptPage/conceptInterfaces';
import { useConceptStateMachine } from '../../../modules/concept/conceptQueries';

interface Props {
  entityStatus?: IStatus;
  conceptChanged: boolean;
  inModal?: boolean;
  savedToServer: boolean;
  isNewlyCreated: boolean;
  showSimpleFooter: boolean;
  onClose?: () => void;
  getApiConcept?: () => IConcept;
  responsibleId?: string;
}

const ButtonContainer = styled.div`
  margin-top: ${spacing.small};
  display: flex;
  gap: ${spacing.xsmall};
  justify-content: flex-end;
`;

const ConceptFormFooter = ({
  entityStatus,
  conceptChanged,
  inModal,
  savedToServer,
  isNewlyCreated,
  showSimpleFooter,
  onClose,
  getApiConcept,
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

  return (
    <>
      {inModal ? (
        <ButtonContainer>
          <ButtonV2 variant="outline" onClick={onClose}>
            {t('form.abort')}
          </ButtonV2>
          <SaveButton
            type={!inModal ? 'submit' : 'button'}
            isSaving={isSubmitting}
            formIsDirty={formIsDirty}
            showSaved={savedToServer && !formIsDirty}
            disabled={disableSave}
            onClick={(evt: { preventDefault: () => void }) => {
              evt.preventDefault();
              submitForm();
            }}
          />
        </ButtonContainer>
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
          responsibleId={responsibleId}
        />
      )}
      {!inModal && (
        <AlertModalWrapper
          formIsDirty={formIsDirty}
          isSubmitting={isSubmitting}
          severity="danger"
          text={t('alertModal.notSaved')}
        />
      )}
    </>
  );
};

export default ConceptFormFooter;
