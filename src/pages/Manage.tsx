import React, { useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CategoryI, WebsiteI } from '../types';
import { getLocalStorageValue } from '../utils/localStorageUtils';
import EditCategoryModal from '../components/EditCategoryModal';
import EditWebsiteModal from '../components/EditWebsiteModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import AddCategoryModal from '../components/AddCategoryModal';
import AddWebsiteModal from '../components/AddWebsiteModal';
import { useToast } from '../contexts/ToastContexts';
import "./Manage.css";
import useLocalStorage from '../hooks/useLocalStorage';
import useUserActivity from '../hooks/useUserActivity';
import { convert } from 'html-to-text';
import useTheme from '../hooks/useTheme';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { parseBookmarkFile } from '../utils/parseBookmarkFile';

interface SelectedWebsite {
    categoryIndex: number;
    websiteIndex: number;
    title?: string;
    websites?: any[];
}

const Manage: React.FC = () => {
    const { theme } = useTheme();
    const { showToast } = useToast();
    const { logVisit } = useUserActivity();
    const fileUploadRef = useRef<FileUpload>(null);
    const categoriesbbj = getLocalStorageValue<CategoryI[]>("categories") || [];
    const [categories, setCategories] = useLocalStorage("categories", categoriesbbj);

    const userActivities: { [key: string]: number } = getLocalStorageValue("userActivity") || {};
    const [expandedRows, setExpandedRows] = useState<any>(null);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const [editCategoryVisible, setEditCategoryVisible] = useState(false);
    const [addWebsiteModalVisible, setAddWebsiteModalVisible] = useState(false);
    const [editWebsiteModalVisible, setEditWebsiteModalVisible] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<SelectedWebsite | null>(null);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
    
    const [confirmDeleteVisibleCategory, setConfirmDeleteVisibleCategory] = useState(false);
    const [confirmDeleteVisibleWebsite, setConfirmDeleteVisibleWebsite] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleAddCategory = (newCategory: CategoryI) => {
        setCategories(prevCategories => [...prevCategories, newCategory]);
        showToast("success", "Category Added Successfully");
    };

    const handleEditCategory = (index: number) => {
        setSelectedCategoryIndex(index);
        setEditCategoryVisible(true);
    };

    const handleUpdateCategory = (updatedCategory: CategoryI) => {
        if (updatedCategory) {
            const updatedCategories = [...categories];
            updatedCategories[updatedCategory.no] = updatedCategory;
            setCategories(updatedCategories);
            setEditCategoryVisible(false);
            setSelectedCategoryIndex(0);
            showToast("success", "Category updated successfully");
        }
    };

    const handleEditWebsite = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex });
        setEditWebsiteModalVisible(true);
    };

    const handleUpdateWebsite = (updatedWebsite: WebsiteI) => {
        if (selectedWebsite) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            const updatedCategories = [...categories];
            if (updatedCategories[categoryIndex]?.websites) {
                updatedCategories[categoryIndex].websites[websiteIndex] = updatedWebsite;
            }
            setCategories(updatedCategories);
            setEditWebsiteModalVisible(false);
            setSelectedWebsite(null);
            showToast("success", "Website updated successfully");
        }
    };

    const handleDeleteCategory = (index: number) => {
        setSelectedCategoryIndex(index);
        setConfirmDeleteVisibleCategory(true);
    };

    const handleWebsiteDelete = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex, title: categories[categoryIndex].websites ? categories[categoryIndex].websites[websiteIndex].name : "" });
        setConfirmDeleteVisibleWebsite(true);
    };

    const confirmDeleteCategory = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedCategoryIndex !== null) {
            if (categories.length === 1) {
                showToast("error", "Cannot delete last category");
                setConfirmDeleteVisibleCategory(false);
                return;
            }

            const updatedCategories = [...categories];
            updatedCategories.splice(selectedCategoryIndex, 1);
            setCategories(updatedCategories);
            setConfirmDeleteVisibleCategory(false);
            showToast("success", "Category deleted successfully");
        }
    }

    const confirmDeleteWebsite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedWebsite !== null) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            const updatedCategories = [...categories];
            updatedCategories[categoryIndex].websites?.splice(websiteIndex, 1);
            setCategories(updatedCategories);
            setConfirmDeleteVisibleWebsite(false);
            showToast("success", "Website deleted successfully");
        }
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmDeleteVisibleWebsite(false);
        setConfirmDeleteVisibleCategory(false);
    };

    const handleAddWebsite = (categoryIndex: number, newWebsite: WebsiteI) => {
        setCategories(prevCategories => {
            const updatedCategories = [...prevCategories];
            const category = updatedCategories[categoryIndex];
            if (category) {
                category.websites = category.websites ? [...category.websites, newWebsite] : [newWebsite];
            }
            return updatedCategories;
        });
        showToast("success", "Website Added Successfully");
    };

    const handleOpenAll = (categoryIndex: number) => {
        if (typeof categoryIndex === "number" && categories[categoryIndex]?.websites) {
            const websites = categories[categoryIndex].websites;
            websites?.forEach(website => {
                console.log(website.url);
                logVisit(website.id);
                window.open(website.url, "_blank");
            });
        } else {
            console.error(`Invalid tab index or missing websites for tab index ${categoryIndex}`);
        }
    }

    const handleCopyAll = (categoryIndex: number) => {
        let copyText = "";
        if (typeof categoryIndex === "number" && categories[categoryIndex]?.websites) {
            const websites = categories[categoryIndex].websites;

            let htmlTable = "<table style='border: 1px solid black; border-collapse: collapse;'>";
            htmlTable += "<tr><th style='border: 1px solid black; padding: 5px;'>Name</th><th style='border: 1px solid black; padding: 5px;'>URL</th></tr>";

            websites?.forEach(website => {
                htmlTable += `<tr><td style='border: 1px solid black; padding: 5px;'>${website.name}</td><td style='border: 1px solid black; padding: 5px;'>${website.url}</td></tr>`;
            });

            htmlTable += "</table>";

            copyText = convert(htmlTable, {
                wordwrap: 150,
                tables: true,
            });

            // Copy to clipboard
            navigator.clipboard.writeText(copyText)
                .then(() => {
                    showToast("success", "Copied to clipboard successfully");
                })
                .catch(err => {
                    showToast("error", "Failed to copy to clipboard");
                    console.error("Could not copy text: ", err);
                });
        }
    };

    const handleCopyUrl = (categoryIndex: number, websiteIndex: number) => {
        const website = categories[categoryIndex]?.websites && categories[categoryIndex].websites[websiteIndex];

        if (website) {
            let copyText = website.url;
            navigator.clipboard.writeText(copyText)
                .then(() => {
                    showToast("success", "Copied to clipboard successfully");
                })
                .catch(err => {
                    showToast("error", "Failed to copy to clipboard");
                    console.error("Could not copy text: ", err);
                });
        }
    };

    const customHeader = `custom-header ${theme === 'theme-light' && 'dark'}`;

    const rowExpansionTemplate = (data: CategoryI) => {
        return (
            <>
                <div className='flex align-items-center justify-content-end px-4'>
                    <Button
                        label="Add Website"
                        icon="pi pi-plus"
                        className="mt-2"
                        onClick={() => {
                            setSelectedCategoryIndex(data.no);
                            setAddWebsiteModalVisible(true);
                        }}
                    />
                </div>
            <div className='px-4 py-4'>
                <DataTable value={data.websites} dataKey="id">
                    <Column 
                        header="S.No."
                        body={(_rowData: WebsiteI, options) => options.rowIndex + 1}
                        headerClassName={customHeader}
                    />
                    <Column 
                        field="name"
                        header="Website Name" 
                        headerClassName={customHeader}
                        body={(rowData: WebsiteI) => (<a className='wrapping-cell' href={`${rowData?.url}`} target="_blank" onClick={() => logVisit(rowData?.id)} title={rowData?.name}>{rowData?.name}</a>) || ""}
                    />
                    <Column 
                        field="url"
                        header="URL"
                        headerClassName={customHeader}
                        body={(rowData: WebsiteI) => (<a href={`${rowData?.url}`} className='url-cell' target="_blank" onClick={() => logVisit(rowData?.id)}>{rowData?.url}</a>)} 
                    />
                    <Column 
                        field="icon"
                        header="Icon / Image"
                        headerClassName={customHeader}
                        body={(rowData: WebsiteI) => (rowData.imageType === "icon" ? <i className={`pi ${rowData?.image} text-2xl`}></i> : <img src={rowData?.image} alt="icon" height={24} width={24} />) || ""}
                    />
                    <Column 
                        field="visits"
                        header="Total Visits"
                        headerClassName={customHeader}
                        body={(rowData: WebsiteI) => userActivities[rowData?.id] || 0} 
                    />
                    <Column
                        header="Actions"
                        headerClassName={customHeader}
                        body={(_rowData: WebsiteI, options) => (
                            <>
                                <Button
                                    className='mr-2 custom-button'
                                    icon="pi pi-copy font-semibold text-sm"
                                    onClick={() => handleCopyUrl(data.no, options.rowIndex)}
                                />
                                <Button
                                    className='bg-warning border-warning text-white mr-2 custom-button'
                                    icon="pi pi-pencil font-semibold text-sm"
                                    onClick={() => handleEditWebsite(data.no, options.rowIndex)}
                                />
                                <Button
                                    className='bg-danger border-danger text-white custom-button'
                                    icon="pi pi-trash text-sm"
                                    onClick={() => handleWebsiteDelete(data.no, options.rowIndex)}
                                />
                            </>
                        )}
                    />
                </DataTable>
            </div>
            </>
        );
    };

    const handleBookmarkUpload = async (event: FileUploadSelectEvent) => {
        const file = event.files?.[0];
        if (file) {
            setLoading(true); // Start loading
            try {
                const { categories } = await parseBookmarkFile(file);
                setCategories(categories);
                showToast("success", "Bookmarks imported successfully");
            } catch (error) {
                showToast("error", (error as Error).message || "Failed to import bookmarks");
                console.error("Error parsing bookmark file:", error);
            } finally {
                setLoading(false); // End loading
                if (fileUploadRef.current) {
                    fileUploadRef.current.clear(); // Reset the file upload component
                }
            }
        }
    };

    const cancelUpload = () => {
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
            setLoading(false);
        }
    }

    return (
        <div className='card py-4 px-4'>
            <div className='flex align-items-center justify-content-end'>
                <FileUpload
                    ref={fileUploadRef}
                    className='mb-4 mr-2'
                    accept=".html"
                    chooseOptions={{ icon: `pi ${loading ? "pi-spin pi-spinner" : "pi-upload"}` }}
                    chooseLabel='Upload Bookmarks'
                    mode="basic"
                    onSelect={handleBookmarkUpload}
                    disabled={loading} 
                />
                {loading && <Button icon="pi pi-times" className='mb-4 mr-2' onClick={cancelUpload}/>}
                <Button
                    label="Add Category"
                    icon="pi pi-plus"
                    className="mb-4"
                    onClick={() => setAddCategoryVisible(true)}
                />
            </div>
            <DataTable
                value={categories}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
                className="custom-datatable"
            >
                <Column 
                    expander
                    style={{ width: '6rem' }}
                    headerClassName={customHeader}
                />
                <Column 
                    header="S.No."
                    headerClassName={customHeader}
                    body={(_rowData: CategoryI, options) => options.rowIndex + 1}
                />
                <Column 
                    field="name"
                    header="Category Name"
                    headerClassName={customHeader}
                />
                <Column 
                    header="No. of Websites"
                    headerClassName={customHeader}
                    body={(rowData: CategoryI) => rowData.websites?.length || 0}
                />
                <Column 
                    header="Actions"
                    headerClassName={customHeader}
                    body={(_rowData: CategoryI, options) => (
                        <>
                            <Button
                                className='mr-2 custom-button'
                                icon="pi pi-external-link font-semibold text-sm"
                                onClick={() => handleOpenAll(options.rowIndex)}
                            />
                            <Button
                                className='mr-2 custom-button'
                                icon="pi pi-copy font-semibold text-sm"
                                onClick={() => handleCopyAll(options.rowIndex)}
                            />
                            <Button
                                className='bg-warning border-warning text-white mr-2 custom-button'
                                icon="pi pi-pencil font-semibold text-sm"
                                onClick={() => handleEditCategory(options.rowIndex)}
                            />
                            <Button
                                className='bg-danger border-danger text-white custom-button'
                                icon="pi pi-trash font-semibold text-sm"
                                onClick={() => handleDeleteCategory(options.rowIndex)}
                            />
                        </>
                    )}
                />
            </DataTable>

            <AddCategoryModal
                visible={addCategoryVisible}
                setVisible={setAddCategoryVisible}
                categories={categories}
                onAddCategory={handleAddCategory}
            />

            <EditCategoryModal
                visible={editCategoryVisible}
                setVisible={setEditCategoryVisible}
                categories={categories}
                category={categories[selectedCategoryIndex]}
                onUpdateCategory={handleUpdateCategory}
            />

            <AddWebsiteModal
                visible={addWebsiteModalVisible}
                setVisible={setAddWebsiteModalVisible}
                categoryIndex={selectedCategoryIndex}
                categories={categories}
                onAddWebsite={handleAddWebsite}
            />

            <EditWebsiteModal
                visible={editWebsiteModalVisible}
                setVisible={setEditWebsiteModalVisible}
                categoryIndex={selectedWebsite?.categoryIndex ?? 0}
                categories={categories}
                website={selectedWebsite?.websites?.[selectedWebsite?.categoryIndex]?.[selectedWebsite?.websiteIndex]}
                onUpdateWebsite={handleUpdateWebsite}
            />

            <ConfirmDeleteModal
                visible={confirmDeleteVisibleCategory}
                confirmDelete={confirmDeleteCategory}
                cancelDelete={cancelDelete}
                title={categories[selectedCategoryIndex]?.name || ""}
            />

            <ConfirmDeleteModal
                visible={confirmDeleteVisibleWebsite}
                confirmDelete={confirmDeleteWebsite}
                cancelDelete={cancelDelete}
                title={selectedWebsite?.title || ""}
            />
        </div>
    );
};

export default Manage;