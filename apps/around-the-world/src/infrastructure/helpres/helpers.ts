import { sortedOptionsType } from './types';

export const sortedParamOptions = (
  pageNumberQuery: string | undefined,
  pageSizeQuery: string | undefined,
  validSortFields: string[],
  sortByQuery: string | undefined,
  sortDirectionQuery: string | undefined,
): sortedOptionsType => {
  const pageNumber = isNaN(Number(pageNumberQuery))
    ? 1
    : Number(pageNumberQuery);
  const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
  const sortBy =
    sortByQuery && validSortFields.includes(sortByQuery)
      ? `"${sortByQuery}"`
      : `"createdAt"`;
  const sortDirection = sortDirectionQuery === 'asc' ? 'ASC' : 'DESC';

  const offset = (pageNumber - 1) * pageSize;
  return {
    pageNumber: pageNumber,
    pageSize: pageSize,
    sortBy: sortBy,
    sortDirection: sortDirection,
    offset: offset,
  };
};
