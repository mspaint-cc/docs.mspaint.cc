import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { PaymentItem } from '@/components/PaymentItem';
import { BankIcon } from '@/components/BankIcon';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    PaymentItem,
    BankIcon,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;