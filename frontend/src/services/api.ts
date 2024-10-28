import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosClient } from "./axios";
import { account } from "../types/account";
import { jwtDecode } from "jwt-decode";


/* Interface 명시 */

/* Account API */

// 1. 계좌 생성
interface accountTypeNo {
  accountTypeUniqueNo: string;
}

// 2. 계좌 조회 (단건)
interface accountNumber {
  accountNo: string;
}

// 3. 계좌 이체
interface balanceTransfer {
  depositAccountNo: string;
  transactionBalance: number;
  withdrawalAccountNo: string;
}

// 4. 거래 내역 조회
interface historyList {
  accountNo: string;
  startDate: string;
  endDate: string;
  transactionType: string;
  orderByType: string;
}

// 5. 거래 내역 조회 (단건)
interface oneHistory {
  accountNo: string;
  transactionUniqueNo: string;
}

// // 계좌 이체 한도 변경
// interface transferLimit{
//     accountNo: string,
//     oneTimeTransferLimit: string,
//     dailyTransferLimit: string
// }

/* Directory API */

// 연락처 생성
interface makeDirectory {
  directoryId: number;
  userKey: string;
  accountNo: string;
  institutionCode: number;
  name: string;
}

/* Login API 구현 */
// 1. create [완료]
export const createUser = async (email: Record<string, string>) => {
  try {
    const response = await axiosClient.post(`/users/create`, email);

    const userKey = response.data.split(":")[1].trim();
    await AsyncStorage.setItem("myKey", userKey);
    return response;
  } catch (error) {
    console.error(error);
  }
};
// 2. regist // 다시 확인해보기
// regist - userKey 추가 입력 후 회원가입
export const registUser = async (newMember: Record<string, unknown>) => {
    try {
        const userKey = await AsyncStorage.getItem('myKey');
        console.log("my userKey : --> " + userKey)
        newMember = { ...newMember, 'userKey': userKey };
        console.log(newMember)
        return axiosClient.post(`/users/regist`, newMember);
    } catch (error) {
        console.error(error);
    }
}

// 3. login
export const loginUser = async (email: Record<string, string>) => {
  try {
    return await axiosClient.post(`/auth/login`, email);
  } catch (error) {
    console.error("로그인 에러 : " + error);
  }
};

// 4. logout
export const logoutUser = () => {
  const accessToken = AsyncStorage.getItem("accessToken");
  // 'Authorization' : `${accessToken}`
  return axiosClient.post(`/auth/logout`, {
    headers: { "Requires-Auth": true },
  });
};

// 5. ID로 유저 정보 얻어오기
export const getUserInfo = (userId: string) => {
  return axiosClient.get(`/users/${userId}`);
}

/* JWT 코드 */
// Interceptor - JWT 로직 (AccessToken & RefreshToken)
axiosClient.interceptors.request.use(
  async (config) => {
    const userKey = await AsyncStorage.getItem("myKey");

    if (!userKey) return config;

    const accessToken = await AsyncStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        // 재설정
        const response = await axiosClient.post("/auth/refresh", { refresh: refreshToken });
        // 오타인지 확인..
        const newAccessToken = response.headers["Authorization"];
        originalRequest.headers.Authorization = `${newAccessToken}`;

        // 토큰을 다시 저장
        await AsyncStorage.setItem("accessToken", newAccessToken);
        // await AsyncStorage.setItem("refreshToken", newRefreshToken);  // 필요 시

        return axiosClient(originalRequest);
      } catch (error) {
        // 에러 발생 시 저장된 정보 삭제
        await AsyncStorage.removeItem("myKey");
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
      }

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

/* Directory API */
interface UserInfo {
  userKey: string;
  accountNo: string;
  institutionCode: number;
  name: string;
  url: string;
}

interface UserDirectory {
  directory: UserInfo;
  file: string;
}

// 1. 연락처 수정 - PUT
export const updateDirectory = async (id: number, data: Record<string, string>) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    return axiosClient.put(`/directory/put/${id}`, data, {
        headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
    });
};

// 2. 연락처 등록 - POST
export const createDirectory = async (data: FormData) => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  return axiosClient.post(`/directory/create`, data, {
    headers: {
      Authorization: `${accessToken}`,
      'Content-Type': 'multipart/form-data',
      "Requires-Auth": true
    },
  });
};
// 3. 연락처 조회 - GET
export const getDirectory = async () => {

  const accessToken = await AsyncStorage.getItem("accessToken");
  return axiosClient.get(`/directory/find`, {
    headers: { Authorization: `${accessToken}`,  "Requires-Auth": true },
  });
};
// 4. 연락처 삭제 - DELETE
export const deleteDirectory = (accountNo: string) => {
    return axiosClient.delete(`/directory/delete/${accountNo}`);
};

