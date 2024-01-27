import { ValueTransformer } from 'typeorm'

export class RangeTransformer implements ValueTransformer {
  from(value: string): { minimum: number; maximum: number } {
    const regex = /\[(.*),(.*)\)/u
    const match = regex.exec(value)

    if (!match?.[1] || !match?.[2]) {
      throw new Error('Invalid range format')
    }

    return {
      minimum: parseFloat(match[1]),
      maximum: parseFloat(match[2]),
    }
  }

  to(value: { minimum: number; maximum: number }): string {
    return `[${value.minimum},${value.maximum})`
  }
}
