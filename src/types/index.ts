export type ImageType = "icon" | "image";

export interface WebsiteI {
    no: number;
    id: string;
    name: string;
    image?: string;
    imageType?: ImageType;
    url: string;
    createdAt: number;
    updatedAt?: number;
}

export interface CategoryI {
    no: number;
    id: string;
    name: string;
    icon: string;
    websites?: WebsiteI[];
    createdAt: number;
    updatedAt?: number;
}

export interface ChromeBookmark {
    children?: ChromeBookmark[];
    dateAdded: number;
    id: string;
    index: number;
    parentId: string;
    title: string;
    url?: string;
    isRoot?: boolean; // Add isRoot property
}

export interface WebsiteInfoMap {
    iconUrl: string;
}

export interface SelectedWebsite {
    categoryIndex: number;
    websiteIndex: number;
    title?: string;
    website?: WebsiteI;
}