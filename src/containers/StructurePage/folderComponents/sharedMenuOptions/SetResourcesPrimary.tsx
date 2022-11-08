/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Pencil } from '@ndla/icons/action';
import { useTaxonomyVersion } from 'containers/StructureVersion/TaxonomyVersionProvider';
import { usePutResourcesPrimaryMutation } from 'modules/nodes/nodeMutations';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertModal from '../../../../components/AlertModal';
import Overlay from '../../../../components/Overlay';
import RoundIcon from '../../../../components/RoundIcon';
import Spinner from '../../../../components/Spinner';
import { ChildNodeType, NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { createGuard } from '../../../../util/guards';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import { StyledErrorMessage } from '../styles';
import MenuItemButton from './components/MenuItemButton';

interface Props {
  editModeHandler: EditModeHandler;
  nodeChildren: NodeType[];
}

const isChildNode = createGuard<ChildNodeType>('connectionId');

const isNotPrimary = (nc: NodeType ) => {
  if (isChildNode(nc)){
   return !nc.isPrimary
  }
}

const SetResourcesPrimary = ({
  nodeChildren,
  editModeHandler: { editMode, toggleEditMode },
}: Props) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>(undefined);
  const { mutateAsync, isLoading } = usePutResourcesPrimaryMutation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const toggleConnectedResourcesPrimary = () => toggleEditMode('setResourcesPrimary');

  const setConnectedResourcesPrimary = async () => {
    setError(undefined);
    toggleConnectedResourcesPrimary();

    await Promise.allSettled(
      nodeChildren.filter(nc => isNotPrimary(nc)).map(item =>
        mutateAsync(
          { taxonomyVersion, id: item.id },
          { onError: () => setError(t('taxonomy.resourcesPrimary.error')) },
        ),
      ),
    );
  };

  return (
    <>
      <MenuItemButton
        stripped
        data-testid="setRevisionDate"
        onClick={toggleConnectedResourcesPrimary}>
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.resourcesPrimary.buttonText')}
      </MenuItemButton>
      <AlertModal
        show={editMode === 'setResourcesPrimary'}
        actions={[
          {
            text: t('form.abort'),
            onClick: toggleConnectedResourcesPrimary,
          },
          {
            text: t('alertModal.continue'),
            onClick: setConnectedResourcesPrimary,
          },
        ]}
        onCancel={toggleConnectedResourcesPrimary}
        text={t('taxonomy.resourcesPrimary.text')}
      />
      {isLoading && <Spinner appearance="absolute" />}
      {isLoading && <Overlay modifiers={['absolute', 'white-opacity', 'zIndex']} />}
      {error && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>
      )}
    </>
  );
};

export default SetResourcesPrimary;
