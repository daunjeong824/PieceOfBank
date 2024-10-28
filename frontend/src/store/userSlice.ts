import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    ID: string;
    password: string;
    nickName: string;
  isLogged: boolean;
  subscribeType: number;
}

// 초기 상태 설정
const initialState: AuthState = {
    ID: '',
    password: '',
    nickName: '',
  isLogged: false,
    subscribeType : 0
};

// Slice 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setID: (state, action: PayloadAction<string>) => {
      state.ID = action.payload; // ID 설정
    },
    setPWD: (state, action: PayloadAction<string>) => {
      state.password = action.payload; // Password 설정
      },
      setNickName: (state, action : PayloadAction<string>) => {
          state.nickName = action.payload;
    },
    login: (state) => {
      state.isLogged = true; // 로그인 상태 true로 변경
    },
    logout: (state) => {
      state.isLogged = false; // 로그아웃 상태 false로 변경
      state.ID = ''; // 로그아웃 시 ID와 password 초기화
      state.password = '';
    },
    setSubType: (state, action :  PayloadAction<number>) => {
      state.subscribeType = action.payload; // ID 설정
    },
  },
});

// 액션 내보내기
export const { setID, setPWD, setNickName, login, logout, setSubType } = authSlice.actions;

// 리듀서 내보내기
export default authSlice.reducer;
