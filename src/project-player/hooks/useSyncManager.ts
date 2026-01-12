import { useState, useCallback, useEffect } from 'react';

export const useSyncManager = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  const syncToServer = useCallback(async () => {
    setIsSyncing(true);
    try {
      // TODO: Implement sync logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      setLastSyncTime(new Date());
      setPendingChanges(0);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const addPendingChange = useCallback(() => {
    setPendingChanges(prev => prev + 1);
  }, []);

  // Auto-sync every 5 minutes if there are pending changes
  useEffect(() => {
    if (pendingChanges > 0) {
      const interval = setInterval(() => {
        syncToServer();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [pendingChanges, syncToServer]);

  return {
    isSyncing,
    lastSyncTime,
    pendingChanges,
    syncToServer,
    addPendingChange,
  };
};



