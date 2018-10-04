/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectT } from 'ndla-i18n';
import config from '../../config';
import { isEqualEditorValue } from '../../util/articleContentConverter';
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
    const { history, showSaved } = this.props;
    this.unblock = history.block(nextLocation => {
      const isDirty = this.isDirty();
      const canNavigate = !isDirty || this.state.discardChanges || showSaved;
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

    if (config.isNdlaProdEnvironment) {
      window.onbeforeunload = () => !this.isDirty || this.state.discardChanges;
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
    const { fields, initialModel, model, showSaved } = this.props;
    // Checking specific slate object fields if they really have changed
    const slateFields = ['introduction', 'metaDescription', 'content'];
    const dirtyFields = [];
    Object.keys(fields)
      .filter(field => fields[field].dirty)
      .forEach(dirtyField => {
        if (slateFields.includes(dirtyField)) {
          if (
            !isEqualEditorValue(
              initialModel[dirtyField],
              model[dirtyField],
              model.articleType,
            )
          ) {
            dirtyFields.push(dirtyField);
          }
        } else {
          dirtyFields.push(dirtyField);
        }
      });
    return dirtyFields.length > 0 && !showSaved;
  }

  render() {
    const { t, text } = this.props;
    return (
      <WarningModal
        show={this.state.openModal}
        text={text}
        actions={[
          { text: t('form.save'), onClick: this.onSave },
          {
            text: t('warningModal.continue'),
            onClick: this.onContinue,
          },
        ]}
        onCancel={() => this.setState({ openModal: false })}
      />
    );
  }
}

WarningModalWrapper.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    articleType: PropTypes.string,
    language: PropTypes.string,
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
  }),
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

export default withRouter(injectT(WarningModalWrapper));
