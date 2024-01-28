import { Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from 'src/modules/auth/decorators/public.decorator'

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Attempt to authenticate the user for all routes
      return (await super.canActivate(context)) as boolean
    } catch (error) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()]
      )

      // If the route is public, allow access even if there's an error in authentication
      if (isPublic) {
        return true
      }

      // For non-public routes, rethrow the error
      throw error
    }
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }
}
