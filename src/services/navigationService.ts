import { TabType } from '@/components/common/BottomNavigationBar';

type RedirectTabCallback = (tab: TabType) => void;

let redirectTabCallback: RedirectTabCallback | null = null;

export const navigationService = {
  setRedirectTabCallback(cb: RedirectTabCallback) {
    redirectTabCallback = cb;
  },
  redirectTab(tab: TabType) {
    if (redirectTabCallback) {
      redirectTabCallback(tab);
    }
  },
};
