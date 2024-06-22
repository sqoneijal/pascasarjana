import { useCallback, useState } from "react";

function useAtomicLock() {
   const [lock, setLock] = useState(false);

   const acquireLock = useCallback(() => {
      return new Promise((resolve, reject) => {
         if (lock) {
            reject(new Error("Lock already acquired"));
         } else {
            setLock(true);
            resolve();
         }
      });
   }, [lock]);

   const releaseLock = useCallback(() => {
      setLock(false);
   }, []);

   return [acquireLock, releaseLock];
}

export default useAtomicLock;
