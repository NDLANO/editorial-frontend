/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { PercentCrop } from "react-image-crop";
import styled from "@emotion/styled";
import ImageCropEdit from "./ImageCropEdit";
import ImageFocalPointEdit from "./ImageFocalPointEdit";
import { ImageEditFormValues } from "../../components/SlateEditor/plugins/embed/EditImage";
import { getSrcSets } from "../../util/imageEditorUtil";

const StyledImg = styled.img`
  min-width: -webkit-fill-available;
  min-width: -moz-available;
`;

interface Props {
  language: string;
  editType?: string;
  onFocalPointChange: (focalPoint: { x: number; y: number }) => void;
  onCropComplete: (crop: PercentCrop) => void;
  aspect?: number;
}

const ImageTransformEditor = ({ language, editType, onFocalPointChange, onCropComplete, aspect }: Props) => {
  const { values } = useFormikContext<ImageEditFormValues>();
  switch (editType) {
    case "focalPoint":
      return <ImageFocalPointEdit language={language} onFocalPointChange={onFocalPointChange} />;
    case "crop":
      return <ImageCropEdit language={language} onCropComplete={onCropComplete} aspect={aspect} />;
    default:
      return (
        <figure>
          <StyledImg alt={values.alt} srcSet={getSrcSets(values.resourceId, values, language)} />
        </figure>
      );
  }
};

export default ImageTransformEditor;
