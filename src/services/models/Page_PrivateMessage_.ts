/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem';
import type { PrivateMessage } from './PrivateMessage';
export type Page_PrivateMessage_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<PrivateMessage>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

