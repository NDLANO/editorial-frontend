/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { MouseEvent, useRef, useState } from "react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { ImageEditFormValues } from "../../components/SlateEditor/plugins/embed/EditImage";
import { getElementOffset, getClientPos, getImageDimensions, getSrcSets } from "../../util/imageEditorUtil";

const StyledFocalPointButton = styled(ButtonV2)`
  display: block;
  cursor: crosshair;
  min-width: -webkit-fill-available;
  min-width: -moz-available;
`;

const StyledFocalPointMarker = styled("div")`
  cursor: crosshair;
  position: absolute;
  background-color: ${colors.brand.secondary};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid ${colors.brand.secondary};
  margin-left: -5px;
  margin-top: -5px;
`;
const StyledFocalPointContainer = styled("div")`
  position: relative;
`;

interface Props {
  language: string;
  onFocalPointChange: (focalPoint: { x: number; y: number }) => void;
}

type Marker = {
  xMarkPos?: number;
  yMarkPos?: number;
  showMarker: boolean;
};

const ImageFocalPointEdit = ({ language, onFocalPointChange }: Props) => {
  const { values } = useFormikContext<ImageEditFormValues>();
  const focalImgRef = useRef<HTMLImageElement | null>(null);
  const [marker, setMarker] = useState<Marker>({
    showMarker: false,
  });

  const onImageClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (focalImgRef.current) {
      const imageOffset = getElementOffset(focalImgRef.current);
      const dimensions = getImageDimensions(focalImgRef.current);
      const clientPos = getClientPos(evt);

      const xPc = (clientPos.x - imageOffset.left) / dimensions.current.width;
      const yPc = (clientPos.y - imageOffset.top) / dimensions.current.height;
      setMarker({
        showMarker: true,
        xMarkPos: clientPos.x - imageOffset.left,
        yMarkPos: clientPos.y - imageOffset.top,
      });
      onFocalPointChange({
        x: xPc * 100,
        y: yPc * 100,
      });
    }
  };

  const setXandY = (target: HTMLImageElement) => {
    const dimensions = getImageDimensions(target);
    const x = values.focalX ? (parseInt(values.focalX) / 100) * dimensions.current.width : undefined;
    const y = values.focalY ? (parseInt(values.focalY) / 100) * dimensions.current.height : undefined;
    setMarker({
      showMarker: (x !== undefined && y !== undefined) || false,
      xMarkPos: x,
      yMarkPos: y,
    });
  };

  const style = marker.showMarker
    ? { display: "none" }
    : {
        top: `${marker.yMarkPos}px`,
        left: `${marker.xMarkPos}px`,
      };
  return (
    <div>
      <StyledFocalPointContainer>
        <StyledFocalPointButton variant="stripped" onClick={onImageClick}>
          <img
            style={{ minWidth: "inherit" }}
            alt={values.alt}
            ref={focalImgRef}
            onLoad={(e) => setXandY(e.target as HTMLImageElement)}
            srcSet={getSrcSets(values.resourceId, values, language)}
          />
        </StyledFocalPointButton>
        <StyledFocalPointMarker style={style} />
      </StyledFocalPointContainer>
    </div>
  );
};

export default ImageFocalPointEdit;
