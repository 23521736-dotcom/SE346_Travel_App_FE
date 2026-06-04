declare module 'react-i18next' {
  import type { Module, NewableModule } from 'i18next';

  export const useTranslation: (ns?: string | string[], options?: any) => {
    t: (key: string, options?: any) => string;
    i18n: any;
    ready: boolean;
  };

  export const initReactI18next: NewableModule<Module> & { type: '3rdParty'; init: (i18n: any) => void };
  export const Trans: any;
  export const withTranslation: any;
}
