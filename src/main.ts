import './style.css';
import { categories, quickLinks, resources } from './data.ts';
import {
  chip,
  emptyState,
  hero,
  navItems,
  navLink,
  placeholder,
  quickLinksPanel,
  quoteCard,
  resourceCard,
  sectionHeader,
} from './templates.ts';
import type { Category, Resource, View } from './types.ts';

const BOOKMARKS_KEY = 'devhub-bookmarks';
const FEATURED_COUNT = 6;

function loadBookmarks() {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? '[]'));
  } catch {
    // Corrupted or blocked storage shouldn't break the app
    return new Set<string>();
  }
}

const state = {
  view: 'home' as View,
  query: '',
  category: 'All' as Category | 'All',
  bookmarks: loadBookmarks(),
};

const nav = document.querySelector<HTMLElement>('#nav')!;
const content = document.querySelector<HTMLElement>('#content')!;
const search = document.querySelector<HTMLInputElement>('#search')!;
const sidebar = document.querySelector<HTMLElement>('#sidebar')!;
const backdrop = document.querySelector<HTMLElement>('#backdrop')!;
const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle')!;
const desktop = matchMedia('(min-width: 1024px)');

function filterResources() {
  const query = state.query.trim().toLowerCase();

  return resources.filter((r) => {
    const inView =
      state.view === 'bookmarks'
        ? state.bookmarks.has(r.name)
        : state.category === 'All' || r.category === state.category;
    const text = [r.name, r.description, r.category, ...r.tags].join(' ').toLowerCase();
    return inView && text.includes(query);
  });
}

function resourceGrid(list: Resource[], emptyTitle: string, emptyText: string) {
  const cards = list.map((r) => resourceCard(r, state.bookmarks.has(r.name))).join('');

  return `
    <div class="@container">
      <div class="grid gap-5 @xl:grid-cols-2 @3xl:grid-cols-3">
        ${cards || emptyState(emptyTitle, emptyText)}
      </div>
    </div>`;
}

function chipBar() {
  const chips = ['All', ...categories].map((c) => chip(c, c === state.category)).join('');
  return `<div class="flex flex-wrap gap-2.5">${chips}</div>`;
}

function homeView() {
  const title = state.category === 'All' ? 'Featured Resources' : `${state.category} Resources`;
  const featured = filterResources().slice(0, FEATURED_COUNT);

  return `
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div class="min-w-0 space-y-6">
        ${hero()}
        ${chipBar()}
        <section class="pt-4">
          ${sectionHeader(title)}
          ${resourceGrid(featured, 'No resources found', `Nothing matches “${state.query}”. Try another search or category.`)}
        </section>
      </div>
      <div class="h-fit space-y-6">
        ${quickLinksPanel(quickLinks)}
        ${quoteCard()}
      </div>
    </div>`;
}

function resourcesView() {
  const list = filterResources();

  return `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold">Resources</h1>
        <p class="mt-1 text-slate-500 dark:text-slate-400">Browse every tutorial, doc and tool in one place.</p>
      </div>
      ${chipBar()}
      <section class="pt-4">
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Showing ${list.length} of ${resources.length} resources</p>
        ${resourceGrid(list, 'No resources found', `Nothing matches “${state.query}”. Try another search or category.`)}
      </section>
    </div>`;
}

function bookmarksView() {
  const grid =
    state.bookmarks.size === 0
      ? resourceGrid(
          [],
          'No bookmarks yet',
          'Tap the bookmark icon on any resource to save it here.',
        )
      : resourceGrid(
          filterResources(),
          'No bookmarks found',
          `None of your bookmarks match “${state.query}”.`,
        );

  return `<h1 class="mb-6 text-2xl font-bold">Bookmarks</h1>${grid}`;
}

function render() {
  nav.innerHTML = navItems.map((item) => navLink(item, item.view === state.view)).join('');

  const views: Partial<Record<View, () => string>> = {
    home: homeView,
    resources: resourcesView,
    bookmarks: bookmarksView,
  };
  content.innerHTML =
    views[state.view]?.() ?? placeholder(navItems.find((item) => item.view === state.view)!);
}

function setView(view: View) {
  state.view = view;
  toggleSidebar(false);
  window.scrollTo({ top: 0 });
  render();
}

function toggleBookmark(name: string) {
  if (state.bookmarks.has(name)) {
    state.bookmarks.delete(name);
  } else {
    state.bookmarks.add(name);
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...state.bookmarks]));
  render();
  // Re-rendering replaces the button, so restore keyboard focus to it
  content.querySelector<HTMLButtonElement>(`[data-bookmark="${name}"]`)?.focus();
}

function toggleSidebar(open: boolean) {
  sidebar.classList.toggle('-translate-x-full', !open);
  backdrop.classList.toggle('hidden', !open);
  menuToggle.setAttribute('aria-expanded', String(open));
  // On mobile the closed drawer is off-screen, so keep it out of the Tab order
  sidebar.inert = !open && !desktop.matches;
  if (open) {
    nav.querySelector<HTMLElement>('[aria-current]')?.focus();
  }
}

nav.addEventListener('click', (e) => {
  const button = (e.target as HTMLElement).closest<HTMLElement>('[data-view]');
  if (button) {
    setView(button.dataset.view as View);
  }
});

content.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const categoryButton = target.closest<HTMLElement>('[data-category]');
  const bookmarkButton = target.closest<HTMLElement>('[data-bookmark]');
  const viewButton = target.closest<HTMLElement>('[data-view]');

  if (categoryButton) {
    state.category = categoryButton.dataset.category as Category | 'All';
    render();
  } else if (bookmarkButton) {
    toggleBookmark(bookmarkButton.dataset.bookmark!);
  } else if (viewButton) {
    setView(viewButton.dataset.view as View);
  }
});

search.addEventListener('input', () => {
  state.query = search.value;
  // Searching from a placeholder page shows the results on the Resources page
  if (state.view === 'tools' || state.view === 'learning') {
    state.view = 'resources';
  }
  render();
});

document.querySelector('#theme-toggle')!.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

menuToggle.addEventListener('click', () => toggleSidebar(true));
backdrop.addEventListener('click', () => toggleSidebar(false));
desktop.addEventListener('change', () => toggleSidebar(false));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
    toggleSidebar(false);
    menuToggle.focus();
  }
});

render();
toggleSidebar(false);
