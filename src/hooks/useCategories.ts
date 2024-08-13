import { CategoryI } from "../types";

const useCategories = (categories: CategoryI[], setCategories: React.Dispatch<React.SetStateAction<CategoryI[]>>) => {
    const handleAddCategory = (newCategory: CategoryI) => {
        window.postMessage({
            type: "CREATE_CHROME_BOOKMARK",
            bookmark: { title: newCategory.name }
        }, "*");
    };

    const handleUpdateCategory = (updatedCategory: CategoryI) => {
        if (updatedCategory) {
            window.postMessage({
                type: "EDIT_CHROME_BOOKMARK",
                id: updatedCategory.id,
                newTitle: updatedCategory.name
            }, "*");
        }
    };

    const handleDeleteCategory = (categoryId: string) => {
        window.postMessage({
            type: "DELETE_CHROME_BOOKMARK",
            id: categoryId
        }, "*");
    };

    return { handleAddCategory, handleUpdateCategory, handleDeleteCategory };
};

export default useCategories;