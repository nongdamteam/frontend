export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Optional callback invoked after page change completes (useful to scroll to top) */
  onPageChangeComplete?: (page: number) => void;
}
