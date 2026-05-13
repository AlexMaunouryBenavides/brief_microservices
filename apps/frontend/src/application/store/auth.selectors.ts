import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';

const selectAuth = (state: RootState) => state.auth;

export const selectAccessToken = createSelector(selectAuth, (auth) => auth.accessToken);
export const selectUser = createSelector(selectAuth, (auth) => auth.user);
export const selectIsAuthenticated = createSelector(
  selectAuth,
  (auth) => auth.accessToken !== null,
);
export const selectIsAdmin = createSelector(
  selectAuth,
  (auth) => auth.user?.role === 'admin',
);
