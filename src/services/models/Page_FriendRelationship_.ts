/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendRelationship } from './FriendRelationship';
import type { OrderItem } from './OrderItem';
export type Page_FriendRelationship_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<FriendRelationship>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

