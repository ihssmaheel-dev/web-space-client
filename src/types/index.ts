export type ImageType = "icon" | "image";

export interface WebsiteI {
    no: number;
    id: string;
    name: string;
    image?: string;
    imageType?: ImageType;
    url: string;
    createdAt: number;
}

export interface CategoryI {
    no: number;
    id: string;
    name: string;
    icon: string;
    websites?: WebsiteI[];
}