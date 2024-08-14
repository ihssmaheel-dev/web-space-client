import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { CategoryI, SelectedWebsite } from '../types';
import useTheme from '../hooks/useTheme';
import useLocalStorage from '../hooks/useLocalStorage';
import { getLocalStorageValue } from '../utils/localStorageUtils';
import WebsitesDatatable from './WebsitesDatatable';
import useUserActivity from '../hooks/useUserActivity';
import { Button } from 'primereact/button';
import { useToast } from '../contexts/ToastContexts';
import { convert } from 'html-to-text';

interface CategoriesDatatableProps {
    setSelectedCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
    setEditCategoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmDeleteVisibleCategory: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedWebsite: React.Dispatch<React.SetStateAction<SelectedWebsite | null>>;
    setAddWebsiteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setEditWebsiteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmDeleteVisibleWebsite: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoriesDatatable: React.FC<CategoriesDatatableProps> = ({ setSelectedCategoryIndex, setEditCategoryVisible, setConfirmDeleteVisibleCategory, setSelectedWebsite, setAddWebsiteModalVisible, setEditWebsiteModalVisible, setConfirmDeleteVisibleWebsite  }) => {
    const { theme } = useTheme();
    const { showToast } = useToast();
    const { logVisit } = useUserActivity();

    const existingCategories = getLocalStorageValue<CategoryI[]>("categories") || [];
    const [categories, setCategories] = useLocalStorage("categories", existingCategories);

    const customHeader = `custom-header ${theme === 'theme-light' && 'dark'}`;
    const rowExpansionTemplate = (data: CategoryI) => {
        return <WebsitesDatatable data={data} setSelectedCategoryIndex={setSelectedCategoryIndex} setSelectedWebsite={setSelectedWebsite} setAddWebsiteModalVisible={setAddWebsiteModalVisible} setEditWebsiteModalVisible={setEditWebsiteModalVisible} setConfirmDeleteVisibleWebsite={setConfirmDeleteVisibleWebsite} />;
    };

    const [expandedRows, setExpandedRows] = useState<any>(null);

    const handleOpenAll = (categoryIndex: number) => {
        if (typeof categoryIndex === "number" && categories[categoryIndex]?.websites) {
            const websites = categories[categoryIndex].websites;
            websites?.forEach(website => {
                logVisit(website.id);
                window.open(website.url, "_blank");
            });
        } else {
            console.error(`Invalid tab index or missing websites for tab index ${categoryIndex}`);
        }
    }

    const handleCopyAll = (categoryIndex: number) => {
        if (typeof categoryIndex === "number" && categories[categoryIndex]?.websites) {
            const websites = categories[categoryIndex].websites;

            let htmlTable = "<table style='border: 1px solid black; border-collapse: collapse;'>";
            htmlTable += "<tr><th style='border: 1px solid black; padding: 5px;'>Name</th><th style='border: 1px solid black; padding: 5px;'>URL</th></tr>";

            websites?.forEach(website => {
                htmlTable += `<tr><td style='border: 1px solid black; padding: 5px;'>${website.name}</td><td style='border: 1px solid black; padding: 5px;'>${website.url}</td></tr>`;
            });

            htmlTable += "</table>";

            const copyText = convert(htmlTable, {
                wordwrap: 150,
                tables: true,
            });

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

    const handleEditCategory = (index: number) => {
        setSelectedCategoryIndex(index);
        setEditCategoryVisible(true);
    };

    const handleDeleteCategoryClick = (index: number) => {
        setSelectedCategoryIndex(index);
        setConfirmDeleteVisibleCategory(true);
    };

    return (
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
                                        onClick={() => handleDeleteCategoryClick(options.rowIndex)}
                                    />
                                </>
                            )}
                        </>
                    )}
                />
            </DataTable>
    );
};

export default CategoriesDatatable;