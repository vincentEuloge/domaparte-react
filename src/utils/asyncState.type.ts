export interface NotAsked {
  readonly status: 'NotAsked'
}

export interface Loading {
  readonly status: 'Loading'
}

export interface None {
  readonly status: 'None'
}

export interface Fine {
  readonly status: 'Fine'
}

export interface Some<T> {
  readonly status: 'Some'
  readonly value: T
}

export interface Error {
  readonly status: 'Error'
  readonly value: string
}

export type Done<T> = T extends boolean ? Fine : None | Some<T>

export type AsyncStateType<T> = NotAsked | Loading | Done<T> | Error;
