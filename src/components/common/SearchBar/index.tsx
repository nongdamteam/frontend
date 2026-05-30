import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { COLORS } from '@/constants/colors';
import { SearchBarProps } from './types';
import SearchIcon from '@/assets/icons/SearchIcon';

export function SearchBar({
  value,
  onChangeText,
  placeholder = '제품명을 검색해 보세요',
  onSubmit,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <SearchIcon size={18} color={COLORS.textSecondary} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
          activeOpacity={0.7}
        >
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
export default SearchBar;
