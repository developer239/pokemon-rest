import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { AuthSeedService } from 'src/modules/database/seeds/auth/auth-seed.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthSeedService],
  exports: [AuthSeedService],
})
export class AuthSeedModule {}
