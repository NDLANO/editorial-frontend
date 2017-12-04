import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift'
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui'
import { injectT } from 'ndla-i18n'
import { Cross, Arrow } from 'ndla-ui/icons';

const classes = new BEMHelper({
  name: 'dropdown',
  prefix: 'c-',
});


const sorter = (list, val) => list.filter((item) => item.startsWith(val))


const DropDownAction = ({clearSelection, isOpen, selectedItem, openMenu, closeMenu}) => {
  if (selectedItem) {
    return <Button {...classes('action')}  onClick={clearSelection} stripped><Cross /></Button>
  }
  const direction = isOpen ? 'up' : 'down';
  return <Button {...classes('action')} onClick={isOpen ? closeMenu : openMenu} stripped><Arrow direction={direction} /></Button>
}

const DropDownMenu = ({}) => !isOpen ? null : (
    <div {...classes('items')}>
      {values.map(
        (item, index) => (
          <div
             {...classes('item', highlightedIndex === index ? 'active' : '')}
            key={item}
            {...getItemProps({
              item,
              isActive: highlightedIndex === index,
              isSelected: selectedItem === item,
            })}
          >
            {item}
          </div>
        ),
      )}
    </div>
  )

const DropDown = ({items, onChange, label}) => (
    <Downshift
      onChange={onChange}
      render={(downshiftProps) => {
        const {
          getInputProps,
          getItemProps,
          getLabelProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
        } = downshiftProps;

        const values = inputValue ? sorter(items, inputValue) : items;
        return (
        <div {...classes()}>
          <label htmlFor="dropdown-search" {...getLabelProps()}>{label}</label>
          <input name="dropdown-search" {...getInputProps({placeholder: 'Enter color here'})} />
          {isOpen && (
            <div {...classes('items')}>
              {values.map(
                (item, index) => (
                  <div
                     {...classes('item', highlightedIndex === index ? 'active' : '')}
                    key={item}
                    {...getItemProps({
                      item,
                      isActive: highlightedIndex === index,
                      isSelected: selectedItem === item,
                    })}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          )}
          <DropDownAction {...downshiftProps} />
        </div>
      )
    }}
    />
)
DropDown.propTypes = {
  onChange: PropTypes.func.isRequired,

}

export default injectT(DropDown)
