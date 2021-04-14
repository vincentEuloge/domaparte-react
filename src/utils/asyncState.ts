import type {
  NotAsked, Loading, Error, Done,
} from './asyncState.type';

export const asyncState = {
  notAsked(): NotAsked {
    return { status: 'NotAsked' };
  },
  loading(): Loading {
    return { status: 'Loading' };
  },
  error(message: string): Error {
    return {
      status: 'Error',
      value: message,
    };
  },
  done<T>(value: T | null | undefined): Done<T> {
    if (typeof value === 'boolean' && value) return { status: 'Fine' } as Done<T>;
    if (value === null || value === undefined) return { status: 'None' } as Done<T>;
    if (Array.isArray(value) && value.length === 0) return { status: 'None' } as Done<T>;

    return {
      status: 'Some',
      value,
    } as Done<T>;
  },
};
