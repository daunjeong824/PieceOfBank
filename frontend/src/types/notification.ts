
export interface notification {
    notificationId: number,
    senderKey: number,
    receiverKey: number,
    type: number, // { 1 : flag1, 2 : flag2, 3 : flag3 }
    created: string // timeStamp vs string
    status : boolean,
}

// func