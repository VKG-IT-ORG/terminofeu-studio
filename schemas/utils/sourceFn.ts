export const filter = ({
  parentPath,
}: {
  document: Record<string, unknown>
  parentPath: unknown[]
}) => {
  const lang = parentPath[0] === 'content' && typeof parentPath[1] === 'string'
    ? parentPath[1]
    : 'de'

  return {
    filter: 'lang == $lang',
    params: { lang },
  }
}
