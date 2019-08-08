export interface UMPMC<M> {
  send(e: M): void;
  next<T extends Partial<M>, U extends Partial<M>>(ys: T[], ns?: U[]): Promise<Extract<M, T>>;
}
export default function<M>(): UMPMC<M>;
