export function re ({ raw }: TemplateStringsArray, ...values: string[]) {
  return new RegExp(raw.reduce(
    (res, cur, ind) => res + cur + (values[ind] ?? ''), '',
  )
  , 'gsu')
}
