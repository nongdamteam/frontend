import { ImageSourcePropType } from 'react-native';
import { cartImages } from '@/data/cartImages';
import { OrderGroup } from '@/components/orderHistory/OrderCard';

export interface CartItem {
  id: string;
  farmId: string;
  title: string;
  option: string;
  recipeSource?: string;
  unitPrice: number;
  originalUnitPrice?: number;
  quantity: number;
  checked: boolean;
  isSoldOut?: boolean;
  priceChangedNote?: string;
  duplicateWarning?: {
    message: string;
    show: boolean;
  };
  image?: ImageSourcePropType | string;
}

const initialItems: CartItem[] = [
  {
    id: 'nei_300g',
    farmId: 'cheorwon',
    title: '철원 냉이 300g',
    option: '옵션: 300g · 노지 봄나물 · 산지직송',
    recipeSource: '냉이 된장국 레시피에서 추가됨',
    unitPrice: 5900,
    quantity: 2,
    checked: true,
    duplicateWarning: {
      message: '중복 농산물: 봄나물 비빔밥에도 담김',
      show: true,
    },
    image: cartImages.products.nei,
  },
  {
    id: 'rice_2kg',
    farmId: 'cheorwon',
    title: '철원 오대쌀 2kg',
    option: '옵션: 2kg · 2026년 햅쌀 · 농장 도정',
    recipeSource: '냉이 된장국 한상에서 추가됨',
    unitPrice: 9800,
    quantity: 1,
    checked: true,
    image: cartImages.products.rice,
  },
  {
    id: 'mushroom_200g',
    farmId: 'cheorwon',
    title: '영양 생표고버섯 200g',
    option: '옵션: 200g · 무농약 · 당일 선별',
    recipeSource: '버섯 솥밥 레시피에서 추가됨',
    unitPrice: 6300,
    quantity: 1,
    checked: true,
    image: cartImages.products.mushroom,
  },
  {
    id: 'bomdong_1',
    farmId: 'haenam',
    title: '해남 봄동 1포기',
    option: '옵션: 1포기 · 겉절이용 · 당일 수확',
    recipeSource: '봄동 겉절이 레시피에서 추가됨',
    unitPrice: 4500,
    originalUnitPrice: 4200,
    quantity: 1,
    checked: true,
    priceChangedNote: '수확량 감소로 담을 때보다 300원 올랐습니다.',
    image: cartImages.products.bomdong,
  },
  {
    id: 'sebal_200g',
    farmId: 'haenam',
    title: '해남 세발나물 200g',
    option: '옵션: 200g · 갯벌 노지재배 · 냉장',
    recipeSource: '봄나물 비빔밥에서 추가됨',
    unitPrice: 2900,
    quantity: 1,
    checked: false,
    isSoldOut: true,
    image: cartImages.products.sebal,
  },
];

const initialOrders: OrderGroup[] = [
  {
    orderId: 'ORD-20260528-084',
    orderDate: '2026.05.28',
    farmName: '철원 들녘농장',
    deliveryType: 'early_morning',
    status: 'shipping',
    totalPrice: 21600,
    deliveryFee: 3000,
    items: [
      {
        id: 'nei_300g',
        title: '철원 냉이 300g',
        option: '옵션: 300g · 노지 봄나물 · 산지직송',
        quantity: 2,
        price: 5900,
        image: cartImages.products.nei,
      },
      {
        id: 'mushroom_200g',
        title: '영양 생표고버섯 200g',
        option: '옵션: 200g · 무농약 · 당일 선별',
        quantity: 1,
        price: 6300,
        image: cartImages.products.mushroom,
      },
    ],
  },
  {
    orderId: 'ORD-20260515-021',
    orderDate: '2026.05.15',
    farmName: '해남 땅끝농장',
    deliveryType: 'normal',
    status: 'completed',
    totalPrice: 12500,
    deliveryFee: 3500,
    items: [
      {
        id: 'bomdong_1',
        title: '해남 봄동 1포기',
        option: '옵션: 1포기 · 겉절이용 · 당일 수확',
        quantity: 2,
        price: 4500,
        image: cartImages.products.bomdong,
      },
    ],
  },
  {
    orderId: 'ORD-20260410-092',
    orderDate: '2026.04.10',
    farmName: '철원 들녘농장',
    deliveryType: 'early_morning',
    status: 'success',
    totalPrice: 9800,
    deliveryFee: 0,
    items: [
      {
        id: 'rice_2kg',
        title: '철원 오대쌀 2kg',
        option: '옵션: 2kg · 2026년 햅쌀 · 농장 도정',
        quantity: 1,
        price: 9800,
        image: cartImages.products.rice,
      },
    ],
  },
  {
    orderId: 'ORD-20260218-042',
    orderDate: '2026.02.18',
    farmName: '해남 땅끝농장',
    deliveryType: 'normal',
    status: 'completed',
    totalPrice: 5800,
    deliveryFee: 3500,
    items: [
      {
        id: 'sebal_200g',
        title: '해남 세발나물 200g',
        option: '옵션: 200g · 갯벌 노지재배 · 냉장',
        quantity: 2,
        price: 2900,
        image: cartImages.products.sebal,
      },
    ],
  },
  {
    orderId: 'ORD-20251105-015',
    orderDate: '2025.11.05',
    farmName: '철원 들녘농장',
    deliveryType: 'early_morning',
    status: 'completed',
    totalPrice: 12700,
    deliveryFee: 3000,
    items: [
      {
        id: 'mushroom_200g_2',
        title: '영양 생표고버섯 200g',
        option: '옵션: 200g · 무농약 · 당일 선별',
        quantity: 2,
        price: 6350,
        image: cartImages.products.mushroom,
      },
    ],
  },
];

