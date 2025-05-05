/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrivateMessageVO } from './PrivateMessageVO';
import type { UserVO } from './UserVO';
export type PrivateChatSessionVO = {
    createTime?: string;
    id?: number;
    lastMessage?: PrivateMessageVO;
    lastMessageTime?: string;
    targetUser?: UserVO;
    unreadCount?: number;
    updateTime?: string;
    user1?: UserVO;
    user2?: UserVO;
    userId1?: number;
    userId2?: number;
};

