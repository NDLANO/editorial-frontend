/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AttributesShape } from '../../../../shapes';

class MathML extends Component {
  constructor(props) {
    super(props);
    this.state = { reRender: false };
  }

  async componentDidUpdate(prevProps) {
    const { model } = this.props;
    const { innerHTML } = model;
    if (prevProps.model.innerHTML !== innerHTML) {
      // Note: a small delay before a 're-render" is required in order to
      // get the MathJax script to render correctly after editing the MathML
      this.setState({ reRender: true });
      await setTimeout(() => {
        this.setState({ reRender: false });
      }, 10);
    }
  }

  render() {
    const { reRender } = this.state;
    if (reRender) {
      return null;
    }
    const { node, model, attributes } = this.props;
    return (
      <span data-cy="math" contentEditable={false} {...attributes}>
        {node.children.map(text => (
          <span key={text.key} data-key={text.key}>
            <math
              xlmns={model.xlmns}
              dangerouslySetInnerHTML={{
                __html: model.innerHTML,
              }}
            />
          </span>
        ))}
      </span>
    );
  }
}

MathML.propTypes = {
  attributes: AttributesShape,
  innerHTML: PropTypes.string,
  node: PropTypes.any,
  model: PropTypes.shape({
    xlmns: PropTypes.string.isRequired,
    innerHTML: PropTypes.string,
  }),
};

export default MathML;
