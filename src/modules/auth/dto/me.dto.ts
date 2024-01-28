import { IntersectionType } from '@nestjs/swagger'
import { User } from 'src/modules/auth/dto/user.dto'

export class Me extends IntersectionType(User) {}