/* Account API */
// 1. 계좌 생성 - POST @@@
export const createAccount = async (data: Record<string, string>) => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  console.log("createAccoutn - AccessToken : " + accessToken)
  console.log(accessToken);
  return axiosClient.post(`/account/client/createDemandDepositAccount`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};
// 2. 계좌 목록 조회 ★★ - 빈 객체 넣어줘야 요청 잘 들어감
export const getAccountList = async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  console.log("getAccountList - AccessToken : " + accessToken)
  console.log(accessToken);
  return axiosClient.post(
    `/account/client/inquireDemandDepositAccountList`,
    {},
    {
      headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
    }
  );
};

// 3. 계좌 조회(단건) @@@
export const getAccount = async (data: Record<string, string>) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    return axiosClient.post(`/account/client/inquireDemandDepositAccount`, data, {
        headers : { Authorization: `${accessToken}`, "Requires-Auth": true }
    })
}
// 4. 계좌 이체 
export const accountTransfer = async (data: Record<string, unknown>) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log(`토큰확인확인 ${accessToken}`)
    return axiosClient.post(`/account/client/updateDemandDepositAccountTransfer`, data, {
        // headers:{userKey:'1bf84ad8-160e-4b31-b6ae-73ea4064cfad'}
        headers: { Authorization: `${accessToken}`  },
    } )
}
// 5. 거래 내역 조회
export const getHistoryList = (data: Record<string, unknown>) => {
    const accessToken = AsyncStorage.getItem("accessToken");
    return axiosClient.post(`/account/client/inquireTransactionHistoryList`, data, {
        // headers:{userKey:'1bf84ad8-160e-4b31-b6ae-73ea4064cfad'}
        headers: { Authorization: `${accessToken}` },
    })
}
// 6. 거래 내역 조회(단건)
export const getHistory = (data:oneHistory, key:number) => {
    const accessToken = AsyncStorage.getItem("accessToken");
    return axiosClient.post(`/account/client/inquireTransactionHistory`, data, {
        // headers:{userKey:key}
    })
}
// 입금??
export const addMoney = (data: Record<string, unknown>) => {
    const accessToken = AsyncStorage.getItem("accessToken");

    return axiosClient.post(`/account/client/updateDemandDepositAccountDeposit`, data, {
        headers:{ Authorization: `${accessToken}` },
    })
}

// 7. 대표 계좌 등록
export const accountPatch = (data: Record<string, any>) => {

    console.log("setPrimaryAccount #####")
    console.log(data)

    return axiosClient.patch(`users/setPrimaryAccount`, data)
}

/* Media API */
// // 1. 미디어 등록 - POST
// export const mediaPost = (data:Record<string, unknown>) => {

//   const accessToken = AsyncStorage.getItem("accessToken");
//   return axiosClient.post(`/media/upload`, {
//     headers: {
//       Authorization: `${accessToken}` 
//     }, params:data
//   });

//   // return axiosClient.post(`/media/upload`, {params:data}, {
//   //   headers: {
//   //     Authorization: `${accessToken}` 
//   //   },
//   // });
// };
export const mediaPost = (
  transNo: number,
  type: string,
  content: string,
  data: FormData
) => {
  const accessToken = AsyncStorage.getItem("accessToken");
  return axiosClient.post(`/media/upload`, data, {
    headers: {
      Authorization: `${accessToken}`,
      'Content-Type': 'multipart/form-data'
    },
    params: {
      transactionUniqueNo: transNo,
      type: type,
      content: content,
    },
  });
};

// 2. 미디어 조회 - GET
export const mediaGet = async (data:Record<string, unknown>) => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  return axiosClient.get(`/media/find/`, 
   { headers: {
          Authorization: `${accessToken}`, 
      'Content-Type': 'multipart/form-data',
      
    }, 
}
  );
};

/* Pending API */
// 1. 이체 대기 등록 - POST
export const pendingPost = () => {};

// 2. 이체 대기 내역 조회 - GET
export const pendingGet = () => {};

// 3. 이체 대기 취소 - DELETE
export const pendingDelete = () => {};

