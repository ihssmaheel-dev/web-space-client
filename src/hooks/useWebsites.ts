import { CategoryI, WebsiteI } from "../types";

const useWebsites = (categories: CategoryI[], _setCategories: React.Dispatch<React.SetStateAction<CategoryI[]>>) => {
    const handleAddWebsite = (categoryIndex: number, newWebsite: WebsiteI) => {
        window.postMessage({
            type: "CREATE_CHROME_BOOKMARK",
            bookmark: { parentId: categories[categoryIndex].id, title: newWebsite.name, url: newWebsite.url }
        }, "*");
    };

    const handleUpdateWebsite = (updatedWebsite: WebsiteI) => {
        window.postMessage({
            type: "EDIT_CHROME_BOOKMARK",
            id: updatedWebsite.id,
            newTitle: updatedWebsite.name,
            newUrl: updatedWebsite.url
        }, "*");
    };

    const handleDeleteWebsite = (websiteId: string) => {
        window.postMessage({
            type: "DELETE_CHROME_BOOKMARK",
            id: websiteId
        }, "*");
    };

    return { handleAddWebsite, handleUpdateWebsite, handleDeleteWebsite };
};

export default useWebsites;