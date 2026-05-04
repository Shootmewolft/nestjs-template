export interface JwtPayload {
	sub: string;
	email: string;
	iat?: number;
	exp?: number;
}

export interface JwtRefreshPayload extends JwtPayload {
	refreshToken?: string;
}
