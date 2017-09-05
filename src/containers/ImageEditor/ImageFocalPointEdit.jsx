import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import {
  getElementOffset,
  getClientPos,
  getImageDimensions,
} from '../../util/imageEditorUtil';
import { EmbedShape } from '../../shapes';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});

class ImageFocalPointEdit extends React.Component {
  constructor() {
    super();
    this.onImageClick = this.onImageClick.bind(this);
    this.setXandY = this.setXandY.bind(this);
    this.state = {
      xMarkPos: undefined,
      yMarkPos: undefined,
      showMarker: false,
    };
  }

  onImageClick(evt) {
    evt.preventDefault();
    const imageOffset = getElementOffset(this.focalImg);
    const dimensions = getImageDimensions(this.focalImg);
    const clientPos = getClientPos(evt);

    const xPc = (clientPos.x - imageOffset.left) / dimensions.current.width;
    const yPc = (clientPos.y - imageOffset.top) / dimensions.current.height;
    this.setState(
      {
        showMarker: true,
        xMarkPos: clientPos.x - imageOffset.left,
        yMarkPos: clientPos.y - imageOffset.top,
      },
      () => {
        this.props.onFocalPointChange({
          x: xPc * 100,
          y: yPc * 100,
        });
      },
    );
  }
  setXandY(target) {
    const { embed } = this.props;
    const dimensions = getImageDimensions(target);
    const x = embed['focal-x']
      ? embed['focal-x'] / 100 * dimensions.current.width
      : undefined;
    const y = embed['focal-y']
      ? embed['focal-y'] / 100 * dimensions.current.height
      : undefined;

    this.setState({
      xMarkPos: x,
      yMarkPos: y,
      showMarker: (x && y) || false,
    });
  }

  render() {
    const { embed, src } = this.props;

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
              alt={embed.alt}
              ref={focalImg => {
                this.focalImg = focalImg;
              }}
              onLoad={e => this.setXandY(e.target)}
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
  embed: EmbedShape.isRequired,
  focalPoint: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  onFocalPointChange: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
};

export default ImageFocalPointEdit;
