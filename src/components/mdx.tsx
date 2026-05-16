import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { BankIcon } from './BankIcon';
import { PaymentItem } from './PaymentItem';
import * as Twoslash from "fumadocs-twoslash/ui";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    PaymentItem,
    BankIcon,
    ...Twoslash,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}