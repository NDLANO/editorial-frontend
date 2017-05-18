/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { fetchImage } from '../containers/ImageSearch/imageApi';

const parseEmbedTag = (embedTag) => {
  if (embedTag === '') {
    return undefined;
  }

  const el = document.createElement('html');
  el.innerHTML = embedTag;
  const embedElements = el.getElementsByTagName('embed');

  if (embedElements.length !== 1) {
    return undefined;
  }
  const getAttribute = name => embedElements[0].getAttribute(`data-${name}`);

  return {
    id: getAttribute('resource_id'),
    alt: getAttribute('alt'),
    caption: getAttribute('caption'),
    url: getAttribute('url'),
    resource: getAttribute('resource'),
  };
};


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
    if (nextProps.embedTag !== this.props.embedTag) {
      this.handleFetchImage(nextProps.embedTag);
    }
  }

  handleFetchImage(embedTag) {
    const embed = parseEmbedTag(embedTag);
    if (!embed || embed.resource !== 'image') {
      return;
    }

    fetchImage(embed.id, window.accessToken).then((image) => {
      this.setState(() => ({ embed: { ...embed, src: image.imageUrl } }));
    });
  }

  render() {
    const { embed } = this.state;
    if (!embed) {
      return null;
    }

    return (
      <figure>
        <img src={embed.src} alt={embed.alt} />
        <figcaption>{embed.caption}</figcaption>
      </figure>
    );
  }
}

DisplayEmbedTag.propTypes = {
  embedTag: PropTypes.string.isRequired,
};

