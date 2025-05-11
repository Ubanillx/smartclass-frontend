/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendRequest } from './FriendRequest';
import type { OrderItem } from './OrderItem';
export type Page_FriendRequest_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<FriendRequest>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

