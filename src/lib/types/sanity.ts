// Sanity CMS types
import { PortableTextBlock } from '@portabletext/types';

export interface SanityModule {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

export interface SanityPage {
  title: string;
  slug: string;
  modules: SanityModule[];
}

export interface TextModule extends SanityModule {
  _type: 'text';
  content: PortableTextBlock[];
}
