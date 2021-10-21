type Param<T extends string = string> = {
  param: T;
};

type PathItem<T extends string = string> = string | Param<T>;

type Params<T extends PathItem[]> = {
  [K in keyof T]: T[K] extends Param<infer ParamName> ? ParamName : never;
};

type Route<T extends PathItem[]> = {
  /**
   * Returns the location path with param variables for generating the reference file "templates.ts"
   */
  toJSON(): string;
  /**
   * Returns the location path with param variables and should be used in the Router <Switch> block. E.g. returns "/organization/:organizationId"
   */
  template(): string;
  /**
   * Returns the built URL with interpolated param values to use as the "to" prop for <Link>, <Redirect> etc. E.g. "/organization/123"
   */
  create(
    ...args: Params<T>[number] extends never
      ? []
      : [{ [key in Params<T>[number]]: string | number }]
  ): string;
};

export const param = <P extends string>(param: P): Param<P> => ({ param });
export const route = <T extends PathItem[]>(...pathItems: T): Route<T> => {
  const isParam = (p: PathItem): p is Param => !!(p as Param).param;

  const template = () =>
    '/' + pathItems.map((p) => (isParam(p) ? `:${p.param}` : p)).join('/');

  return {
    template,

    toJSON: template,

    create: (params?) =>
      '/' +
      pathItems
        .map((p) => (isParam(p) ? params?.[p.param as keyof typeof params] : p))
        .join('/'),
  };
};
