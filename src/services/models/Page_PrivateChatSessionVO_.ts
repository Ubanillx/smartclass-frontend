/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem';
import type { PrivateChatSessionVO } from './PrivateChatSessionVO';
export type Page_PrivateChatSessionVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<PrivateChatSessionVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

