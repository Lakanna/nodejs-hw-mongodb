const parseNumber = (value, defaultValue) => {
  const isString = typeof value === 'string';

  if (!isString) {
    return defaultValue;
  }

  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) return defaultValue;

  return parsedNumber;
};

// console.log(parseNumber('0.33', 23));

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return { page: parsedPage, perPage: parsedPerPage };
};

// console.log(parsePaginationParams({ page: 'kl', perPage: 'po' }));
