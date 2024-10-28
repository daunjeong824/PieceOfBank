import { createSlice } from '@reduxjs/toolkit';

interface TokenState {
    expoToken: string | null;
  }

// 초기 상태
const initialState : TokenState = {
  expoToken: null, // 기본 값은 null
};

// Slice 생성
const tokenSlice = createSlice({
  name: 'expoToken',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.expoToken = action.payload; // 토큰 저장
    },
    clearToken: (state) => {
      state.expoToken = null; // 토큰 초기화
    },
  },
});

// 액션 내보내기
export const { setToken, clearToken } = tokenSlice.actions;

// 리듀서 내보내기
export default tokenSlice.reducer;
