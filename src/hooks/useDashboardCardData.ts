/**
 * useDashboardCardData
 * ──────────────────────────────────────────────────────────────────────────────
 * Fetches live data from the snapshot-service for the selected dashboard card
 * and returns a CardViewData object with real values substituted in.
 *
 * The static cardViewDataMap entry is used only as a structural template passed
 * to the service layer (labels, colours, chart types).  Only numeric values and
 * data arrays are replaced with live API data.
 *
 * While fetching, data is null and loading is true — the UI shows a loading
 * indicator.  If the API returns no data or fails, data remains null and the UI
 * renders a "No Data" empty state instead of dummy placeholder values.
 */

import { useState, useEffect, useRef } from 'react';
import { cardViewDataMap } from '@constants/ADMIN_DASHBOARD_CARDS';
import type { CardViewData } from '@constants/ADMIN_DASHBOARD_CARDS';
import {
  fetchAndMergeCardData,
  type DashboardFilters,
} from '../services/dashboardService';

interface UseDashboardCardDataResult {
  /** CardViewData with live values merged in; null when loading or no data available */
  data: CardViewData | null;
  /** True while the API call is in-flight */
  loading: boolean;
  /** Error message if the fetch failed; data will be null when this is set */
  error: string | null;
}

/**
 * @param cardId   - The dashboard card ID (e.g. 'participant-enrollment')
 * @param filters  - Optional filter params to forward to the API
 */
export function useDashboardCardData(
  cardId: string | null,
  filters?: DashboardFilters,
): UseDashboardCardDataResult {
  const staticTemplate = cardId ? (cardViewDataMap[cardId] ?? null) : null;

  // Start with null — never show dummy placeholder values while loading
  const [data, setData]       = useState<CardViewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // Keep a ref to detect stale responses when cardId or filters change rapidly
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!cardId || !staticTemplate) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Show loading state — do NOT pre-fill with the static template
    // (that would display dummy placeholder values instead of real data)
    setData(null);
    setLoading(true);
    setError(null);

    const thisRequestId = ++requestIdRef.current;

    fetchAndMergeCardData(cardId, staticTemplate, filters)
      .then(merged => {
        if (thisRequestId !== requestIdRef.current) return; // stale — discard
        setData(merged);
      })
      .catch(err => {
        if (thisRequestId !== requestIdRef.current) return;
        setError(err?.message ?? 'Failed to load live data');
        setData(null); // Keep null so the UI renders a "No Data" state
      })
      .finally(() => {
        if (thisRequestId === requestIdRef.current) {
          setLoading(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, JSON.stringify(filters)]);

  return { data, loading, error };
}
