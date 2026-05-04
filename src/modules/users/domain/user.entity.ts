export interface UserEntity {
	id: string;
	email: string;
	passwordHash: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateUserData {
	email: string;
	passwordHash: string;
	name: string;
}

export interface UpdateUserData {
	name?: string;
}
