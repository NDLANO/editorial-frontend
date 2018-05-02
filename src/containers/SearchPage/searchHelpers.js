import queryString from 'query-string';

export const converSearchStringToObject = (location, arrayFields = []) => {
  const searchLocation = queryString.parse(location ? location.search : '');

  return {
    ...searchLocation,
    ...arrayFields
      .map(field => ({
        [field]: searchLocation[field] ? searchLocation[field].split(',') : [],
      }))
      .reduce((result, item) => {
        const key = Object.keys(item)[0];
        return { ...result, [key]: item[key] };
      }, 0),
  };
};

export const convertSearchParam = value => {
  if (!value) {
    return undefined;
  } else if (Array.isArray(value)) {
    return value.length > 0 ? value.join(',') : undefined;
  } else if (Number.isInteger(value)) {
    return value;
  }
  return value.length > 0 ? value : undefined;
};
