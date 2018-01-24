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

function spliceItems(items, otherItems, itemId, otherItemId, updateProperty) {
  const copy = [...items];
  const updatedItems = [];
  copy.forEach(item => {
    const foundItem = otherItems.find(
      itemType => itemType[otherItemId] === item[itemId],
    );
    if (foundItem) {
      items.splice(
        items.findIndex(itemType => itemType[itemId] === item[itemId]),
        1,
      );
      otherItems.splice(
        otherItems.findIndex(
          itemType => itemType[otherItemId] === item[itemId],
        ),
        1,
      );
      if (updateProperty && foundItem.relevanceId !== item.relevanceId) {
        updatedItems.push({
          ...foundItem,
          [updateProperty]: item[updateProperty],
        });
      }
    }
  });
  return [[...items], [...otherItems], [...updatedItems]];
}

export { flattenResourceTypes, spliceItems };
