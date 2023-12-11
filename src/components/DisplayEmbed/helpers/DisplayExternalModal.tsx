/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import VisualElementModalWrapper from '../../../containers/VisualElement/VisualElementModalWrapper';
import VisualElementSearch from '../../../containers/VisualElement/VisualElementSearch';
import { Embed, ExternalEmbed, H5pEmbed, WhitelistProvider } from '../../../interfaces';
import { isEmbed } from '../../SlateEditor/plugins/blockPicker/SlateVisualElementPicker';

interface Props {
  src: string;
  type: string;
  onEditEmbed: (embed: Embed) => void;
  onClose: () => void;
  embed: H5pEmbed | ExternalEmbed;
  isEditMode: boolean;
  allowedProvider: WhitelistProvider;
}

const DisplayExternalModal = ({
  isEditMode,
  allowedProvider,
  onEditEmbed,
  onClose,
  type,
  embed,
  src,
}: Props) => {
  const { t } = useTranslation();
  if (!isEditMode) {
    return null;
  }
  return (
    <VisualElementModalWrapper
      label={t('form.external.edit', { type: 'iframe' })}
      resource={allowedProvider.name.toLowerCase()}
      isOpen={isEditMode}
      onClose={onClose}
    >
      <VisualElementSearch
        selectedResource={allowedProvider.name}
        selectedResourceUrl={src}
        selectedResourceType={type}
        handleVisualElementChange={(rt) => (isEmbed(rt) ? onEditEmbed(rt) : null)}
        closeModal={onClose}
        embed={embed}
      />
    </VisualElementModalWrapper>
  );
};

export default DisplayExternalModal;
