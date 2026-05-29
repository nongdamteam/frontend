import { SortOption } from '../../types';

export interface FilterBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  isGroupPurchaseOnly: boolean;
  onGroupPurchaseToggle: () => void;
}
