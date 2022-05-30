/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Time } from '@ndla/icons/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertModal from '../../../../components/AlertModal';
import Overlay from '../../../../components/Overlay';
import RoundIcon from '../../../../components/RoundIcon';
import Spinner from '../../../../components/Spinner';
import { useCopyRevisionDates } from '../../../../modules/draft/draftMutations';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import { StyledErrorMessage } from '../styles';
import MenuItemButton from './components/MenuItemButton';

interface Props {
  editModeHandler: EditModeHandler;
  node: NodeType;
}

const CopyRevisionDate = ({ node, editModeHandler: { editMode, toggleEditMode } }: Props) => {
  const { t } = useTranslation();
  const { mutateAsync, isLoading } = useCopyRevisionDates();
  const [error, setError] = useState<string | undefined>(undefined);

  const toggleCopyRevisionDate = () => toggleEditMode('copyRevisionDate');

  const copyRevisionDate = async () => {
    setError(undefined);
    toggleCopyRevisionDate();
    await mutateAsync(
      { nodeId: node.id },
      { onError: () => setError(t('taxonomy.copyRevisionDates.error')) },
    );
  };

  return (
    <>
      <MenuItemButton stripped data-testid="setRevisionDate" onClick={toggleCopyRevisionDate}>
        <RoundIcon small icon={<Time />} />
        {t('taxonomy.copyRevisionDates.buttonText')}
      </MenuItemButton>
      <AlertModal
        show={editMode === 'copyRevisionDate'}
        actions={[
          {
            text: t('form.abort'),
            onClick: toggleCopyRevisionDate,
          },
          {
            text: t('alertModal.continue'),
            onClick: copyRevisionDate,
          },
        ]}
        onCancel={toggleCopyRevisionDate}
        text={t('taxonomy.copyRevisionDates.text')}
      />
      {isLoading && <Spinner appearance="absolute" />}
      {isLoading && <Overlay modifiers={['absolute', 'white-opacity', 'zIndex']} />}
      {error && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>
      )}
    </>
  );
};
export default CopyRevisionDate;
