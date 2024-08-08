import React, { useEffect, useRef, useState } from 'react';
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
import { parseChromeBookmarks } from '../utils/parseChromeBookmarks';

interface SelectedWebsite {
    categoryIndex: number;
    websiteIndex: number;
    title?: string;
    website?: WebsiteI;
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
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncWrong, setSyncWrong] = useState(false);
    const syncTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleAddCategory = (newCategory: CategoryI) => {
        window.postMessage({
            type: "CREATE_CHROME_BOOKMARK",
            bookmark: { title: newCategory.name }
        }, "*");
    };

    const handleEditCategory = (index: number) => {
        setSelectedCategoryIndex(index);
        setEditCategoryVisible(true);
    };

    const handleUpdateCategory = (updatedCategory: CategoryI) => {
        if (updatedCategory) {
            console.log(updatedCategory);

            window.postMessage({
                type: "EDIT_CHROME_BOOKMARK",
                id: updatedCategory.id,
                newTitle: updatedCategory.name
            }, "*");
        }
    };

    const handleEditWebsite = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex, website: categories[categoryIndex]?.websites && categories[categoryIndex]?.websites[websiteIndex] });
        setEditWebsiteModalVisible(true);
    };

    const handleUpdateWebsite = (updatedWebsite: WebsiteI) => {
        if (selectedWebsite) {
            window.postMessage({
                type: "EDIT_CHROME_BOOKMARK",
                id: updatedWebsite.id,
                newTitle: updatedWebsite.name,
                newUrl: updatedWebsite.url
            }, "*");
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
            const categoryToDelete = categories[selectedCategoryIndex];
            window.postMessage({
                type: "DELETE_CHROME_BOOKMARK",
                id: categoryToDelete.id
            }, "*");
        }

        setConfirmDeleteVisibleCategory(false);
    }

    const confirmDeleteWebsite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedWebsite !== null) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            if (categories && categories[categoryIndex] && categories[categoryIndex].websites) {
                const websiteToDelete = categories[categoryIndex].websites[websiteIndex];
                window.postMessage({
                    type: "DELETE_CHROME_BOOKMARK",
                    id: websiteToDelete.id
                }, "*");
            } else {
                showToast("error", "Error deleting website");
            }

        }

        setConfirmDeleteVisibleWebsite(false);
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmDeleteVisibleWebsite(false);
        setConfirmDeleteVisibleCategory(false);
    };

    const handleAddWebsite = (categoryIndex: number, newWebsite: WebsiteI) => {
        const category = categories[categoryIndex];
        window.postMessage({
            type: "CREATE_CHROME_BOOKMARK",
            bookmark: { parentId: category.id, title: newWebsite.name, url: newWebsite.url }
        }, "*");
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

    useEffect(() => {
        const handleBookmarkUpdate = async (event: MessageEvent) => {
            if (event.data.type === "CHROME_BOOKMARKS_SYNC") {
                if (syncTimeout.current !== null) {
                    clearTimeout(syncTimeout.current);
                    setSyncWrong(false);
                }

                const { categories } = await parseChromeBookmarks(event.data.bookmarks);
                setCategories(categories);

                showToast("success", "Bookmarks synced with Chrome");
                setSyncLoading(false);
            } else if (event.data.type === "CHROME_BOOKMARK_UPDATED") {
                showToast("success", "Bookmark updated successfully");
                window.postMessage({ source: "web-space", type: "TRIGGER_CHROME_SYNC" }, "*");
            } else if (event.data.type === "CHROME_BOOKMARK_DELETED") {
                showToast("success", "Bookmark deleted successfully");
                window.postMessage({ source: "web-space", type: "TRIGGER_CHROME_SYNC" }, "*");
            } else if (event.data.type === "CHROME_BOOKMARK_CREATED") {
                showToast("success", "Bookmark created successfully");
                window.postMessage({ source: "web-space", type: "TRIGGER_CHROME_SYNC" }, "*");
            }
        };

        window.addEventListener('message', handleBookmarkUpdate);

        return () => {
            window.removeEventListener('message', handleBookmarkUpdate);
            if (syncTimeout.current !== null) {
                clearTimeout(syncTimeout.current);
            }
        };
    }, []);

    const triggerSync = () => {
        setSyncLoading(true);
        setSyncWrong(false);

        syncTimeout.current = setTimeout(() => {
            setSyncWrong(true);
            setSyncLoading(false);
            showToast("error", "Please check the Extension is installed in Chrome");
        }, 4000);

        window.postMessage({ source: "web-space", type: "TRIGGER_CHROME_SYNC" }, "*");
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

    return (
        <div className='card py-4 px-4'>
            <div className='flex align-items-center justify-content-end'>
                <Button label='Sync Chrome Bookmarks' icon={`pi ${syncLoading ? "pi-spin pi-spinner" : "pi-sync"}`} className='mb-4 mr-2' onClick={triggerSync} disabled={syncLoading} />
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
                    body={(rowData: CategoryI, options) => (
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
                            {rowData.name.toLocaleLowerCase() !== ("Bookmarks Bar").toLocaleLowerCase() && (
                                <>
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
                website={selectedWebsite?.website || null}
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