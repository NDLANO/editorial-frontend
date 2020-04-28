/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useState } from 'react';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { updateSubjectMetadata } from '../../../../modules/taxonomy';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './MenuItemButton';

// {
//   "grepCodes": [
//     "string"
//   ],
//   "visible": true
// }

interface Props {
  name: string;
  metadata: { grepCodes: string[]; visible: boolean };
}

const ToggleSubjectMetadataVisibility: FC<Props> = ({ name, metadata }) => {
  const [isVisible, setIsVisible] = useState(metadata.visible);
  const [editMode, setEditMode] = useState(false);

  const printHello = () => {
    console.log('hello');
    metadata !== undefined && console.log(metadata);
  };

  // api-kall for å toggle visibility
  const updateMetadata = async (isVisible: boolean) => {
    const put = await updateSubjectMetadata({
      grepCodes: metadata.grepCodes,
      visible: !isVisible,
    });
    setIsVisible(!isVisible);
  };

  // hook for å trigge api-kallet

  return (
    <MenuItemButton
      stripped
      data-testid="changeSubjectNameButton"
      onClick={console.log('TODO: change editMode')}>
      <RoundIcon small icon={<Pencil />} />
      Endre synlighet til {name ? name : '...'}
    </MenuItemButton>
  );
};

export default injectT(ToggleSubjectMetadataVisibility);
