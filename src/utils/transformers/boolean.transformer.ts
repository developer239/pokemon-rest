import { TransformFnParams } from 'class-transformer/types/interfaces'
import { PerhapsType } from 'src/utils/types/perhaps.type'

export const booleanTransformer = (
  params: TransformFnParams
): PerhapsType<boolean | null> => {
  if (params.value === 'true') {
    return true
  }

  if (params.value === 'false') {
    return false
  }

  return null
}
