export interface IAdminAccount {
    id?: string,
    username?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    avatarUrl?: string,
    createdDate?: number,
    lastActive?: number,
    banned?: false,
    role?: {
        id?: number,
        name?: string,
        type?: string,
    }
}