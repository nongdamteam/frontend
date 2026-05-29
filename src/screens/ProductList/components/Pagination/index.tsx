import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { PaginationProps } from './types';

export function Pagination({ currentPage, totalPages, onPageChange, onPageChangeComplete }: PaginationProps) {
  // 1부터 totalPages까지의 숫자 배열 생성
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <View style={styles.container}>
      {/* 이전 페이지 버튼 */}
      <TouchableOpacity
        style={[styles.arrowButton, isFirstPage && styles.disabledArrowButton]}
        onPress={() => {
          if (isFirstPage) return;
          onPageChange(currentPage - 1);
          if (onPageChangeComplete) onPageChangeComplete(currentPage - 1);
        }}
        disabled={isFirstPage}
        activeOpacity={0.7}
      >
        <Text style={styles.arrowText}>이전</Text>
      </TouchableOpacity>

      {/* 페이지 번호 버튼 리스트 */}
      {pageNumbers.map((num) => {
        const isActive = currentPage === num;
        return (
          <TouchableOpacity
            key={`page-${num}`}
            style={[styles.pageButton, isActive && styles.activePageButton]}
            onPress={() => {
              onPageChange(num);
              if (onPageChangeComplete) onPageChangeComplete(num);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.pageText, isActive && styles.activePageText]}>
              {num}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* 다음 페이지 버튼 */}
      <TouchableOpacity
        style={[styles.arrowButton, isLastPage && styles.disabledArrowButton]}
        onPress={() => {
          if (isLastPage) return;
          onPageChange(currentPage + 1);
          if (onPageChangeComplete) onPageChangeComplete(currentPage + 1);
        }}
        disabled={isLastPage}
        activeOpacity={0.7}
      >
        <Text style={styles.arrowText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}
export default Pagination;
