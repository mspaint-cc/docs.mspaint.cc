import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <div className='flex items-center gap-2'>
      <Image src='/icon.png' width={25} height={25} alt='Logo' />
      <span className='text-xl font-bold'>mspaint</span>
    </div>,
  },
};
