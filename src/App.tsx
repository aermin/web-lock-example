import React, {
  useEffect,
  useState,
} from 'react';

import type {
  LockManager,
  LockManagerSnapshot,
} from 'navigator.locks';

// import type {
//   LockManager,
//   LockManagerSnapshot,
// } from './polyfill';

function do_something(lockNumber: number, time = 6000) {
  return new Promise((res) => {
    setTimeout(() => {
      res(123);
      console.log(
        `do_something inside lock whose lockNumber is ${lockNumber}~~`,
        new Date()
      );
    }, time);
  });
}

// const sleep = async (ms: number) =>
//   new Promise((resolve) => setTimeout(() => resolve(0), ms));

const createExclusiveLock = async (lockNumber: number) => {
  navigator.locks.request("resource", async (lock) => {
    console.log(
      `---exclusive lock whose lockNumber is ${lockNumber}`,
      new Date(),
      lock
    );
    await do_something(lockNumber);
  }).catch(err => {
    console.log('ExclusiveLock execute err', err);
  });
  lockNumber++;
};

async function createSharedLock(lockNumber: number) {
  navigator.locks.request("resource", { mode: "shared" }, async (lock) => {
    console.log(
      `---shared lock whose lockNumber is ${lockNumber}`,
      new Date(),
      lock
    );
    await do_something(lockNumber);
  });
  lockNumber++;
}

async function createStealLock(lockNumber: number) {
  navigator.locks.request("resource", { steal: true }, async (lock) => {
    console.log(
      `---steal lock whose lockNumber is ${lockNumber}`,
      new Date(),
      lock
    );
    await do_something(lockNumber);
  });
  lockNumber++;
}

export default function App() {
  const [queryResult, setQueryResult] = useState({} as LockManagerSnapshot);
  const [exclusiveLockNumber, updateExclusiveLockNumber] = useState(0);
  const [sharedLockNumber, updateSharedLockNumber] = useState(0);
  const [stealLockNumber, updateStealLockNumber] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      setQueryResult(await (navigator.locks as LockManager).query());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const _createExclusiveLock = () => {
    const num = exclusiveLockNumber + 1;
    createExclusiveLock(num);
    updateExclusiveLockNumber(num);
  };

  const _createSharedLock = () => {
    const num = sharedLockNumber + 1;
    createSharedLock(num);
    updateSharedLockNumber(num);
  };

  const _createStealLock = () => {
    const num = stealLockNumber + 1;
    createStealLock(num);
    updateStealLockNumber(num);
  };

  return (
    <div>
      <button onClick={_createExclusiveLock}>
        request a exclusive locks, lockNumber is {exclusiveLockNumber}
      </button>
      <button onClick={_createSharedLock}>
        request a shared lock, lockNumber is {sharedLockNumber}
      </button>
      <button onClick={_createStealLock}>
        request a steal lock, lockNumber is {stealLockNumber}
      </button>
      <div>
        <h1>held locks:</h1>
        <br />
        {queryResult.held?.map((lock) => {
          return (
            <span key={lock.uuid}>
              {lock.mode + "  " + lock.uuid}
              <br />
            </span>
          );
        })}
        <br />
        <h1>pending locks:</h1>
        <br />
        {queryResult.pending?.map((lock) => {
          return (
            <span key={lock.uuid}>
              {lock.mode + "  " + lock.uuid}
              <br />
            </span>
          );
        })}
      </div>
    </div>
  );
}
