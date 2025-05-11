/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FriendRelationshipVO } from './FriendRelationshipVO';
import type { OrderItem } from './OrderItem';
export type Page_FriendRelationshipVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<FriendRelationshipVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

