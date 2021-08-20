/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import CustomFieldComponent from './CustomFieldComponent';

interface Props {
  key: string;
  initialVal?: string;
  updateFields: (newFields: Record<string, string>) => void;
}

const ConstantMetaField = ({ key, initialVal, updateFields }: Props) => {
  return (
    <CustomFieldComponent
      initialVal={initialVal}
      initialKey={key}
      constantKey={true}
      onSubmit={newFields => updateFields(newFields)}
    />
  );
};

export default ConstantMetaField;
