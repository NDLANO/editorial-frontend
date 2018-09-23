/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RWMultiselect from 'react-widgets/lib/Multiselect';

class MultiSelect extends Component {
  constructor() {
    super();
    this.state = { open: false, data: [] };
  }

  render() {
    const { open } = this.state;
    const {
      name,
      value,
      filter,
      messages,
      onChange,
      data,
      disableCreate,
      placeholder,
    } = this.props;

    const handleChange = tags => {
      onChange({ target: { name, value: tags, type: 'tags' } });
    };

    const handleAdd = tag => {
      if (value.includes(tag)) {
        return;
      }
      handleChange([...value, tag]);
    };

    const handleSearch = searchTerm => {
      if (searchTerm.length === 2) {
        this.setState({
          open: true,
          data: data.filter(string => string.indexOf(searchTerm) !== -1),
        });
      } else if (searchTerm.length < 2) {
        this.setState({ open: false, data: ['¥†¥∂¥¥'] }); // Needs one data item to dispay correct messages
      }
    };

    return (
      <RWMultiselect
        filter={filter}
        data-testid={`multiselect-${name}`}
        open={open}
        messages={messages}
        value={value}
        onChange={handleChange}
        onCreate={disableCreate ? undefined : handleAdd}
        onToggle={() => {}}
        onSearch={handleSearch}
        data={this.state.data}
        placeholder={placeholder}
      />
    );
  }
}

MultiSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  filter: PropTypes.oneOf(['startsWith', 'endsWith', 'contains', false]),
  messages: PropTypes.shape({
    createOption: PropTypes.string.isRequired,
    emptyFilter: PropTypes.string.isRequired,
    emptyList: PropTypes.string.isRequired,
  }),
  name: PropTypes.string.isRequired,
  disableCreate: PropTypes.bool,
  placeholder: PropTypes.string,
};

MultiSelect.defaultProps = {
  filter: 'startsWith',
  data: [],
  disableCreate: false,
  placeholder: '',
};

export default MultiSelect;