let cartItems: CartItem[] = [...initialItems];
let orderGroups: OrderGroup[] = [...initialOrders];
let shouldShowOrderHistory = false;

const listeners = new Set<() => void>();

export const cartService = {
  getCartItems(): CartItem[] {
    return cartItems;
  },
  addCartItem(item: CartItem) {
    const existing = cartItems.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push(item);
    }
    this.notify();
  },
  setCartItems(newItems: CartItem[]) {
    cartItems = newItems;
    this.notify();
  },
  getOrders(): OrderGroup[] {
    return orderGroups;
  },
  addOrderFromProduct(product: any) {
    const farmId = product.title?.includes('해남') ? 'haenam' : 'cheorwon';
    const farmName = farmId === 'haenam' ? '해남 땅끝농장' : '철원 들녘농장';
    const deliveryType = farmId === 'haenam' ? 'normal' : 'early_morning';
    const baseDeliveryFee = farmId === 'haenam' ? 3500 : 3000;
    const unitPrice = product.pricePer100g || 1000;
    const quantity = 1;
    const itemTotal = unitPrice * quantity;
    const deliveryFee = (farmId === 'cheorwon' && itemTotal >= 30000) ? 0 : baseDeliveryFee;
    const totalPrice = itemTotal + deliveryFee;

    const newOrder: OrderGroup = {
      orderId: `ORD-20260529-${Math.floor(100 + Math.random() * 900)}`,
      orderDate: '2026.05.29',
      farmName,
      deliveryType,
      status: 'shipping',
      totalPrice,
      deliveryFee,
      items: [
        {
          id: product.id,
          title: product.title,
          option: '옵션: 공동구매 특가 · 산지직송',
          quantity,
          price: unitPrice,
          image: product.image,
        },
      ],
    };

    orderGroups = [newOrder, ...orderGroups];
    this.notify();
  },
  checkoutCheckedItems() {
    const checked = cartItems.filter(item => item.checked && !item.isSoldOut);
    if (checked.length === 0) return;

    const farmGroupsMap = new Map<string, typeof checked>();
    checked.forEach(item => {
      const list = farmGroupsMap.get(item.farmId) || [];
      list.push(item);
      farmGroupsMap.set(item.farmId, list);
    });

    const newOrders: OrderGroup[] = [];
    farmGroupsMap.forEach((items, farmId) => {
      const farmName = farmId === 'haenam' ? '해남 땅끝농장' : '철원 들녘농장';
      const deliveryType = farmId === 'haenam' ? 'normal' : 'early_morning';
      const baseDeliveryFee = farmId === 'haenam' ? 3500 : 3000;
      
      const itemTotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      const deliveryFee = (farmId === 'cheorwon' && itemTotal >= 30000) ? 0 : baseDeliveryFee;
      const totalPrice = itemTotal + deliveryFee;

      newOrders.push({
        orderId: `ORD-20260529-${Math.floor(100 + Math.random() * 900)}`,
        orderDate: '2026.05.29',
        farmName,
        deliveryType,
        status: 'shipping',
        totalPrice,
        deliveryFee,
        items: items.map(i => ({
          id: i.id,
          title: i.title,
          option: i.option,
          quantity: i.quantity,
          price: i.unitPrice,
          image: i.image as any,
        })),
      });
    });

    orderGroups = [...newOrders, ...orderGroups];
    cartItems = cartItems.filter(item => !item.checked || item.isSoldOut);
    this.notify();
  },
  getShouldShowOrderHistory(): boolean {
    return shouldShowOrderHistory;
  },
  setShouldShowOrderHistory(val: boolean) {
    shouldShowOrderHistory = val;
    this.notify();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  notify() {
    listeners.forEach(l => l());
  },
};
