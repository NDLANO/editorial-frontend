/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { MouseEvent, ReactEventHandler, useRef, useState } from "react";
import { styled } from "@ndla/styled-system/jsx";
import { ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { getClientPos, getElementOffset, getImageDimensions, getSrcSets } from "../imageEditorUtil";
import { ImageEmbedFormValues } from "../types";

const StyledFocalPointButton = styled("button", {
  base: {
    display: "block",
    cursor: "crosshair",
    minWidth: ["-webkit-fill-available", "-moz-available"],
  },
});

const StyledFocalPointMarker = styled("div", {
  base: {
    cursor: "crosshair",
    position: "absolute",
    background: "surface.brand.1",
    width: "xsmall",
    height: "xsmall",
    borderRadius: "full",
    border: "1px solid",
    borderColor: "surface.brand.1",
    marginInlineStart: "-3xsmall",
    marginBlockStart: "-3xsmall",
  },
});

const StyledFocalPointContainer = styled("div", {
  base: {
    position: "relative",
  },
});

interface Props {
  language: string;
  onFocalPointChange: (focalPoint: { x: number; y: number }) => void;
  image: ImageMetaInformationV3DTO;
}

type Marker = {
  xMarkPos?: number;
  yMarkPos?: number;
  showMarker: boolean;
};

const ImageFocalPointEdit = ({ language, onFocalPointChange, image }: Props) => {
  const { values } = useFormikContext<ImageEmbedFormValues>();
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

  const setXandY: ReactEventHandler<HTMLImageElement> = (event) => {
    const dimensions = getImageDimensions(event.currentTarget);
    const x = values.focalX ? (parseFloat(values.focalX) / 100) * dimensions.current.width : undefined;
    const y = values.focalY ? (parseFloat(values.focalY) / 100) * dimensions.current.height : undefined;
    setMarker({
      showMarker: (x !== undefined && y !== undefined) || false,
      xMarkPos: x,
      yMarkPos: y,
    });
  };

  const style = !marker.showMarker
    ? { display: "none" }
    : {
        top: `${marker.yMarkPos}px`,
        left: `${marker.xMarkPos}px`,
      };
  return (
    <div>
      <StyledFocalPointContainer>
        <StyledFocalPointButton type="button" onClick={onImageClick}>
          <img
            style={{ minWidth: "inherit" }}
            alt={values.alt}
            ref={focalImgRef}
            onLoad={setXandY}
            srcSet={getSrcSets(image.id, values, language)}
          />
        </StyledFocalPointButton>
        <StyledFocalPointMarker style={style} />
      </StyledFocalPointContainer>
    </div>
  );
};

export default ImageFocalPointEdit;
