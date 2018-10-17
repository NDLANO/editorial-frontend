import prettier from 'prettier';

// Use prettier to format html for better diffing. N.B. prettier html formating is currently experimental
export const prettify = content =>
  prettier.format(`${content}`, { parser: 'parse5' });

export default prettify;
