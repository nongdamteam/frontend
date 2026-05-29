import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './styles';
import { FilterBarProps } from './types';
import { SortOption } from '../../types';

export function FilterBar({
  sortOption,
  onSortChange,
  isGroupPurchaseOnly,
  onGroupPurchaseToggle,
}: FilterBarProps) {
  
  const handleSortPress = (target: SortOption) => {
    if (sortOption === target) {
      onSortChange('none');
    } else {
      onSortChange(target);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 거리 필터 */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            sortOption === 'distance' && styles.activeFilterButton,
          ]}
          onPress={() => handleSortPress('distance')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              sortOption === 'distance' && styles.activeFilterText,
            ]}
          >
            거리순
          </Text>
          <Text style={[styles.arrowIcon, sortOption === 'distance' && styles.activeArrowIcon]}>
            ▼
          </Text>
        </TouchableOpacity>

        {/* 가격 필터 */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            sortOption === 'price' && styles.activeFilterButton,
          ]}
          onPress={() => handleSortPress('price')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              sortOption === 'price' && styles.activeFilterText,
            ]}
          >
            가격순
          </Text>
          <Text style={[styles.arrowIcon, sortOption === 'price' && styles.activeArrowIcon]}>
            ▼
          </Text>
        </TouchableOpacity>

        {/* 참여자순 필터 */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            sortOption === 'participants' && styles.activeFilterButton,
          ]}
          onPress={() => handleSortPress('participants')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              sortOption === 'participants' && styles.activeFilterText,
            ]}
          >
            참여자순
          </Text>
          <Text style={[styles.arrowIcon, sortOption === 'participants' && styles.activeArrowIcon]}>
            ▼
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 공구 여부 토글 */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>공구 진행중</Text>
        <TouchableOpacity
          style={[
            styles.switchBase,
            isGroupPurchaseOnly && styles.switchActive,
          ]}
          onPress={onGroupPurchaseToggle}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.switchThumb,
              isGroupPurchaseOnly && styles.switchThumbActive,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default FilterBar;
