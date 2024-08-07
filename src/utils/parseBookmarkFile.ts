import { CategoryI, WebsiteI } from '../types';
import { getLocalStorageValue, setLocalStorageValue } from './localStorageUtils';
import { fetchWebsiteInfo } from './fetchWebsiteInfo';

export const parseBookmarkFile = async (file: File): Promise<{ categories: CategoryI[] }> => {
    const existingCategories: CategoryI[] = getLocalStorageValue("categories") || [];

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const categories: CategoryI[] = [...existingCategories];
            let categoryIndex = categories.length;
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

                let category = categories.find(cat => cat.name === title);
                if (!category && links.length !== 0) {
                    category = {
                        id: crypto.randomUUID(),
                        no: categoryIndex,
                        name: title,
                        icon: 'pi-stop',
                        websites: [],
                        createdAt: Date.now(),
                    };
                    categories.push(category);
                    categoryIndex++;
                }

                if (category && links.length !== 0) {
                    for (const [_websiteIndex, link] of Array.from(links).entries()) {
                        const url = link.getAttribute('href') || '';
                        let website = category?.websites?.find(w => w.url === url);

                        if (!website) {
                            website = {
                                no: category?.websites?.length || 0,
                                id: crypto.randomUUID(),
                                name: link.textContent?.trim() || 'Untitled',
                                url: url,
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
                        }
                    }
                }

                if (subfolders.length !== 0) {
                    for (const subfolder of Array.from(subfolders)) {
                        await processFolder(subfolder.parentElement as Element);
                    }
                }

                return category;
            };

            const topLevelFolders = doc.querySelectorAll('body > dl > dt');

            if (topLevelFolders.length !== 0) {
                for (const folder of Array.from(topLevelFolders)) {
                    await processFolder(folder);
                }
            }

            if (errorMessage) {
                reject(new Error(errorMessage));
            } else {
                resolve({ categories });
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };

        reader.readAsText(file);
    });
};