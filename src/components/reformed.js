/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * A modified version of https://github.com/davezuko/react-reformed (MIT license)
 */

import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getComponentName } from 'ndla-util';

const makeWrapper = WrappedComponent => {
  class FormWrapper extends React.Component {
    constructor(props, ctx) {
      super(props, ctx);
      this.state = {
        submitted: false,
        model: props.initialModel || {},
        fields: {},
      };
      this.setModel = this.setModel.bind(this);
      this.setProperty = this.setProperty.bind(this);
      this.bindToChangeEvent = this.bindToChangeEvent.bind(this);
      this.bindInput = this.bindInput.bind(this);
      this.setSubmitted = this.setSubmitted.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      const currentModel = this.props.initialModel;
      const nextModel = nextProps.initialModel;

      if (this.props.resetOnInitialModelChange && currentModel !== nextModel) {
        const hasChanges = Object.keys(nextModel).find(
          key => nextModel[key] !== currentModel[key],
        );
        if (hasChanges) {
          this.setModel(nextModel);
        }
      }
    }

    setModel(model) {
      this.setState({ model });
      return model;
    }

    setSubmitted(submitted) {
      this.setState({ submitted });
    }

    setProperty(prop, value, isDirty = true) {
      const model = {
        ...this.state.model,
        [prop]: value,
      };

      if (this.state.fields[prop] && this.state.fields[prop].isDirty) {
        this.setState(prevstate => ({
          model: { ...prevstate.model, [prop]: value },
        }));
      } else {
        this.setState(prevstate => {
          const fields = { ...prevstate.fields, [prop]: { isDirty } };
          return { model: { ...prevstate.model, [prop]: value }, fields };
        });
      }
      return model;
    }

    bindToChangeEvent(e) {
      const { name, type, value } = e.target;
      if (type === 'checkbox') {
        const oldCheckboxValue = this.state.model[name] || [];
        const newCheckboxValue = e.target.checked
          ? oldCheckboxValue.concat(value)
          : oldCheckboxValue.filter(v => v !== value);

        this.setProperty(name, newCheckboxValue);
      } else if (type === 'EditorState') {
        this.setProperty(name, value, value.getCurrentContent().hasText()); // Only set dirty flag if text has changed
      } else if (type === 'SlateEditorState') {
        this.setProperty(name, value); // TODO: Handle dirty flag with SlateEditorState
      } else {
        this.setProperty(name, value);
      }
    }

    bindInput(name) {
      return {
        name,
        value: this.state.model[name] || '',
        onChange: this.bindToChangeEvent,
      };
    }

    render() {
      const nextProps = {
        ...this.props,
        bindInput: this.bindInput,
        bindToChangeEvent: this.bindToChangeEvent,
        model: this.state.model,
        fields: this.state.fields,
        submitted: this.state.submitted,
        setProperty: this.setProperty,
        setSubmitted: this.setSubmitted,
        setModel: this.setModel,
      };

      return React.createElement(WrappedComponent, nextProps);
    }
  }

  FormWrapper.propTypes = {
    initialModel: PropTypes.object, //eslint-disable-line
    resetOnInitialModelChange: PropTypes.bool.isRequired,
  };
  FormWrapper.defaultProps = {
    resetOnInitialModelChange: false,
  };
  FormWrapper.displayName = `Reformed(${getComponentName(WrappedComponent)})`;
  return hoistNonReactStatics(FormWrapper, WrappedComponent);
};

export default makeWrapper;
