/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from 'slate';
import { FormikContextType, useFormikContext } from 'formik';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { useSlateStatic } from 'slate-react';
import { defaultEmbedBlock } from '../embed/utils';
import { defaultFileBlock } from '../file/utils';
import VisualElementModalWrapper from '../../../../containers/VisualElement/VisualElementModalWrapper';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { TYPE_TABLE_CELL } from '../table/types';
import { Embed } from '../../../../interfaces';
import VisualElementSearch from '../../../../containers/VisualElement/VisualElementSearch';

export const checkboxAction = (
  image: IImageMetaInformationV3,
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

const getNewEmbed = (editor: Editor, visualElement: Embed, allowDecorative: boolean) => {
  const data = visualElement;
  if (data.resource === 'image') {
    const tableCell = getCurrentBlock(editor, TYPE_TABLE_CELL)?.[0];
    if (tableCell) {
      return defaultEmbedBlock(
        {
          ...data,
          size: 'xsmall',
          align: 'left',
        },
        allowDecorative,
      );
    }
  }
  return defaultEmbedBlock(visualElement, allowDecorative);
};

export const isEmbed = (visualElement: Embed | DOMStringMap[]): visualElement is Embed =>
  (visualElement as Embed)?.resource !== undefined;

interface Props {
  articleLanguage: string;
  resource: string;
  onVisualElementClose: () => void;
  onInsertBlock: (block: Element, selectBlock?: boolean) => void;
  isOpen: boolean;
  label?: string;
  allowDecorative?: boolean;
}

const SlateVisualElementPicker = ({
  articleLanguage,
  resource,
  onVisualElementClose,
  onInsertBlock,
  isOpen,
  label,
  allowDecorative = true,
}: Props) => {
  const formikContext = useFormikContext<{ metaImageAlt?: string; metaImageId?: string }>();
  const { values } = formikContext;
  const editor = useSlateStatic();

  const showCheckbox = values.metaImageAlt !== undefined && values.metaImageId !== undefined;

  const onVisualElementAdd = (visualElement: Embed | DOMStringMap[]) => {
    if (isEmbed(visualElement)) {
      const blockToInsert = getNewEmbed(editor, visualElement, allowDecorative);
      onInsertBlock(blockToInsert);
    } else {
      const blockToInsert = defaultFileBlock(visualElement);
      onInsertBlock(blockToInsert);
    }
    onVisualElementClose();
  };
  return (
    <>
      <VisualElementModalWrapper
        isOpen={isOpen}
        label={label}
        resource={resource}
        onClose={onVisualElementClose}
      >
        <VisualElementSearch
          articleLanguage={articleLanguage}
          selectedResource={resource}
          handleVisualElementChange={onVisualElementAdd}
          closeModal={onVisualElementClose}
          showCheckbox={showCheckbox}
          checkboxAction={(image: IImageMetaInformationV3) => checkboxAction(image, formikContext)}
        />
      </VisualElementModalWrapper>
    </>
  );
};

export default SlateVisualElementPicker;
