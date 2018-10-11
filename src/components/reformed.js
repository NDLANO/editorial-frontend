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
import isEqual from 'lodash/fp/isEqual';
import { getComponentName } from 'ndla-util';

const makeWrapper = WrappedComponent => {
  class FormWrapper extends React.Component {
    constructor(props, ctx) {
      super(props, ctx);
      this.state = {
        submitted: false,
        initialModel: props.initialModel || {},
        model: props.initialModel || {},
        fields: {},
      };
      this.setModel = this.setModel.bind(this);
      this.setModelField = this.setModelField.bind(this);
      this.setProperty = this.setProperty.bind(this);
      this.bindToChangeEvent = this.bindToChangeEvent.bind(this);
      this.bindInput = this.bindInput.bind(this);
      this.setInputFlags = this.setInputFlags.bind(this);
      this.setSubmitted = this.setSubmitted.bind(this);
      this.bindInputEvent = this.bindInputEvent.bind(this);
      this.checkIfDirty = this.checkIfDirty.bind(this);
    }

    setModel(model) {
      this.setState({ model });
      return model;
    }

    setModelField(field, value) {
      this.setState(prevState => ({
        model: { ...prevState.model, [field]: value },
      }));
    }

    setSubmitted(submitted) {
      this.setState({ submitted });
    }

    setInputFlags(name, flags) {
      this.setState(prevState => {
        const currentFlags = get(name, prevState.fields);
        return {
          fields: set(
            name,
            { dirty: false, ...currentFlags, ...flags },
            prevState.fields,
          ),
        };
      });
    }

    setProperty(name, value) {
      this.setState(prevstate => ({
        model: set(name, value, prevstate.model),
      }));
      this.setInputFlags(name, {
        dirty: this.checkIfDirty(name, value),
      });
    }

    checkIfDirty(name, value) {
      const { initialModel: model } = this.state;
      return !isEqual(model[name], value);
    }

    bindToChangeEvent(e) {
      const { name, type, value, checked } = e.target;
      if (type === 'file') {
        const file = e.target.files[0];
        this.setProperty(name, file);
        this.setProperty('filepath', URL.createObjectURL(file));
      } else if (type === 'checkbox') {
        this.setProperty(name, checked);
      } else {
        this.setProperty(name, value);
      }
    }

    bindInputEvent(e) {
      const {
        type,
        target: { name },
      } = e;
      if (type === 'blur') {
        this.setInputFlags(name, { touched: true, active: false });
      } else if (type === 'focus') {
        this.setInputFlags(name, { active: true });
      }
    }

    bindInput(name, type = '') {
      const defaultProps = {
        name,
        onChange: this.bindToChangeEvent,
        onBlur: this.bindInputEvent,
        onFocus: this.bindInputEvent,
      };

      if (type === 'file') {
        return {
          type,
          name,
          onChange: this.bindToChangeEvent,
        };
      }
      const value = get(name, this.state.model, '');

      if (type === 'checkbox') {
        return {
          ...defaultProps,
          type,
          checked: value,
        };
      }

      return { ...defaultProps, value };
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
        setModelField: this.setModelField,
      };

      return React.createElement(WrappedComponent, nextProps);
    }
  }

  FormWrapper.propTypes = {
    initialModel: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };
  FormWrapper.displayName = `Reformed(${getComponentName(WrappedComponent)})`;
  return hoistNonReactStatics(FormWrapper, WrappedComponent);
};

export default makeWrapper;
