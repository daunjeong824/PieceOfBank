declare module "*.jpg";
declare module "*.png";
declare module "*.jpeg";
declare module "*.gif";

declare module '@env' {
    export const EXPO_BACKEND_ADDRESS: string;
    // 필요한 다른 환경 변수들도 여기에 추가하세요.
  }