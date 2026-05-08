/**
 * Snapshot Service API Client
 * ─────────────────────────────
 * Separate axios instance for the internal snapshot-service (port 3001).
 * No auth headers are needed — this service is only reachable on localhost.
 *
 * Base URL is read from SNAPSHOT_SERVICE_URL env var; falls back to
 * http://localhost:3001 so it works out-of-the-box in development.
 */
import axios from 'axios';

// process.env is injected by webpack DefinePlugin on web
// declaring process in TypeScript makes this file safe for RN/web compile-time checks
// declare const process:
//   | {
//       env: {
//         [key: string]: string | undefined;
//       };
//     }
//   | undefined;

const snapshotApi = axios.create({
  baseURL: process.env?.SNAPSHOT_SERVICE_URL  || 'http://localhost:3001',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default snapshotApi;
