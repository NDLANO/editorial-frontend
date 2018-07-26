import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import {
  getElementOffset,
  getClientPos,
  getImageDimensions,
  getSrcSets,
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
    const { transformData } = this.props;
    const dimensions = getImageDimensions(target);
    const x = transformData['focal-x']
      ? (transformData['focal-x'] / 100) * dimensions.current.width
      : undefined;
    const y = transformData['focal-y']
      ? (transformData['focal-y'] / 100) * dimensions.current.height
      : undefined;

    this.setState({
      xMarkPos: x,
      yMarkPos: y,
      showMarker: (x && y) || false,
    });
  }

  render() {
    const { embed, transformData } = this.props;
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
              srcSet={getSrcSets(embed.resource_id, transformData)}
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
  transformData: PropTypes.shape({
    'upper-left-x': PropTypes.number,
    'upper-left-y': PropTypes.number,
    'lower-right-x': PropTypes.number,
    'lower-right-y': PropTypes.number,
    'focal-x': PropTypes.number,
    'focal-y': PropTypes.number,
  }),
};

export default ImageFocalPointEdit;
