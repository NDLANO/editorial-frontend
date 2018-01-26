/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function flattenResourceTypes(data = []) {
  const resourceTypes = [];
  data.forEach(type => {
    if (type.subtypes) {
      type.subtypes.forEach(subtype =>
        resourceTypes.push({
          typeName: type.name,
          typeId: type.id,
          name: subtype.name,
          id: subtype.id,
        }),
      );
    } else {
      resourceTypes.push({
        name: type.name,
        id: type.id,
      });
    }
  });
  return resourceTypes;
}

function spliceChangedItems(
  changedItems,
  items,
  changedItemId = 'id',
  itemId = 'id',
  updateProperty,
) {
  const copy = [...changedItems];
  const updatedItems = [];
  copy.forEach(item => {
    const foundItem = items.find(
      itemType => itemType[itemId] === item[changedItemId],
    );
    if (foundItem) {
      changedItems.splice(
        changedItems.findIndex(
          itemType => itemType[changedItemId] === item[changedItemId],
        ),
        1,
      );
      items.splice(
        items.findIndex(itemType => itemType[itemId] === item[changedItemId]),
        1,
      );
      if (
        updateProperty &&
        foundItem[updateProperty] !== item[updateProperty]
      ) {
        updatedItems.push({
          ...foundItem,
          [updateProperty]: item[updateProperty],
        });
      }
    }
  });
  // [Create], [Delete], [Update]
  return [[...changedItems], [...items], [...updatedItems]];
}

export { flattenResourceTypes, spliceChangedItems };
