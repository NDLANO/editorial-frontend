import VisualElementSearch from '../../../containers/VisualElement/VisualElementSearch';
import VisualElementModalWrapper from '../../../containers/VisualElement/VisualElementModalWrapper';
import { Embed, ExternalEmbed, H5pEmbed } from '../../../interfaces';

interface Props {
  src: string;
  type: string;
  onEditEmbed: (embed: Embed) => void;
  onClose: () => void;
  embed: H5pEmbed | ExternalEmbed;
  isEditMode: boolean;
  allowedProvider: {
    height?: string;
    name: string;
    url: string[];
  };
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
  if (!isEditMode) {
    return null;
  }
  return (
    <VisualElementModalWrapper
      resource={allowedProvider.name.toLowerCase()}
      isOpen={isEditMode}
      onClose={onClose}>
      {setH5pFetchFail => (
        <VisualElementSearch
          selectedResource={allowedProvider.name}
          selectedResourceUrl={src}
          selectedResourceType={type}
          handleVisualElementChange={rt => (rt.type === 'embed' ? onEditEmbed(rt.value) : null)}
          closeModal={onClose}
          embed={embed}
          setH5pFetchFail={setH5pFetchFail}
        />
      )}
    </VisualElementModalWrapper>
  );
};

export default DisplayExternalModal;
