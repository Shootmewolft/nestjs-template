import { PaginationDto } from "@common/pagination/pagination.dto";
import { CurrentUser } from "@modules/auth/decorators/current-user.decorator";
import type { JwtPayload } from "@modules/auth/domain/jwt-payload.interface";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Query,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { UsersService } from "../../application/users.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("Users")
@ApiBearerAuth()
@Controller({ path: "users", version: "1" })
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiOperation({ summary: "List all users (paginated)" })
	@ApiOkResponse({ description: "Paginated list of users" })
	findAll(@Query() dto: PaginationDto) {
		return this.usersService.findAll(dto);
	}

	@Get("me")
	@ApiOperation({ summary: "Get current authenticated user" })
	@ApiOkResponse({ description: "Current user profile" })
	getMe(@CurrentUser() user: JwtPayload) {
		return this.usersService.findById(user.sub);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get a user by ID" })
	@ApiOkResponse({ description: "User found" })
	@ApiNotFoundResponse({ description: "User not found" })
	findOne(@Param("id", ParseUUIDPipe) id: string) {
		return this.usersService.findById(id);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Update a user" })
	@ApiOkResponse({ description: "User updated" })
	@ApiNotFoundResponse({ description: "User not found" })
	update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
		return this.usersService.update(id, dto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: "Delete a user" })
	@ApiNoContentResponse({ description: "User deleted" })
	@ApiNotFoundResponse({ description: "User not found" })
	async remove(@Param("id", ParseUUIDPipe) id: string) {
		await this.usersService.delete(id);
	}
}
