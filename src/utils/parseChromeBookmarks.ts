import { CategoryI, WebsiteI } from '../types';
import { getLocalStorageValue } from './localStorageUtils';
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

    const processFolder = async (folder: ChromeBookmark, _parentCategory?: CategoryI): Promise<CategoryI | undefined> => {
        if (!folder.children) return;

        let category = categories.find(cat => cat.name === folder.title);
        if (!category) {
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

    const nonEmptyCategories: CategoryI[] = categories.filter(category => category!.websites!.length > 0);

    return { categories: nonEmptyCategories };
};