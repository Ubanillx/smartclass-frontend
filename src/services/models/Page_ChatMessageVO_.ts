/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatMessageVO } from './ChatMessageVO.ts';
import type { OrderItem } from './OrderItem.ts';
export type Page_ChatMessageVO_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<ChatMessageVO>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
