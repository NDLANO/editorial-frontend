/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Multiselect from 'react-widgets/lib/Multiselect';

class TagsInput extends Component {
  constructor() {
    super();
    this.state = { open: false, data: [] };
  }

  render() {
    const { open } = this.state;
    const { name, value, messages, onChange, data } = this.props;

    const handleChange = (tags) => {
      onChange({ target: { name, value: tags, type: 'tags' } });
    };

    const handleAdd = (tag) => {
      if (value.includes(tag)) {
        return;
      }
      handleChange([...value, tag]);
    };

    const handleSearch = (searchTerm) => {
      if (searchTerm.length === 3) {
        this.setState({ open: true, data: data.filter(string => string.indexOf(searchTerm) !== -1) });
      } else if (searchTerm.length < 3) {
        this.setState({ open: false, data: ['zzzxxx'] }); // Needs one data item to dispay correct message
      }
    };

    return (
      <Multiselect
        filter="contains"
        open={open}
        messages={messages}
        value={value}
        onChange={handleChange}
        onCreate={handleAdd}
        onToggle={() => {}}
        onSearch={handleSearch}
        data={this.state.data}
      />
    );
  }
}

TagsInput.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  messages: PropTypes.shape({
    createNew: PropTypes.string.isRequired,
    emptyFilter: PropTypes.string.isRequired,
    emptyList: PropTypes.string.isRequired,
  }),
  name: PropTypes.string.isRequired,
};

TagsInput.defaultProps = {
  data: [],
};

export default TagsInput;
