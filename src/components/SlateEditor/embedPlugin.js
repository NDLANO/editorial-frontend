/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
// import SlateFigure from './SlateFigure';

export default function createEmbedPlugin() {
  // const store = new Store();

  // function editorDidMount(editor, props) {
  //   store.set(props.pathname);
  // }

  // function editorDidUpdate(editor, props) {
  //   store.set(props.pathname);
  // }

  class Test extends React.Component {
    constructor(props) {
      super();
      console.log(props.editor.props.submitted);
      this.state = {
        submitted: props.editor.props.submitted,
      };
      this.onSubmittedChange = this.onSubmittedChange.bind(this);
    }

    componentDidMount() {
      // store.on(this.onSubmittedChange);
    }

    componentWillUnmount() {
      // store.off(this.onSubmittedChange);
    }

    onSubmittedChange(submitted) {
      this.setState({ submitted });
    }

    render() {
      return (
        <div>
          submitted: {this.state.submitted ? 'true' : 'false'}
        </div>
      );
    }
  }
  Test.propTypes = {
    editor: PropTypes.shape({
      props: PropTypes.shape({
        submitted: PropTypes.bool.isRequired,
      }),
    }),
  };

  const schema = {
    nodes: {
      // embed: SlateFigure,
      embed: Test,
    },
  };

  return {
    schema,
    render: props => {
      console.log(props);
      //   store.set(props.pathname);
      return props.children;
    },
  };
}
