/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiAvatarVO } from './AiAvatarVO.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_AiAvatarVO_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<AiAvatarVO>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
