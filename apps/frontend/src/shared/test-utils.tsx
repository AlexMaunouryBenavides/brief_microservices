import { render, renderHook, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../application/store/auth.slice';
import type { RootState } from '../application/store/store';

export function makeTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });
}

function Wrapper({
  children,
  store,
}: {
  children: ReactNode;
  store: ReturnType<typeof makeTestStore>;
}): ReactElement {
  return (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & { preloadedState?: Partial<RootState> },
) {
  const store = makeTestStore(options?.preloadedState);
  return {
    ...render(ui, { wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>, ...options }),
    store,
  };
}

export function renderHookWithProviders<T>(
  hook: () => T,
  preloadedState?: Partial<RootState>,
) {
  const store = makeTestStore(preloadedState);
  return {
    ...renderHook(hook, {
      wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>,
    }),
    store,
  };
}
