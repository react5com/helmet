import { createContext, useContext, useCallback, useState } from 'react';
import type { ReactNode, FC, PropsWithChildren } from 'react';

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
  charset?: string;
}

export interface HelmetData {
  title?: string;
  meta: MetaTag[];
  link: Array<{
    rel: string;
    href: string;
    type?: string;
    sizes?: string;
  }>;
}

export function renderMetaTags(metaTags: MetaTag[]): string {
  return metaTags.map(tag => {
    const attributes = Object.entries(tag)
      .filter(([key]) => key !== 'content')
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    return `<meta ${attributes} content="${tag.content}">`;
  }).join('\n');
}
export interface HelmetContextValue {
  data: HelmetData;
  setTitle: (title: string) => void;
  addMeta: (meta: MetaTag) => void;
  addLink: (link: { rel: string; href: string; type?: string; sizes?: string }) => void;
  reset: () => void;
}

const defaultHelmetData: HelmetData = {
  title: undefined,
  meta: [],
  link: []
};

const HelmetContext = createContext<HelmetContextValue | null>(null);

export interface HelmetProviderProps {
  children: ReactNode;
  context?: HelmetData;
}

export const HelmetProvider: FC<HelmetProviderProps> = ({
  children,
  context = defaultHelmetData
}: PropsWithChildren<HelmetProviderProps>) => {
  const [data, setData] = useState<HelmetData>(context);

  const setTitle = useCallback((title: string) => {
    setData((prev: HelmetData) => ({ ...prev, title }));
  }, []);

  const addMeta = useCallback((meta: MetaTag) => {
    setData((prev: HelmetData) => ({
      ...prev,
      meta: [...prev.meta.filter(m => 
        !(m.name === meta.name || m.property === meta.property)
      ), meta]
    }));
  }, []);

  const addLink = useCallback((link: { rel: string; href: string; type?: string; sizes?: string }) => {
    setData((prev: HelmetData) => ({
      ...prev,
      link: [...prev.link.filter(l => l.rel !== link.rel), link]
    }));
  }, []);

  const reset = useCallback(() => {
    setData(defaultHelmetData);
  }, []);

  const contextValue: HelmetContextValue = {
    data,
    setTitle,
    addMeta,
    addLink,
    reset
  };

  return (
    <HelmetContext.Provider value={contextValue}>
      {children}
    </HelmetContext.Provider>
  );
};

export const useHelmet = (): HelmetContextValue | null => {
  const context = useContext(HelmetContext);
  return context;
};

export { HelmetContext };