import { rand, randNumber } from '@ngneat/falso'

export const randMultiple = <TItem>(items: TItem[]) => {
  const count = randNumber({ min: 1, max: items.length })
  const result: TItem[] = []

  for (let i = 0; i < count; i += 1) {
    const item = rand(items)
    if (!result.includes(item)) {
      result.push(item)
    }
  }

  return result
}
