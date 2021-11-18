import { useState, KeyboardEvent } from 'react';

import { spacing } from '@ndla/core';
import { css } from '@emotion/core';
import { DeleteForever, Done } from '@ndla/icons/editor';
import { StyledMenuItemEditField, StyledMenuItemInputField } from '../styles';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemSaveButton from './MenuItemSaveButton';
import { TaxonomyMetadata } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

interface Props {
  fieldKey: string;
  onSubmit: Function;
  initialVal?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  dataTestid?: string;
}

const ConstantMetaField = ({
  onSubmit,
  keyPlaceholder,
  valuePlaceholder,
  initialVal = '',
  dataTestid,
  fieldKey,
}: Props) => {
  const [currentVal, setCurrentVal] = useState<string | undefined>();

  const handleSubmit = () => {
    const newPair: Record<string, string> = {};
    if (initialVal !== currentVal && !!currentVal) {
      newPair[fieldKey] = currentVal;
      onSubmit((prevState: TaxonomyMetadata['customFields']) => ({ ...prevState, ...newPair }));
    }
  };

  const handleDelete = () => {
    onSubmit((prevState: TaxonomyMetadata['customFields']) => {
      delete prevState[fieldKey];
      return { ...prevState };
    });
    setCurrentVal('');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <StyledMenuItemEditField>
      <RoundIcon open small />
      <StyledMenuItemInputField placeholder={keyPlaceholder ?? fieldKey} disabled />
      <StyledMenuItemInputField
        type="text"
        placeholder={valuePlaceholder}
        value={currentVal ?? initialVal}
        data-testid={dataTestid}
        onChange={e => setCurrentVal(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <MenuItemSaveButton onClick={handleSubmit} data-testid={'CustomFieldSaveButton'}>
        <Done className="c-icon--small" />
      </MenuItemSaveButton>
      <MenuItemSaveButton
        onClick={handleDelete}
        css={css`
          margin-left: ${spacing.xxsmall};
        `}>
        <DeleteForever />
      </MenuItemSaveButton>
    </StyledMenuItemEditField>
  );
};

export default ConstantMetaField;
