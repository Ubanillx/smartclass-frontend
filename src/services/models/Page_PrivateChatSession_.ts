/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem';
import type { PrivateChatSession } from './PrivateChatSession';
export type Page_PrivateChatSession_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<PrivateChatSession>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

