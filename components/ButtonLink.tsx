import React from 'react';
import Link from 'next/link';

const ButtonLink = React.forwardRef(
  ({ className, href, hrefAs, children, prefetch }: any, ref: any) => (
    <Link ref={ref} href={href} as={hrefAs} prefetch={prefetch}>
      <a className={className}>{children}</a>
    </Link>
  )
);

export default ButtonLink;
