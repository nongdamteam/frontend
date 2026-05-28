import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayBg,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: COLORS.textSecondary,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});
