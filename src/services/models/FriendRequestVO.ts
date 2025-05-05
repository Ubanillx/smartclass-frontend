/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserVO } from './UserVO';
export type FriendRequestVO = {
    createTime?: string;
    id?: number;
    message?: string;
    receiverId?: number;
    receiverUser?: UserVO;
    senderId?: number;
    senderUser?: UserVO;
    status?: string;
    statusDescription?: string;
    updateTime?: string;
};

