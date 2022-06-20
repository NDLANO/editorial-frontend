/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from 'slate';
import { FormikContextType, useFormikContext } from 'formik';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { useSlateStatic } from 'slate-react';
import VisualElementSearch, {
  EmbedReturnType,
  VisualElementChangeReturnType,
} from '../../../../containers/VisualElement/VisualElementSearch';
import { defaultEmbedBlock } from '../embed/utils';
import { defaultFileBlock } from '../file/utils';
import VisualElementModalWrapper from '../../../../containers/VisualElement/VisualElementModalWrapper';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { TYPE_TABLE_CELL } from '../table/types';

export const checkboxAction = (
  image: IImageMetaInformationV2,
  formikContext: FormikContextType<{ metaImageId?: string; metaImageAlt?: string }>,
) => {
  const { setFieldValue, setFieldTouched } = formikContext;

  if (setFieldValue && image) {
    setFieldValue('metaImageId', image.id || '', true);
    setFieldValue('metaImageAlt', image.alttext?.alttext.trim() || '', true);
    setFieldTouched('metaImageAlt', true, true);
    setFieldTouched('metaImageId', true, true);
  }
};

const getNewEmbed = (editor: Editor, visualElement: EmbedReturnType) => {
  const data = visualElement.value;

  if (data.resource === 'image') {
    const tableCell = getCurrentBlock(editor, TYPE_TABLE_CELL)?.[0];
    if (tableCell) {
      return defaultEmbedBlock({ ...data, size: 'xsmall', align: 'left' });
    }
  }

  return defaultEmbedBlock(visualElement.value);
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
  const editor = useSlateStatic();

  const showCheckbox = values.metaImageAlt !== undefined && values.metaImageId !== undefined;

  const onVisualElementAdd = (visualElement: VisualElementChangeReturnType) => {
    if (visualElement.type === 'embed') {
      const blockToInsert = getNewEmbed(editor, visualElement);
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
          checkboxAction={(image: IImageMetaInformationV2) => checkboxAction(image, formikContext)}
        />
      )}
    </VisualElementModalWrapper>
  );
};

export default SlateVisualElementPicker;
