/* eslint-disable no-underscore-dangle */
import { Exclude, instanceToPlain } from 'class-transformer'
import { AfterLoad, BaseEntity as OriginalBse } from 'typeorm'

export class BaseEntity extends OriginalBse {
  @Exclude({ toPlainOnly: true })
  __entity?: string

  @AfterLoad() setEntityName() {
    this.__entity = this.constructor.name
  }

  toJSON() {
    return instanceToPlain(this)
  }
}
