import { ValueTransformer } from 'typeorm'

export class RangeTransformer implements ValueTransformer {
  from(value: string): { minimum: number; maximum: number } {
    const regex = /\[(.*),(.*)\)/u
    const match = regex.exec(value)

    return {
      minimum: parseFloat(match?.[1] || '0') ,
      maximum: parseFloat(match?.[2] || '0'),
    }
  }

  to(value: { minimum: number; maximum: number }): string {
    return `[${value.minimum},${value.maximum})`
  }
}
