# React Native + TypeScript 프로젝트 폴더 컨벤션 및 개발 가이드

이 문서는 React Native와 TypeScript를 사용하는 프론트엔드 프로젝트의 폴더 구조, 네이밍 컨벤션, 그리고 개발 가이드라인을 정의합니다. 팀원 간의 일관된 코드 스타일과 유지보수성을 극대화하기 위해 이 컨벤션을 준수합니다.

---

## 1. 폴더 구조 (Folder Structure)

기본적으로 모든 소스 코드는 `src/` 폴더 아래에 위치하며, 도메인/역할별로 관심사를 분리합니다.

```text
src/
├── @types/             # 전역 TypeScript 타입 정의 파일 (.d.ts)
├── assets/             # 정적 리소스 (이미지, 폰트, 벡터 아이콘 등)
│   ├── images/
│   └── icons/
├── components/         # 여러 화면에서 재사용되는 공통 UI 컴포넌트
│   ├── common/         # Button, Input, Card 등 가장 기초적인 공통 컴포넌트
│   └── layout/         # Header, Container, SafeAreaView 관련 컴포넌트
├── constants/          # 전역 상수 정의 (색상 테마, API Endpoint, 규격 등)
│   ├── colors.ts       # 테마 컬러 세트
│   └── layout.ts       # 기기 대응 여백, 패딩 등
├── hooks/              # 전역에서 사용되는 커스텀 훅 (예: useAuth, useDebounce)
├── navigation/         # React Navigation 설정 및 네비게이터 정의
│   ├── RootNavigator.tsx
│   ├── AppNavigator.tsx
│   └── types.ts        # 화면 전환시 전달할 파라미터 타입 정의
├── screens/            # 앱의 각 화면 컴포넌트
│   ├── Home/           # 화면별 폴더 구성
│   │   ├── HomeScreen.tsx
│   │   ├── components/ # Home 화면에서만 사용되는 하위 컴포넌트
│   │   └── hooks/      # Home 화면에서만 사용되는 상태관리/비즈니스 로직 훅
│   └── Profile/
│       └── ProfileScreen.tsx
├── services/           # 외부 API 및 서드파트 라이브러리 연동 코드
│   ├── api/            # Axios 인스턴스 및 API 요청 함수
│   └── storage/        # MMKV 또는 AsyncStorage 관련 래퍼 함수
├── store/              # 전역 상태 관리 (Zustand, Redux Toolkit, Recoil 등)
│   ├── useAuthStore.ts
│   └── useSettingStore.ts
└── utils/              # 순수 유틸리티 함수 (날짜 포맷터, 정규식 검사기 등)
    ├── date.ts
    └── validation.ts
```

---

## 2. 네이밍 컨벤션 (Naming Conventions)

### 2.1 폴더 & 파일 네이밍
*   **폴더명**: 기본적으로 **camelCase**를 사용하되, `screens/` 아래의 화면별 폴더는 **PascalCase**를 권장합니다. (예: `src/screens/Home`, `src/components/common`)
*   **컴포넌트 파일 (`.tsx`)**: **PascalCase**를 사용합니다.
    *   예: `Button.tsx`, `HomeScreen.tsx`
*   **일반 코드 파일 (`.ts`)**: **camelCase**를 사용합니다.
    *   예: `useAuth.ts`, `colors.ts`, `date.ts`

### 2.2 컴포넌트 내부 네이밍 패턴 (Co-location)
공통 컴포넌트나 특정 화면 컴포넌트를 구성할 때 하나의 파일에 모든 것을 넣기보다는 아래와 같이 분리하는 패턴을 지향합니다.
```text
components/common/Button/
├── index.tsx          # 컴포넌트 메인 코드
├── styles.ts          # 스타일 정의 파일 (StyleSheet)
└── types.ts           # 컴포넌트 Props 타입 정의
```

*   **컴포넌트 Props 정의**: `I[ComponentName]Props` 또는 `[ComponentName]Props` 형식으로 작성합니다.
    ```typescript
    // types.ts
    export interface ButtonProps {
      title: string;
      onPress: () => void;
      disabled?: boolean;
    }
    ```

---

## 3. TypeScript 개발 가이드라인

### 3.1 절대 경로 지정 (Path Alias)
상대 경로(`../../components/Button`)의 복잡함을 피하기 위해 절대 경로 별칭(`@/`)을 사용합니다.

#### `tsconfig.json` 설정
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### `babel.config.js` 설정 (`babel-plugin-module-resolver` 필요)
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
```

### 3.2 React Navigation 타입 안전성 확보
화면 간 이동 시의 파라미터 타입 오류를 방지하기 위해 네비게이션 구조에 대한 전역 타입을 선언합니다.

```typescript
// src/navigation/types.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number; query?: string };
  Profile: { userId: string };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
```

### 3.3 타입 추론 활용 및 명시적 선언
*   컴포넌트 리턴 타입은 가능한 생략하거나 `React.ReactElement`를 사용합니다. (최신 React에서는 컴포넌트가 알아서 잘 추론되므로 명시적인 `React.FC`의 사용은 피하는 추세입니다.)
*   이벤트 핸들러, API 응답 객체 등 복잡한 데이터는 반드시 타입을 명시적으로 작성합니다.

---

## 4. 컴포넌트 구현 컨벤션 (Best Practices)

### 4.1 스타일링 규칙
*   React Native 기본 `StyleSheet.create` 또는 선택에 따라 `styled-components/native`를 사용합니다.
*   공통 여백이나 테마 색상은 하드코딩하지 않고 `src/constants/` 에 정의된 값을 참조합니다.
    ```typescript
    import { StyleSheet } from 'react-native';
    import { COLORS } from '@/constants/colors';

    export const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
      },
    });
    ```

### 4.2 관심사 분리 (Container-Presenter / Custom Hook 패턴)
화면 또는 복잡한 컴포넌트에서는 UI를 그리는 코드와 비즈니스 로직(API 호출, 상태 제어 등)을 분리합니다.
*   UI 프레젠테이션 코드는 `HomeScreen.tsx`에 작성하고,
*   비즈니스 로직은 `hooks/useHomeScreen.ts`와 같이 화면 단위 커스텀 훅으로 추출하여 관리합니다.

---

## 5. 시작하기 가이드 (Quick Start)

### 필수 패키지 설치 권장
1.  **절대 경로 해석 플러그인**:
    ```bash
    npm install -D babel-plugin-module-resolver
    ```
2.  **전역 상태 관리 (Zustand 추천)**:
    ```bash
    npm install zustand
    ```
3.  **네비게이션 (React Navigation)**:
    ```bash
    npm install @react-navigation/native @react-navigation/native-stack
    ```
