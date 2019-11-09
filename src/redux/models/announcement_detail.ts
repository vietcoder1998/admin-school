export interface IAnnouncementDetail {
    admin?: { id?: string, firstName?: string, lastName?: string, avatarUrl?: string };
    announcementType: { id?: number, name?: string, priority?: number };
    content?: string;
    createdDate?: number;
    hidden?: boolean;
    id?: string;
    imageUrl?: string;
    lastModified?: number
    modifyAdmin?: any;
    title?: string;
    viewNumber?: number;
    loading?: boolean;
}