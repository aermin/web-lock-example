import {
  Lock,
  LockInfo,
  LockManager,
  LockManagerSnapshot,
  LocksInfo,
} from './polyfill';

(function () {
  const navigator = window?.navigator as Navigator & { locks: LockManager };
  // if(navigator) {
  //   if (!navigator.locks) {
  const lockManager = new LockManager();
  console.log("lockManager====", lockManager);
  Object.defineProperty(navigator, "locks", {
    value: lockManager
  });
  // console.error('window.navigator not exist!');
  //   }
  // }
})();
export type { Lock, LockInfo, LockManager, LockManagerSnapshot, LocksInfo };
