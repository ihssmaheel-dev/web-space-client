import { CategoryI, WebsiteI } from '../types';
import { getLocalStorageValue, setLocalStorageValue } from './localStorageUtils';
import { fetchWebsiteInfo } from './fetchWebsiteInfo';

interface ChromeBookmark {
    children?: ChromeBookmark[];
    dateAdded: number;
    id: string;
    index: number;
    parentId: string;
    title: string;
    url?: string;
}

export const parseChromeBookmarks = async (bookmarks: ChromeBookmark[]): Promise<{ categories: CategoryI[] }> => {
    const existingCategories: CategoryI[] = getLocalStorageValue("categories") || [];

    const categories: CategoryI[] = [...existingCategories];
    let categoryIndex = categories.length;

    const processFolder = async (object: ChromeBookmark, _parentCategory?: CategoryI): Promise<CategoryI | undefined> => {
        if (!object.children) return;

        // Count the number of websites in this folder
        const websiteCount = object.children.filter(child => child.url).length;

        // If the folder is empty or has no name, skip it
        if (websiteCount === 0 || !object.title.trim()) {
            return;
        }

        let category = categories.find(cat => cat.name === object.title);
        if (!category) {
            category = {
                id: object.id,
                no: categoryIndex,
                name: object.title,
                icon: 'pi-stop',
                websites: [],
                createdAt: object.dateAdded,
            };
            categories.push(category);
            categoryIndex++;
        }

        for (const child of object.children) {
            if (child.url) {
                let website = category?.websites?.find(w => w.url === child.url);

                if (!website) {
                    website = {
                        no: category?.websites?.length || 0,
                        id: child.id,
                        name: child.title,
                        url: child.url,
                        imageType: 'icon',
                        image: 'pi-globe',
                        createdAt: child.dateAdded,
                    };

                    const fetchedInfo = await fetchWebsiteInfo(website.url);

                    if (fetchedInfo) {
                        if (!fetchedInfo.title.startsWith("error")) {
                            website.name = fetchedInfo.title || website.name;
                        }
                        website.image = fetchedInfo.iconUrl || website.image;
                        if (fetchedInfo.iconUrl) {
                            website.imageType = 'image';
                        }
                    }

                    category?.websites?.push(website);
                }
            } else if (child.children) {
                await processFolder(child, category);
            }
        }

        return category;
    };

    for (const bookmark of bookmarks) {
        await processFolder(bookmark);
    }

    // Remove any categories that ended up empty after processing
    const nonEmptyCategories = categories.filter(category => category!.websites!.length > 0);

    return { categories: nonEmptyCategories };
};