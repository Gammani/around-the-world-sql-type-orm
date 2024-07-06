const calculationPageCount = (totalCount: number, pageSize: number): number => {
  return Math.ceil(totalCount / pageSize);
};

export class PaginationViewModel<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;

  constructor(
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    items: T,
  ) {
    this.pagesCount = calculationPageCount(totalCount, pageSize);
    this.page = pageNumber;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}
