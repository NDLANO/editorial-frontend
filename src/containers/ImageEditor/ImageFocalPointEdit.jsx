import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import {
  getElementOffset,
  getClientPos,
  getImageDimensions,
} from '../../util/imageEditorUtil';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});

class ImageFocalPointEdit extends React.Component {
  constructor() {
    super();
    this.onImageClick = this.onImageClick.bind(this);
    this.state = {
      xMarkPos: undefined,
      yMarkPos: undefined,
      showMarker: false,
    };
  }

  onImageClick(evt) {
    const imageOffset = getElementOffset(this.focalImg);
    const dimensions = getImageDimensions(this.focalImg);
    const clientPos = getClientPos(evt);

    const xPc = (clientPos.x - imageOffset.left) / dimensions.current.width;
    const yPc = (clientPos.y - imageOffset.top) / dimensions.current.height;
    const naturalX = Math.round(dimensions.natural.width * xPc);
    const naturalY = Math.round(dimensions.natural.height * yPc);

    this.props.onFocalPointChange({
      x: naturalX > 0 ? naturalX : 0,
      y: naturalY > 0 ? naturalY : 0,
    });
    this.setState({
      showMarker: true,
      xMarkPos: clientPos.x - imageOffset.left,
      yMarkPos: clientPos.y - imageOffset.top,
    });
  }

  render() {
    const { embedTag } = this.props;
    const src = `${window.config.ndlaApiUrl}/image-api/raw/id/${embedTag.id}`;
    const style = !this.state.showMarker
      ? { display: 'none' }
      : {
          top: `${this.state.yMarkPos}px`,
          left: `${this.state.xMarkPos}px`,
        };
    return (
      <div>
        <div {...classes('focal-point-container')}>
          <Button
            stripped
            onClick={this.onImageClick}
            {...classes('focal-point')}>
            <img
              alt={embedTag.alt}
              ref={focalImg => {
                this.focalImg = focalImg;
              }}
              src={src}
            />
          </Button>
          <div {...classes('focal-point-marker')} style={style} />
        </div>
      </div>
    );
  }
}

ImageFocalPointEdit.propTypes = {
  embedTag: PropTypes.shape({
    id: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  }),
  focalPoint: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  onFocalPointChange: PropTypes.func.isRequired,
};

export default ImageFocalPointEdit;
