/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID } from '../../../../constants';
import CustomFieldComponent from './CustomFieldComponent';

interface Props {
  updateFields: (newFields: Record<string, string>) => void;
  initialVal?: string;
}

const EditOldSubjectId = ({ updateFields, initialVal }: Props) => {
  return (
    <CustomFieldComponent
      initialVal={initialVal}
      initialKey={TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID}
      constantKey={true}
      onSubmit={newFields => updateFields(newFields)}
    />
  );
};

export default EditOldSubjectId;
