/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserVO } from './UserVO';
export type PrivateMessageVO = {
    content?: string;
    createTime?: string;
    id?: number;
    isRead?: number;
    receiverId?: number;
    receiverUser?: UserVO;
    senderId?: number;
    senderUser?: UserVO;
};

