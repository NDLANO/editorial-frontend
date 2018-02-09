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
      const navigate = !this.isDirty() || this.state.discardChanges;
      if (!navigate) {
        this.setState({
          openModal: true,
          nextLocation,
        });
      } else {
        window.onbeforeunload = null;
      }
      return navigate;
    });

    window.onbeforeunload = () => !this.isDirty() || this.state.discardChanges;
  }

  componentWillUnmount() {
    this.unblock();
  }

  onSave(e) {
    const { schema, history, handleSubmit } = this.props;
    handleSubmit(e);
    if (schema.isValid) {
      this.setState({ discardChanges: true }, () =>
        history.push(this.state.nextLocation.pathname),
      );
    } else {
      this.setState({ openModal: false });
    }
  }

  onContinue() {
    this.setState({ discardChanges: true }, () =>
      this.props.history.push(this.state.nextLocation.pathname),
    );
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
};

export default withRouter(WarningModalWrapper);
