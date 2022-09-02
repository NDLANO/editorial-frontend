/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import { spacing } from '@ndla/core';
import { Switch } from '@ndla/switch';
import styled from '@emotion/styled';
import RoundIcon from '../../../../components/RoundIcon';
import CustomFieldButton from '../sharedMenuOptions/components/CustomFieldButton';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from '../../../../constants';
import { StyledMenuItemEditField, StyledMenuItemInputField } from '../styles';

interface Props {
  customFields: Record<string, string>;
  updateFields: (newFields: Record<string, string>) => void;
}

const StyledCustomFieldButton = styled(CustomFieldButton)`
  margin-left: ${spacing.xxsmall};
`;

const ToggleExplanationSubject = ({ customFields, updateFields }: Props) => {
  const { t } = useTranslation();
  const isToggled =
    customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT]?.toLowerCase() === 'true';

  return (
    <>
      <StyledMenuItemEditField>
        <RoundIcon open small />
        <StyledMenuItemInputField
          placeholder={t('taxonomy.metadata.customFields.explanationSubject')}
          disabled
        />
        <Switch
          onChange={() =>
            updateFields({
              ...customFields,
              [TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT]: (!isToggled).toString(),
            })
          }
          checked={isToggled}
          label=""
          id={'explanationSubject'}
        />
        <StyledCustomFieldButton
          onClick={() => {
            delete customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT];
            updateFields({ ...customFields });
          }}>
          <DeleteForever />
        </StyledCustomFieldButton>
      </StyledMenuItemEditField>
    </>
  );
};

export default ToggleExplanationSubject;
