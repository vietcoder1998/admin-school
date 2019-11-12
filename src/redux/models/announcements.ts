import { identifier } from "@babel/types"

export interface IAnnouncement {
    id: string;
    imageUrl: string;
    announcementType: {
        id: number;
        name: string;
        priority;
    };
    title: string;
    viewNumber: number;
    hidden: boolean;
    createdDate: number;
    lastModified: number;
    admin: {
        id: string;
        firstName?: string;
        lastName?: string;
        avatarUrl?: string;
    }
    modifyAdmin: {
        id?: string;
        firstName?: string;
        lastfName?: string;
        avartarUrl?: string;
    }
}

export interface IAnnouncements {
    items: Array<IAnnouncement>;
    pageIndex: number;
pageSize: number;
    pageSize: number;
    totalItems: number;
}