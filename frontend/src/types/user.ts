
export interface User {
    accountNo: string,
    userName: string,
    userPassword: string,
    created: string, // string or TimeStamp?
    modified: string, // string or TimeStamp?
    subscribeType : number // number or ENUM?
}