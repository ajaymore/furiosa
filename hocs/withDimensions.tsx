import React, { createContext } from "react";
import nextCookie from "next-cookies";
import cookie from "js-cookie";

export const DimensionsContext = createContext({
  width: 0,
  height: 0
});

export const withDimensions = (WrappedComponent: any, _options: any) => {
  class Wrapper extends React.Component<any, any> {
    static async getInitialProps(ctx: any) {
      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));
      const { height, width } = nextCookie(ctx);
      return {
        ...componentProps,
        height: height ? height : 0,
        width: width ? width : 0
      } as any;
    }

    state = {
      width: this.props.width,
      height: this.props.height
    };

    handleResize = () => {
      cookie.set("height", window.innerHeight.toString());
      cookie.set("width", window.innerWidth.toString());
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    componentDidMount() {
      this.handleResize();
      window.addEventListener("resize", this.handleResize);
    }

    render() {
      return (
        <DimensionsContext.Provider value={{ ...this.state }}>
          <WrappedComponent {...this.props} {...this.state} />
        </DimensionsContext.Provider>
      );
    }
  }

  return Wrapper;
};
