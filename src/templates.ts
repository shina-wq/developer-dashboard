import type { SimpleIcon } from 'simple-icons';
import type { QuickLink, Resource, View } from './types.ts';

// Lucide icon paths (24×24, stroke-based)
const icons = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  wrench:
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  external:
    '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  code: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
  sprout:
    '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  searchX:
    '<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
};

const svg = (paths: string, cls = 'size-5', fill = 'none', strokeWidth = 2) =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

// Near-black brand colours (Vercel, Notion, GitHub…) turn white in dark mode so they stay visible
const isDarkHex = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return r * 0.299 + g * 0.587 + b * 0.114 < 60;
};

const brandIcon = (icon: SimpleIcon, size = 'size-10') =>
  `<svg class="${size} shrink-0 ${isDarkHex(icon.hex) ? 'dark:fill-white' : ''}" viewBox="0 0 24 24" fill="#${icon.hex}" aria-hidden="true"><path d="${icon.path}"/></svg>`;

export const navItems: { view: View; label: string; icon: string }[] = [
  { view: 'home', label: 'Home', icon: icons.home },
  { view: 'resources', label: 'Resources', icon: icons.book },
  { view: 'tools', label: 'Tools', icon: icons.wrench },
  { view: 'learning', label: 'Learning Paths', icon: icons.cap },
  { view: 'bookmarks', label: 'Bookmarks', icon: icons.bookmark },
];

export const navLink = (item: (typeof navItems)[number], active: boolean) => `
  <button type="button" data-view="${item.view}" ${active ? 'aria-current="page"' : ''}
    class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-50 text-blue-900 dark:bg-blue-500/15 dark:text-blue-200'
        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
    }">
    ${svg(item.icon, 'size-5', 'none', 1.75)} ${item.label}
  </button>`;

export const hero = () => `
  <section class="relative overflow-hidden rounded-lg bg-slate-800 bg-[repeating-radial-gradient(circle_at_88%_50%,transparent_0,transparent_22px,rgb(255_255_255/0.04)_23px,transparent_24px)] px-8 py-10 text-white dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
    <div class="flex items-center justify-between gap-8">
      <div>
        <p class="text-xs font-medium tracking-wider text-slate-300 uppercase">Developer Dashboard</p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight">Build. Learn. Grow.</h1>
        <p class="mt-3 max-w-md leading-relaxed text-slate-200">Curated resources, tools and documentation to help you level up as a developer.</p>
      </div>
      ${svg(icons.code, 'mr-6 hidden size-20 shrink-0 text-indigo-400 sm:block', 'none', 1.5)}
    </div>
  </section>`;

export const chip = (label: string, active: boolean) => `
  <button type="button" data-category="${label}" aria-pressed="${active}"
    class="rounded-full px-5 py-2 text-sm font-medium transition-colors ${
      active
        ? 'bg-slate-900 text-white dark:bg-indigo-500'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
    }">
    ${label}
  </button>`;

export const sectionHeader = (title: string) => `
  <div class="mb-4 flex items-center justify-between">
    <h2 class="text-lg font-semibold">${title}</h2>
    <button type="button" data-view="resources" class="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
      View all ${svg(icons.arrow, 'size-3.5')}
    </button>
  </div>`;

export const resourceCard = (r: Resource, saved: boolean) => `
  <article class="flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
    <div class="flex items-start justify-between">
      ${brandIcon(r.icon)}
      <button type="button" data-bookmark="${r.name}" aria-pressed="${saved}" aria-label="${saved ? 'Remove' : 'Add'} ${r.name} bookmark"
        class="-m-1 rounded-md p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${saved ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}">
        ${svg(icons.bookmark, 'size-4.5', saved ? 'currentColor' : 'none', 1.75)}
      </button>
    </div>
    <h3 class="mt-4 font-semibold">${r.name}</h3>
    <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">${r.description}</p>
    <div class="mt-4 flex items-center justify-between gap-2">
      <div class="flex flex-wrap gap-2 text-xs font-medium">
        <span class="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">${r.category}</span>
        ${r.tags.map((t) => `<span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">${t}</span>`).join('')}
      </div>
      <a href="${r.link}" target="_blank" rel="noopener noreferrer" aria-label="Open ${r.name}"
        class="-m-1 rounded-md p-1 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ${svg(icons.external, 'size-4')}
      </a>
    </div>
  </article>`;

// Text typed by the user must not be parsed as HTML when inserted with innerHTML
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const emptyState = (title: string, text: string) => `
  <div class="col-span-full flex flex-col items-center rounded-lg border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
    ${svg(icons.searchX, 'size-10 text-slate-400')}
    <p class="mt-4 font-semibold">${title}</p>
    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${escapeHtml(text)}</p>
  </div>`;

export const quickLinksPanel = (links: QuickLink[]) => `
  <aside class="rounded-lg border border-slate-200 bg-white px-3 py-5 dark:border-slate-800 dark:bg-slate-900">
    <h2 class="px-3 text-lg font-semibold">Quick Links</h2>
    <ul class="mt-3">
      ${links
        .map(
          (l) => `
        <li>
          <a href="${l.link}" target="_blank" rel="noopener noreferrer"
            class="flex items-center gap-3.5 rounded-md px-3 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
            ${brandIcon(l.icon, 'size-7')}
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium">${l.name}</span>
              <span class="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">${l.description}</span>
            </span>
            ${svg(icons.chevron, 'size-4 text-slate-500')}
          </a>
        </li>`,
        )
        .join('')}
    </ul>
  </aside>`;

export const quoteCard = () => `
  <figure class="rounded-lg bg-indigo-50 p-6 dark:bg-indigo-500/10">
    ${svg(icons.sprout, 'size-6 text-indigo-600 dark:text-indigo-300', 'none', 1.75)}
    <blockquote class="mt-4 text-lg leading-snug font-medium">“Small steps every day lead to big results.”</blockquote>
    <figcaption class="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">— Unknown</figcaption>
  </figure>`;

export const placeholder = (item: (typeof navItems)[number]) => `
  <section class="flex min-h-[60vh] flex-col items-center justify-center text-center">
    <span class="grid size-14 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
      ${svg(item.icon, 'size-7')}
    </span>
    <h1 class="mt-5 text-2xl font-bold">${item.label}</h1>
    <p class="mt-2 max-w-sm text-slate-500 dark:text-slate-400">This page is coming soon. In the meantime, explore everything on the dashboard.</p>
    <button type="button" data-view="home"
      class="mt-6 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-indigo-500 dark:hover:bg-indigo-400">
      Back to dashboard
    </button>
  </section>`;
