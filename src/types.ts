import type { SimpleIcon } from 'simple-icons';

export type Category = 'Frontend' | 'Backend' | 'DevOps' | 'Tools' | 'Learning' | 'Productivity';

export type View = 'home' | 'resources' | 'tools' | 'learning' | 'bookmarks';

export interface Resource {
  name: string;
  category: Category;
  link: string;
  description: string;
  tags: string[];
  icon: SimpleIcon;
}

export interface QuickLink {
  name: string;
  description: string;
  link: string;
  icon: SimpleIcon;
}
