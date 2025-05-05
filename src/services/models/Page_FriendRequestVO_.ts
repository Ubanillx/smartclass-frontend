/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendRequestVO } from './FriendRequestVO';
import type { OrderItem } from './OrderItem';
export type Page_FriendRequestVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<FriendRequestVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

