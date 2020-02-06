/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
  interface Global {
    window: any;
    fetch: any;
  }
}
declare module '*.png' {
  const value: any;
  export = value;
}
declare module '*.svg' {
  const value: any;
  export = value;
}
declare module '*.json' {
  const value: any;
  export = value;
}
