import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import ProductListScreen from '@/screens/ProductList/ProductListScreen';
import ProductDetailScreen from '@/screens/ProductDetail';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // 각각의 화면에서 예쁜 커스텀 헤더를 쓰기 위해 내장 헤더는 비활성화
      }}
    >
      <Stack.Screen name="Home" component={ProductListScreen} />
      <Stack.Screen name="Details" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
export default RootNavigator;
