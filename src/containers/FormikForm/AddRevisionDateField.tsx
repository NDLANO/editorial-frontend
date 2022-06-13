/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent } from 'react';
import Button from '@ndla/button';
import { Input, FieldRemoveButton } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import { FieldInputProps } from 'formik';
import { colors, spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { Switch } from '@ndla/switch';
import Tooltip from '@ndla/tooltip';
import { ArticleFormType } from './articleFormHooks';
import InlineDatePicker from './components/InlineDatePicker';
import { formatDateForBackend } from '../../util/formatDate';

type RevisionMetaFormType = ArticleFormType['revisionMeta'];

interface Props {
  formikField: FieldInputProps<RevisionMetaFormType>;
  name: string;
  placeholder?: string;
  onChange: Function;
  value: string[];
  showError?: boolean;
}

const Wrapper = styled.div`
  margin-bottom: ${spacing.small};
  display: flex;
  > div {
    &:first-of-type {
      + div {
        padding-left: ${spacing.normal};
      }
    }
  }
  &:empty {
    margin: 0;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const StyledSwitch = styled(Switch)`
  outline: none;
`;

const StyledTooltip = styled(Tooltip)<{ hide?: boolean }>`
  height: ${spacing.large};
  visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')};
  display: flex;
  align-items: center;
`;

const StyledRemoveButton = styled(FieldRemoveButton)<{ visible?: boolean }>`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  height: 100%;
  padding-top: 0;
  .c-icon {
    fill: ${colors.support.red};
  }
`;

const AddRevisionDateField = ({ formikField, showError }: Props) => {
  const { t } = useTranslation();
  type RevisionMetaType = typeof formikField.value[number];
  const onRevisionChange = (newMetas: RevisionMetaFormType) => {
    formikField.onChange({
      target: {
        value: newMetas,
        name: formikField.name,
      },
    });
  };
  const addRevision = () => {
    onRevisionChange([
      ...formikField.value,
      {
        note: '',
        revisionDate: formatDateForBackend(
          new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
        ),
        status: 'needs-revision',
        new: true,
      },
    ]);
  };

  const removeRevision = (idx: number) => {
    const withoutIdx = formikField.value.filter((_, index) => index !== idx);
    onRevisionChange(withoutIdx);
  };

  return (
    <>
      {formikField.value.map((revisionMeta, index) => {
        const editRevision = (editFunction: (old: RevisionMetaType) => RevisionMetaType) => {
          const newRevisions = [...formikField.value];
          newRevisions[index] = editFunction(newRevisions[index]);
          onRevisionChange(newRevisions);
        };
        return (
          <div key={`revision_${index}`}>
            <Wrapper>
              <InputWrapper>
                <Input
                  warningText={
                    showError && revisionMeta.note === '' ? t('validation.noEmptyRevision') : ''
                  }
                  container="div"
                  placeholder={t('form.revisions.inputPlaceholder')}
                  type="text"
                  focusOnMount
                  value={revisionMeta.note}
                  data-testid="revisionInput"
                  onChange={(e: FormEvent<HTMLInputElement>) => {
                    editRevision(old => ({ ...old, note: e.currentTarget.value }));
                  }}
                  white
                />
              </InputWrapper>
              <StyledTooltip tooltip={t('form.revisions.datePickerTooltip')}>
                <InlineDatePicker
                  value={revisionMeta.revisionDate}
                  name={`revision_date_${index}`}
                  onChange={date => {
                    editRevision(old => ({ ...old, revisionDate: date.target.value }));
                  }}
                />
              </StyledTooltip>
              <StyledTooltip tooltip={t('form.revisions.switchTooltip')}>
                <StyledSwitch
                  checked={revisionMeta.status === 'revised'}
                  onChange={e => {
                    const status = e.currentTarget.checked ? 'revised' : 'needs-revision';
                    editRevision(old => ({ ...old, status }));
                  }}
                  label={''}
                  id={`revision_switch_${index}`}
                />
              </StyledTooltip>
              <StyledTooltip tooltip={t('form.revisions.deleteTooltip')}>
                <StyledRemoveButton stripped visible onClick={() => removeRevision(index)} />
              </StyledTooltip>
            </Wrapper>
          </div>
        );
      })}
      <Button outline onClick={addRevision} data-testid="addRevision">
        {t('form.revisions.add')}
      </Button>
    </>
  );
};

export default AddRevisionDateField;
