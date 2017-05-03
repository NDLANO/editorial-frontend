import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import getComponentName from './getComponentName';

const makeWrapper = middleware => (WrappedComponent) => {
  class FormWrapper extends React.Component {

    constructor(props, ctx) {
      super(props, ctx);
      this.state = {
        model: props.initialModel || {},
        fields: {},
      };
      this.setModel = this.setModel.bind(this);
      this.setProperty = this.setProperty.bind(this);
      this.bindToChangeEvent = this.bindToChangeEvent.bind(this);
      this.bindInput = this.bindInput.bind(this);
    }

    setModel(model, prop) {
      this.setState({ model, fields: { ...this.state.fields, [prop]: { isDirty: true } } });
      return model;
    }

    setProperty(prop, value) {
      return this.setModel({ ...this.state.model,
        [prop]: value,
      }, prop);
    }

    // This, of course, does not handle all possible inputs. In such cases,
    // you should just use `setProperty` or `setModel`. Or, better yet,
    // extend `reformed` to supply the bindings that match your needs.
    bindToChangeEvent(e) {
      const { name, type, value } = e.target;

      if (type === 'checkbox') {
        const oldCheckboxValue = this.state.model[name] || [];
        const newCheckboxValue = e.target.checked
          ? oldCheckboxValue.concat(value)
          : oldCheckboxValue.filter(v => v !== value);

        this.setProperty(name, newCheckboxValue);
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
      const nextProps = { ...this.props,
        bindInput: this.bindInput,
        bindToChangeEvent: this.bindToChangeEvent,
        model: this.state.model,
        fields: this.state.fields,
        setProperty: this.setProperty,
        setModel: this.setModel,
      };
      // SIDE EFFECT-ABLE. Just for developer convenience and expirementation.
      const finalProps = typeof middleware === 'function'
        ? middleware(nextProps)
        : nextProps;

      return React.createElement(WrappedComponent, finalProps);
    }
  }

  FormWrapper.propTypes = {
    initialModel: React.PropTypes.object, //eslint-disable-line
  };
  FormWrapper.displayName = `Reformed(${getComponentName(WrappedComponent)})`;
  return hoistNonReactStatics(FormWrapper, WrappedComponent);
};

export default makeWrapper;
