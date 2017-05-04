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

const tagOptions = [
  'access control',
  'activity',
  'addiction',
  'adjective',
  'advertisement',
  'advertising',
  'advertising photography',
  'afghanistan',
  'africa',
  'al-andalus',
  'alarm system',
  'an enemy of the people',
  'antenna',
  'aquaculture',
  'aquafarming',
  'asia',
  'attention demanding work',
  'audio production',
  'audio recording',
  'author',
  'automated',
  'availability',
];

class TagsInput extends Component {
  constructor() {
    super();
    this.state = { open: false };
  }

  render() {
    const { open } = this.state;
    const { name, value, onChange } = this.props;

    const messages = {
      createNew: 'Opprett ny tag',
      emptyFilter: 'Fant ingen passende tagger',
      emptyList: 'Det er ingen tagger i denne listen',
    };

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
      this.setState({ open: searchTerm.length > 2 });
    };

    return (
      <Multiselect
        data={tagOptions}
        filter="contains"
        open={open}
        messages={messages}
        value={value}
        onChange={handleChange}
        onCreate={handleAdd}
        onToggle={() => { }}
        onSearch={handleSearch}
      />
    );
  }
}

TagsInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
};

export default TagsInput;
