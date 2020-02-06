import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import MuiLink from '@material-ui/core/Link';

const NextComposed = React.forwardRef(function NextComposed(
  props: { as: string; href: string; prefetch: boolean; className: string },
  ref: any
) {
  const { as, href, prefetch, ...other } = props;

  return (
    <NextLink href={href} prefetch={prefetch} as={as}>
      <a ref={ref} {...other} />
    </NextLink>
  );
});

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function Link(props: {
  activeClassName: string;
  as: string;
  className: string;
  href: string;
  innerRef: any;
  naked: boolean;
  onClick: any;
  prefetch: boolean;
}) {
  const {
    activeClassName = 'active',
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props;
  const router = useRouter();

  const className = clsx(classNameProps, {
    [activeClassName]:
      router && router.pathname === props.href && activeClassName
  });

  if (naked) {
    return <NextComposed className={className} ref={innerRef} {...other} />;
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      {...other}
    />
  );
}

export default React.forwardRef((props: any, ref) => (
  <Link {...props} innerRef={ref} />
));