/* Notification API */
// 1. 알림 생성 !!
export const notifyPost = (data: Record<string, string>) => {
  const accessToken = AsyncStorage.getItem("accessToken");

  return axiosClient.post(`/notification`, data,
    {headers:{Authorization : `${accessToken}`}}
  );
};
// 2. 알림 조회(전체) !!
export const notifyList = (data: Record<string, unknown>) => {
  return axiosClient.get(`/notification`, { params: data });
};
// 3. 알림 조회(단건)
export const notifyGet = (notificationId: number) => {
  return axiosClient.get(`/notification/${notificationId}`);
};
// 4. 알림 업데이트 (읽음 처리)
export const notifyUpdate = (notificationId: number) => {
  return axiosClient.patch(`/notification/read/${notificationId}`);
};
// 5. 알림 업데이트 (삭제)
export const notifyDelete = (notificationId: number) => {
  return axiosClient.patch(`/notification/delete/${notificationId}`);
};
// // 6. 거래 한도 이상일 때 자식에게 알림 (pending History 저장됐을 때)
// export const notifyLimitRequest = () => {
//   return axiosClient.post(`api/notification/transfers/request`);
// };
// 7. 부모 거래 승인 처리
export const transferApproval = (data:Record<string,unknown>) => {
  return axiosClient.patch(`/transfers/approval`, data);
};
// 8. 부모 거래 거부 처리
export const transferRefusal = () => {
  return axiosClient.patch(`/transfers/refusal`);
};
// // 9. 부모 거래 만료 처리
// export const transferExpiry = () => {
//   return axiosClient.patch(`api/notification/transfers/expiry`);
// };


export const sendExpoNotification = (data: Record<string, string>) => {
  console.log(data)
  return axiosClient.post(`/notification/expoMessage`, data);
};

/* Subscription API */

// 1. 보호 관계 요청 (보호자 → 피보호자)
export const subscriptionPost = (data:Record<string,string>) => {
    return axiosClient.post(`/subscriptions/request`, data)
  }

// 2. 보호 관계 수락
export const subscriptionApproval = (Id:number) => {
    return axiosClient.patch(`/subscriptions/approval/${Id}`)
  }

// 3. 보호 관계 거절 // {params: data}
export const subscriptionRefusal= (Id:number) => {
    return axiosClient.patch(`/subscriptions/refusal/${Id}`) 
  }

// 4. 보호 관계 조회 - 보호자
export const subTargetCheck= () => {
  const accessToken = AsyncStorage.getItem("accessToken");
    return axiosClient.get(`/subscriptions/findByTarget`,
        {headers:{Authorization : `${accessToken}`, "Requires-Auth": true }}
    )
  }

// 5. 보호 관계 조회 - 피보호자
export const subProtectCheck= async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    return axiosClient.get(`/subscriptions/findByProtect`,
        {headers:{ Authorization : `${accessToken}`, "Requires-Auth": true }}  
    )
  }

// 6. 보호 관계 요청자 이름 조회
export const subscriptionName= (Id:number) => {
    const accessToken = AsyncStorage.getItem("accessToken");
    return axiosClient.get(`/subscriptions/${Id}`)
  }

// 7. 보호 관계 금액 제한 - 1회
export const subOnce= (data:Record<string,number>) => {
    const accessToken = AsyncStorage.getItem("accessToken");
    return axiosClient.put(`/subscriptions/setOneTime`,
        data, {headers:{ Authorization : `${accessToken}`}} 
    )
  }

// 8. 보호 관계 금액 제한 - 하루
export const subDaily= (data:Record<string,number>) => {
  const accessToken = AsyncStorage.getItem("accessToken");
  return axiosClient.put(`/subscriptions/setDaily`,
    data, { headers:{ Authorization : `${accessToken}`} }
    )
  }

// 4. 보호 관계 생성 
// export const subscriptionCreate= (data:Record<string,string>) => {
//     const accessToken = AsyncStorage.getItem("accessToken");
//     console.log(accessToken)
//     return axiosClient.post(`/subscriptions/create`,data,
//     )
// }


/* Token */
export const sendToken = (userKey: string, token: string) => {
  return axiosClient.post(`/token`, {
    userKey: userKey,
    token: token,
  });
};

export const getToken = (userKey: string) => {
  return axiosClient.get(`/token/${userKey}`);
};

export const deleteToken = (userKey: string) => {
  return axiosClient.delete(`/token/${userKey}`);
};

// 2. 보호 관계 순서 수정 - PUT
export const subscriptionOrderUpdate = () => {};
// 3. 보호 관계 삭제 - DELETE
export const subscriptionDelete = () => {};
// 4. 보호 관계 수정 - PUT
export const subscriptionUpdate = () => {};
