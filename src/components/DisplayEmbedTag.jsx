/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import config from '../config';

export default class DisplayEmbedTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = { embed: undefined };
    this.handleFetchImage = this.handleFetchImage.bind(this);
  }

  componentWillMount() {
    this.handleFetchImage(this.props.embedTag);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.embedTag.id !== this.props.embedTag.id) {
      this.handleFetchImage(nextProps.embedTag);
    }
  }

  handleFetchImage(embedTag) {
    if (!embedTag || embedTag.resource !== 'image') {
      return;
    }

    this.setState(() => ({
      embed: {
        ...embedTag,
        src: `${config.ndlaApiUrl}/image-api/raw/id/${embedTag.id}`,
      },
    }));
  }

  render() {
    const { embed } = this.state;
    const { embedTag } = this.props;
    if (!embed) {
      return null;
    }

    return (
      <figure>
        <img src={embed.src} alt={embedTag.alt} />
        <figcaption>
          {embedTag.caption}
        </figcaption>
      </figure>
    );
  }
}

DisplayEmbedTag.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
};
