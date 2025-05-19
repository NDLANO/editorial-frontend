/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikContextType, useFormikContext } from "formik";
import { useCallback } from "react";
import { Editor, Element } from "slate";
import { useSlateStatic } from "slate-react";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import VisualElementDialogWrapper from "../../../../containers/VisualElement/VisualElementDialogWrapper";
import VisualElementSearch from "../../../../containers/VisualElement/VisualElementSearch";
import { Embed } from "../../../../interfaces";
import getCurrentBlock from "../../utils/getCurrentBlock";
import { defaultEmbedBlock } from "../embed/utils";
import { defaultFileBlock } from "../file/utils";
import { TABLE_CELL_ELEMENT_TYPE } from "../table/types";

export const checkboxAction = (
  image: IImageMetaInformationV3DTO,
  formikContext: FormikContextType<{
    metaImageId?: string;
    metaImageAlt?: string;
  }>,
) => {
  const { setFieldValue, setFieldTouched } = formikContext;

  if (setFieldValue && image) {
    setFieldValue("metaImageId", image.id || "", true);
    setFieldValue("metaImageAlt", image.alttext?.alttext.trim() || "", true);
    setFieldTouched("metaImageAlt", true, true);
    setFieldTouched("metaImageId", true, true);
  }
};

const getNewEmbed = (editor: Editor, visualElement: Embed) => {
  const data = visualElement;

  if (data.resource === "image") {
    const tableCell = getCurrentBlock(editor, TABLE_CELL_ELEMENT_TYPE)?.[0];
    if (tableCell) {
      return defaultEmbedBlock({ ...data, size: "xsmall", align: "left" });
    }
  }

  return defaultEmbedBlock(visualElement);
};

export const isEmbed = (visualElement: Embed | DOMStringMap[]): visualElement is Embed =>
  (visualElement as Embed)?.resource !== undefined;

interface Props {
  articleLanguage?: string;
  resource: string;
  onVisualElementClose: () => void;
  onInsertBlock: (block: Element, selectBlock?: boolean) => void;
  isOpen: boolean;
  label?: string;
}

const SlateVisualElementPicker = ({
  articleLanguage,
  resource,
  onVisualElementClose,
  onInsertBlock,
  isOpen,
  label,
}: Props) => {
  const formikContext = useFormikContext<{
    metaImageAlt?: string;
    metaImageId?: string;
  }>();
  const { values } = formikContext;
  const editor = useSlateStatic();

  const showCheckbox = values.metaImageAlt !== undefined && values.metaImageId !== undefined;

  const onVisualElementAdd = useCallback(
    (visualElement: Embed | DOMStringMap[]) => {
      if (isEmbed(visualElement)) {
        const blockToInsert = getNewEmbed(editor, visualElement);
        onInsertBlock(blockToInsert);
      } else {
        const blockToInsert = defaultFileBlock(visualElement);
        onInsertBlock(blockToInsert);
      }
      onVisualElementClose();
    },
    [editor, onInsertBlock, onVisualElementClose],
  );

  return (
    <VisualElementDialogWrapper isOpen={isOpen} label={label} resource={resource} onClose={onVisualElementClose}>
      <VisualElementSearch
        articleLanguage={articleLanguage}
        selectedResource={resource}
        handleVisualElementChange={onVisualElementAdd}
        closeDialog={onVisualElementClose}
        showCheckbox={showCheckbox}
        checkboxAction={(image: IImageMetaInformationV3DTO) => checkboxAction(image, formikContext)}
      />
    </VisualElementDialogWrapper>
  );
};

export default SlateVisualElementPicker;
