/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem';
import type { PrivateMessageVO } from './PrivateMessageVO';
export type Page_PrivateMessageVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<PrivateMessageVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

