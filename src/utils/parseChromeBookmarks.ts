import { CategoryI, WebsiteI } from '../types';
import { fetchWebsiteInfo } from './fetchWebsiteInfo'; // Ensure this function is working as expected

interface ChromeBookmark {
    children?: ChromeBookmark[];
    dateAdded: number;
    id: string;
    index: number;
    parentId: string;
    title: string;
    url?: string;
    isRoot?: boolean; // Add isRoot property
}

const STORAGE_KEY = 'websiteInfoMap';

interface WebsiteInfo {
    iconUrl: string;
}

const getWebsiteInfoMap = (): Record<string, WebsiteInfo> => {
    const map = localStorage.getItem(STORAGE_KEY);
    return map ? JSON.parse(map) : {};
};

const setWebsiteInfoMap = (map: Record<string, WebsiteInfo>): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

const CATEGORY_ICON_STORAGE_KEY = 'categoryIconMap';

const getCategoryIconMap = (): Record<string, string> => {
    const map = localStorage.getItem(CATEGORY_ICON_STORAGE_KEY);
    return map ? JSON.parse(map) : {};
};

const setCategoryIconMap = (map: Record<string, string>): void => {
    localStorage.setItem(CATEGORY_ICON_STORAGE_KEY, JSON.stringify(map));
};


export const parseChromeBookmarks = async (bookmarks: ChromeBookmark[]): Promise<{ categories: CategoryI[] }> => {
    const categories: CategoryI[] = [];
    let categoryIndex = 0;

    const websiteInfoMap = getWebsiteInfoMap();
    const categoryIconMap = getCategoryIconMap();

    const processFolder = async (folder: ChromeBookmark): Promise<void> => {
        if (!folder.children) return;

        // Mark root folders
        folder.isRoot =  folder.id === '2';

        let category: CategoryI | undefined;
        if (folder.title !== "" && !folder.isRoot) {
            category = {
                id: folder.id,
                no: categoryIndex,
                name: folder.title,
                icon: categoryIconMap[folder.id] || 'pi-stop', // Set the icon from localStorage
                websites: [],
                createdAt: folder.dateAdded,
            };
            categories.push(category);
            categoryIndex++;
        }

        for (const child of folder.children) {
            if (child.url) {
                let website: WebsiteI = {
                    no: category?.websites?.length || 0,
                    id: child.id,
                    name: child.title,
                    url: child.url,
                    imageType: 'icon',
                    image: 'pi-globe',
                    createdAt: child.dateAdded,
                };

                if (!child.url.startsWith("http://localhost") && !child.url.startsWith("http://127.0.0.1") && !child.url.startsWith("chrome://")) {
                    const cachedInfo = websiteInfoMap[child.url];
                    if (cachedInfo) {
                        website.image = cachedInfo.iconUrl || website.image;
                        if (cachedInfo.iconUrl) {
                            website.imageType = 'image';
                        }
                    } else {
                        const fetchedInfo = await fetchWebsiteInfo(website.url);
                        if (fetchedInfo && !fetchedInfo.title.startsWith("error")) {
                            website.image = fetchedInfo.iconUrl || website.image;
                            if (fetchedInfo.iconUrl) {
                                website.imageType = 'image';
                            }

                            websiteInfoMap[child.url] = {
                                iconUrl: fetchedInfo.iconUrl || '',
                            };
                            setWebsiteInfoMap(websiteInfoMap);
                        }
                    }
                }

                if (category) {
                    category.websites?.push(website);
                }
            } else if (child.children) {
                await processFolder(child);
            }
        }
    };

    for (const bookmark of bookmarks) {
        await processFolder(bookmark);
    }

    categories.forEach((category, index) => category.no = index);

    return { categories };
};

