import { Check } from '@ndla/icons/lib/editor';
import Tooltip from '@ndla/tooltip';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RoundIcon from '../../../../components/RoundIcon';
import { TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH } from '../../../../constants';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { useUpdateNodeMetadataMutation } from '../../../../modules/nodes/nodeMutations';
import MenuItemButton from './components/MenuItemButton';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { EditModeHandler } from '../SettingsMenuDropdownType';

interface Props {
  node: NodeType;
  editModeHandler: EditModeHandler;
  rootNodeId: string;
}
const RequestNodePublish = ({ node, rootNodeId }: Props) => {
  const [hasRequested, setHasRequested] = useState<string | undefined>(
    node.metadata.customFields[TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH],
  );
  const { id, metadata } = node;
  const { taxonomyVersion } = useTaxonomyVersion();

  const updateMetadata = useUpdateNodeMetadataMutation();

  const togglePublish = async () => {
    if (hasRequested) {
      delete metadata.customFields[TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH];
    } else {
      metadata.customFields[TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH] = 'true';
    }
    await updateMetadata.mutateAsync({
      id,
      metadata,
      rootId: rootNodeId !== node.id ? rootNodeId : undefined,
      taxonomyVersion: 'default',
    });
    setHasRequested(metadata.customFields[TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH]);
  };

  const { t } = useTranslation();
  return (
    <Tooltip
      disabled={taxonomyVersion === 'default'}
      tooltip={t('taxonomy.metadata.customFields.requestVersionError')}>
      <MenuItemButton
        stripped
        data-testid="requestPublish"
        onClick={togglePublish}
        disabled={taxonomyVersion !== 'default'}>
        <RoundIcon small icon={<Check />} />
        {t(
          hasRequested
            ? 'taxonomy.metadata.customFields.cancelPublishRequest'
            : 'taxonomy.metadata.customFields.requestPublish',
        )}
      </MenuItemButton>
    </Tooltip>
  );
};

export default RequestNodePublish;
