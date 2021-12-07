import { Element } from 'slate';
import { FormikContextType, useFormikContext } from 'formik';
import VisualElementSearch from '../../../../containers/VisualElement/VisualElementSearch';
import { defaultEmbedBlock } from '../embed/utils';
import { defaultFileBlock } from '../file/utils';
import VisualElementModalWrapper from '../../../../containers/VisualElement/VisualElementModalWrapper';
import { Embed } from '../../../../interfaces';
import { ImageApiType } from '../../../../modules/image/imageApiInterfaces';

export const onSaveAsMetaImage = (
  image: ImageApiType,
  formikContext: FormikContextType<{ metaImageId?: string; metaImageAlt?: string }>,
) => {
  const { setFieldValue } = formikContext;

  if (setFieldValue && image) {
    setTimeout(() => {
      setFieldValue('metaImageId', image.id || '');
      setFieldValue('metaImageAlt', image.alttext?.alttext || '');
    }, 0);
  }
};

interface Props {
  articleLanguage: string;
  resource: string;
  onVisualElementClose: () => void;
  onInsertBlock: (block: Element, selectBlock?: boolean) => void;
}
const SlateVisualElementPicker = ({
  articleLanguage,
  resource,
  onVisualElementClose,
  onInsertBlock,
}: Props) => {
  const formikContext = useFormikContext<{ metaImageAlt?: string; metaImageId?: string }>();
  const { values } = formikContext;

  const showMetaImageCheckbox =
    values.metaImageAlt !== undefined && values.metaImageId !== undefined;

  const onVisualElementAdd = (visualElement: Partial<Embed> | DOMStringMap[], type = 'embed') => {
    if (type === 'embed') {
      const blockToInsert = defaultEmbedBlock(visualElement as Partial<Embed>);
      onInsertBlock(blockToInsert);
    } else if (type === 'file') {
      const blockToInsert = defaultFileBlock(visualElement as DOMStringMap[]);
      onInsertBlock(blockToInsert);
    }
    onVisualElementClose();
  };
  return (
    <VisualElementModalWrapper resource={resource} isOpen onClose={onVisualElementClose}>
      {setH5pFetchFail => (
        <VisualElementSearch
          articleLanguage={articleLanguage}
          selectedResource={resource}
          handleVisualElementChange={onVisualElementAdd}
          closeModal={onVisualElementClose}
          setH5pFetchFail={setH5pFetchFail}
          showMetaImageCheckbox={showMetaImageCheckbox}
          onSaveAsMetaImage={image => onSaveAsMetaImage(image, formikContext)}
        />
      )}
    </VisualElementModalWrapper>
  );
};

export default SlateVisualElementPicker;
