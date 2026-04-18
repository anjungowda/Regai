import { create } from 'zustand';
import { differenceInDays, parseISO } from 'date-fns';
import { Subscription } from '../types';

interface OrgStore {
  subscription: Subscription | null;
  daysRemainingInTrial: number | null;
  setSubscription: (sub: Subscription) => void;
  clearOrg: () => void;
}

export const useOrgStore = create<OrgStore>((set) => ({
  subscription: null,
  daysRemainingInTrial: null,
  setSubscription: (subscription) => {
    let daysRemaining = null;
    if (subscription.status === 'ACTIVE' || subscription.status === 'CANCELED') {
      // Assuming 'ACTIVE' with a recent currentPeriodEnd implies trial or active subscription limits
      const endDate = parseISO(subscription.currentPeriodEnd);
      daysRemaining = differenceInDays(endDate, new Date());
    }
    set({ subscription, daysRemainingInTrial: Math.max(0, daysRemaining || 0) });
  },
  clearOrg: () => set({ subscription: null, daysRemainingInTrial: null }),
}));
