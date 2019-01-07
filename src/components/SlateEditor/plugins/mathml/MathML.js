/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';

class MathML extends Component {
  constructor(props) {
    super(props);
    this.state = { reRender: false };
  }

  async componentDidUpdate(prevProps) {
    const { innerHTML } = this.props;

    if (prevProps.innerHTML) {
      if (window.MathJax && prevProps.innerHTML !== innerHTML) {
        // Note: a small delay before a 're-render" is required in order to
        // get MatJax to render correctly after editing the MathML
        this.setState({ reRender: true });
        await setTimeout(() => {
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
        }, 10);
        this.setState({ reRender: false });
      }
    }
  }

  render() {
    const { reRender } = this.state;
    const { node, innerHTML } = this.props;
    const { xlmns } = node.data.toJS();

    if (reRender) return null;

    return (
      <span contentEditable={false} {...this.props.attributes}>
        {node.nodes.map(text => (
          <span key={text.key} data-key={text.key}>
            <math
              xlmns={xlmns}
              dangerouslySetInnerHTML={{
                __html: innerHTML,
              }}
            />
          </span>
        ))}
      </span>
    );
  }
}

MathML.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  innerHTML: PropTypes.string.isRequired,
  node: Types.node.isRequired,
};

export default MathML;
