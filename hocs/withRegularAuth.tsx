import { createContext } from "react";
import fetch from "isomorphic-unfetch";
import Router from "next/router";

export const UserContext = createContext<{ user: any }>({ user: null });

export const withRegularAuth = (WrappedComponent: any, { ssr = true } = {}) => {
  const Wrapper = (props: any) => {
    return (
      <UserContext.Provider value={{ user: props.user }}>
        <WrappedComponent {...props} />
      </UserContext.Provider>
    );
  };

  if (ssr || WrappedComponent.getInitialProps) {
    Wrapper.getInitialProps = async (ctx: any) => {
      const { req, res, asPath } = ctx;
      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      if (req) {
        if (!req.user) {
          req.session.returnTo = asPath;
          res.writeHead(302, { Location: `/login` });
          res.end();
          return {
            status: "redirect",
            user: null
          };
        }
        return {
          user: req.user,
          ...componentProps
        };
      }
      try {
        const res = await fetch(`/auth/me`);
        if (res.ok) {
          return res.json();
        }
        throw new Error("User not authorized");
      } catch (err) {
        await fetch(`/auth/returnTo`, {
          method: "post",
          body: JSON.stringify({
            returnTo: asPath
          }),
          headers: {
            "Content-Type": "application/json"
          }
        });
        Router.push(`/login`);
        return {
          status: "Unauthorized",
          user: null
        };
      }
    };
  }

  return Wrapper;
};
