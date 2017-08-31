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
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
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

    setProperty(name, value, isDirty = true) {
      const model = set(name, value, this.state.model);
      const field = get(name, this.state.fields, false);
      if (field && field.isDirty) {
        this.setState(prevstate => ({
          model: set(name, value, prevstate.model),
        }));
      } else {
        this.setState(prevstate => ({
          model: set(name, value, prevstate.model),
          fields: set(name, { isDirty }, prevstate.fields),
        }));
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
      } else if (type === 'file') {
        const file = e.target.files[0];
        this.setProperty(name, file);
        this.setProperty('filepath', URL.createObjectURL(file));
      } else if (type === 'SlateEditorState') {
        this.setProperty(name, value); // TODO: Handle dirty flag with SlateEditorState
      } else {
        this.setProperty(name, value);
      }
    }

    bindInput(name, isFile = false) {
      if (isFile) {
        return {
          name,
          onChange: this.bindToChangeEvent,
        };
      }

      const value = get(name, this.state.model, '');

      return {
        name,
        value,
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
