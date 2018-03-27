const groupBy = (array, key) =>
  array.reduce((obj, item) => {
    const copy = obj;
    copy[item[key]] = copy[item[key]] || [];
    copy[item[key]].push(item);
    return copy;
  }, {});

export const groupTopicsByTopic = topics =>
  groupBy(topics.filter(it => it.parent), 'parent');
