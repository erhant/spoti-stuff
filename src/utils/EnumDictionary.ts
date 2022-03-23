// https://stackoverflow.com/questions/54542318/using-an-enum-as-a-dictionary-key
export type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U;
};
