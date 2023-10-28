declare global {
  namespace NodeJS {
    interface Module {
      hot?: {
        accept: () => void;
        dispose: (callback: () => void) => void;
      };
    }
  }
}
