import { createSlice } from '@reduxjs/toolkit';

interface UserKeyState {
  userKey: string | null;
}

// 초기 상태
const initialState : UserKeyState = {
  userKey: null, // 기본 값은 null
};

// Slice 생성
const userKeySlice = createSlice({
  name: 'userKey',
  initialState,
  reducers: {
    setUserKey: (state, action) => {
      state.userKey = action.payload; // 토큰 저장
    },
    clearUserKey: (state) => {
      state.userKey = null; // 토큰 초기화
    },
  },
});

// 액션 내보내기
export const { setUserKey, clearUserKey } = userKeySlice.actions;

// 리듀서 내보내기
export default userKeySlice.reducer;
