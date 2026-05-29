import { TabType } from '@/components/common/BottomNavigationBar';

type RedirectTabCallback = (tab: TabType) => void;
type ScrollToTopCallback = () => void;
type BabsNavigationCallback = (feedId: string) => void;

let redirectTabCallback: RedirectTabCallback | null = null;
const scrollToTopCallbacks: Record<string, ScrollToTopCallback> = {};
let babsNavigationCallback: BabsNavigationCallback | null = null;

export const navigationService = {
  setRedirectTabCallback(cb: RedirectTabCallback) {
    redirectTabCallback = cb;
  },
  redirectTab(tab: TabType) {
    if (redirectTabCallback) {
      redirectTabCallback(tab);
    }
  },
  registerScrollToTop(tab: TabType, cb: ScrollToTopCallback) {
    scrollToTopCallbacks[tab] = cb;
  },
  unregisterScrollToTop(tab: TabType) {
    delete scrollToTopCallbacks[tab];
  },
  scrollToTop(tab: TabType) {
    if (scrollToTopCallbacks[tab]) {
      scrollToTopCallbacks[tab]();
    }
  },
  setBabsNavigationCallback(cb: BabsNavigationCallback | null) {
    babsNavigationCallback = cb;
  },
  navigateToBabsFeed(feedId: string) {
    if (babsNavigationCallback) {
      babsNavigationCallback(feedId);
    }
  },
};
