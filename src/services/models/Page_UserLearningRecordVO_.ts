/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem';
import type { UserLearningRecordVO } from './UserLearningRecordVO';
export type Page_UserLearningRecordVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<UserLearningRecordVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};

