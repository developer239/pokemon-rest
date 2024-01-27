import { Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from 'src/modules/auth/decorators/public.decorator'

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    try {
      // Authorize user
      const result = await super.canActivate(context)
      return result
    } catch (error) {
      // If user is not authorized, check if the route is public
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()]
      )

      // If route is public, allow access
      if (isPublic) {
        return true as any
      }

      throw error
    }
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }
}
