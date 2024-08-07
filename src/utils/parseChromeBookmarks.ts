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
}

const STORAGE_KEY = 'websiteInfoMap';

interface WebsiteInfo {
    title: string;
    iconUrl: string;
}

const getWebsiteInfoMap = (): Record<string, WebsiteInfo> => {
    const map = localStorage.getItem(STORAGE_KEY);
    return map ? JSON.parse(map) : {};
};

const setWebsiteInfoMap = (map: Record<string, WebsiteInfo>): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

export const parseChromeBookmarks = async (bookmarks: ChromeBookmark[]): Promise<{ categories: CategoryI[] }> => {
    const categories: CategoryI[] = [];
    let categoryIndex = 0;

    const websiteInfoMap = getWebsiteInfoMap();

    const processFolder = async (folder: ChromeBookmark): Promise<void> => {
        if (!folder.children) return;

        let category: CategoryI | undefined;
        if (folder.children.length > 0 && folder.title !== "") {
            category = {
                id: folder.id,
                no: categoryIndex,
                name: folder.title,
                icon: 'pi-stop',
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

                console.log(child.url, child.url.startsWith("http://localhost"));
                

                if(!child.url.startsWith("http://localhost") && !child.url.startsWith("http://127.0.0.1") && !child.url.startsWith("chrome://")) {
                    const cachedInfo = websiteInfoMap[child.url];
                    if (cachedInfo) {
                        website.name = cachedInfo.title || website.name;
                        website.image = cachedInfo.iconUrl || website.image;
                        if (cachedInfo.iconUrl) {
                            website.imageType = 'image';
                        }
                    } else {
                        // Fetch website information if not present in local storage
                        const fetchedInfo = await fetchWebsiteInfo(website.url);
                        if (fetchedInfo && !fetchedInfo.title.startsWith("error")) {
                            website.name = fetchedInfo.title || website.name;
                            website.image = fetchedInfo.iconUrl || website.image;
                            if (fetchedInfo.iconUrl) {
                                website.imageType = 'image';
                            }
    
                            // Update local storage map
                            websiteInfoMap[child.url] = {
                                title: fetchedInfo.title || '',
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

    // Process each bookmark at the top level
    for (const bookmark of bookmarks) {
        await processFolder(bookmark);
    }

    // Filter out categories with no websites
    const updatedCategories = categories.filter(category => category.websites && category.websites.length > 0);

    // Update category numbers
    updatedCategories.forEach((category, index) => category.no = index);

    return { categories: updatedCategories };
};
