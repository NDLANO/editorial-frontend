import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import WarningModal from '../../components/WarningModal';
import { SchemaShape } from '../../shapes';

class WarningModalWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { openModal: false, discardChanges: false };
    this.isDirty = this.isDirty.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  componentDidMount() {
    this.unblock = this.props.history.block(nextLocation => {
      const canNavigate =
        !this.isDirty() || this.state.discardChanges || this.props.showSaved;
      if (!canNavigate) {
        this.setState({
          openModal: true,
          nextLocation,
        });
      } else {
        window.onbeforeunload = null;
      }
      return canNavigate;
    });

    if (window && window.config.isProduction) {
      window.onbeforeunload = () =>
        !this.isDirty() || this.state.discardChanges;
    }
  }

  componentWillUnmount() {
    this.unblock();
  }

  onSave(e) {
    const { schema, history, handleSubmit } = this.props;
    handleSubmit(e);
    if (schema.isValid) {
      this.setState({ discardChanges: true }, () => {
        const nextLocation =
          this.state.nextLocation.pathname +
          this.state.nextLocation.hash +
          this.state.nextLocation.search;
        return history.push(nextLocation);
      });
    } else {
      this.setState({ openModal: false });
    }
  }

  onContinue() {
    this.setState({ discardChanges: true }, () => {
      const nextLocation =
        this.state.nextLocation.pathname +
        this.state.nextLocation.hash +
        this.state.nextLocation.search;
      return this.props.history.push(nextLocation);
    });
  }

  isDirty() {
    const { fields } = this.props;
    return Object.keys(fields).some(field => fields[field].dirty);
  }

  render() {
    return this.state.openModal ? (
      <WarningModal
        text={this.props.text}
        onSave={this.onSave}
        onContinue={this.onContinue}
        onCancel={() => this.setState({ openModal: false })}
      />
    ) : null;
  }
}

WarningModalWrapper.propTypes = {
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
  schema: SchemaShape,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    block: PropTypes.func.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func,
  text: PropTypes.string,
  showSaved: PropTypes.bool,
};

export default withRouter(WarningModalWrapper);
