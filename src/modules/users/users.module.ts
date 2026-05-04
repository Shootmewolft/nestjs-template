import { PaginationModule } from "@common/pagination/pagination.module";
import { PaginationService } from "@common/pagination/pagination.service";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/database";
import { PAGINATION_SERVICE, UsersService } from "./application/users.service";
import { USER_REPOSITORY } from "./domain/user.repository.interface";
import { UsersRepository } from "./infrastructure/database/users.repository";
import { UsersController } from "./presentation/http/users.controller";

@Module({
	imports: [DatabaseModule, PaginationModule],
	controllers: [UsersController],
	providers: [
		UsersService,
		{
			provide: USER_REPOSITORY,
			useClass: UsersRepository,
		},
		{
			provide: PAGINATION_SERVICE,
			useClass: PaginationService,
		},
	],
	exports: [UsersService],
})
export class UsersModule {}
