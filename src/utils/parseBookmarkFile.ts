import { CategoryI, WebsiteI } from '../types';
import { getLocalStorageValue } from './localStorageUtils';
import { fetchWebsiteInfo } from './fetchWebsiteInfo'; // Adjust the import based on your project structure

export const parseBookmarkFile = async (file: File): Promise<{ categories: CategoryI[], websites: WebsiteI[] }> => {
    const existingCategories: CategoryI[] = getLocalStorageValue("categories") || [];
    const categoryNames = existingCategories.map(category => category.name);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const categories: CategoryI[] = [];
            const websites: WebsiteI[] = [];
            let categoryIndex = 0;
            let errorMessage: string | null = null;

            const content = e.target?.result as string;

            if (!/<!DOCTYPE NETSCAPE-Bookmark-file-1>/i.test(content)) {
                errorMessage = 'Please upload a valid bookmark file.';
                reject(new Error(errorMessage));
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');

            const processFolder = async (folder: Element): Promise<CategoryI | undefined> => {
                const title = folder.querySelector(':scope > h3')?.textContent?.trim() || 'Untitled';
                const links = folder.querySelectorAll(':scope > dl > dt > a');
                const subfolders = folder.querySelectorAll(':scope > dl > dt > h3');

                // Check if category name already exists
                // if (categoryNames.includes(title)) {
                //     errorMessage = `Category name "${title}" already exists.`;
                //     return undefined; // Skip adding this category
                // }

                let category: CategoryI | undefined;
                if (links.length !== 0) {
                    category = {
                        id: crypto.randomUUID(),
                        no: categoryIndex,
                        name: title,
                        icon: 'pi-stop',
                        websites: [],
                        createdAt: Date.now(),
                    };
                    categoryIndex++;
                }

                if (links.length !== 0) {
                    for (const [websiteIndex, link] of Array.from(links).entries()) {
                        const website: WebsiteI = {
                            no: websiteIndex,
                            id: crypto.randomUUID(),
                            name: link.textContent?.trim() || 'Untitled',
                            url: link.getAttribute('href') || '',
                            imageType: 'icon',
                            image: 'pi-globe',
                            createdAt: Date.now(),
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
                        websites.push(website);
                    }
                }

                if (subfolders.length !== 0) {
                    for (const subfolder of Array.from(subfolders)) {
                        const subCategory = await processFolder(subfolder.parentElement as Element);
                        if (subCategory) {
                            categories.push(subCategory);
                        }
                    }
                }

                return category;
            };

            const topLevelFolders = doc.querySelectorAll('body > dl > dt');

            if (topLevelFolders.length !== 0) {
                for (const folder of Array.from(topLevelFolders)) {
                    const category = await processFolder(folder);
                    if (category) {
                        categories.push(category);
                    }
                }
            }

            if (errorMessage) {
                reject(new Error(errorMessage));
            } else {
                resolve({ categories, websites });
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };

        reader.readAsText(file);
    });
};
