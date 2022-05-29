export type FC<T = {}> = {
  (props: T): JSX.Element;

  displayName: string;
};