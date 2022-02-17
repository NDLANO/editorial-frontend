/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element } from 'slate';
import { FormikContextType, useFormikContext } from 'formik';
import { IImageMetaInformationV2 as ImageApiType } from '@ndla/types-image-api';
import VisualElementSearch, {
  VisualElementChangeReturnType,
} from '../../../../containers/VisualElement/VisualElementSearch';
import { defaultEmbedBlock } from '../embed/utils';
import { defaultFileBlock } from '../file/utils';
import VisualElementModalWrapper from '../../../../containers/VisualElement/VisualElementModalWrapper';

export const checkboxAction = (
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

  const showCheckbox = values.metaImageAlt !== undefined && values.metaImageId !== undefined;

  const onVisualElementAdd = (visualElement: VisualElementChangeReturnType) => {
    if (visualElement.type === 'embed') {
      const blockToInsert = defaultEmbedBlock(visualElement.value);
      onInsertBlock(blockToInsert);
    } else if (visualElement.type === 'file') {
      const blockToInsert = defaultFileBlock(visualElement.value);
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
          showCheckbox={showCheckbox}
          checkboxAction={(image: ImageApiType) => checkboxAction(image, formikContext)}
        />
      )}
    </VisualElementModalWrapper>
  );
};

export default SlateVisualElementPicker;
