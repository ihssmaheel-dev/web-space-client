import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { CategoryI, SelectedWebsite, WebsiteI } from '../types';
import { Button } from 'primereact/button';
import useTheme from '../hooks/useTheme';
import { useToast } from '../contexts/ToastContexts';
import { getLocalStorageValue } from '../utils/localStorageUtils';
import useUserActivity from '../hooks/useUserActivity';

interface WebsitesDatatableProps {
    data: CategoryI;
    setSelectedCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
    setSelectedWebsite: React.Dispatch<React.SetStateAction<SelectedWebsite | null>>;
    setAddWebsiteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setEditWebsiteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmDeleteVisibleWebsite: React.Dispatch<React.SetStateAction<boolean>>;
}

const WebsitesDatatable: React.FC<WebsitesDatatableProps> = ({ data, setSelectedCategoryIndex, setSelectedWebsite, setAddWebsiteModalVisible, setEditWebsiteModalVisible, setConfirmDeleteVisibleWebsite  }) => {
    const { theme } = useTheme();
    const { showToast } = useToast();
    const { logVisit } = useUserActivity();

    const existingCategories = getLocalStorageValue<CategoryI[]>("categories") || [];
    const [categories, setCategories] = useState<CategoryI[]>(existingCategories);
    const userActivities: { [key: string]: number } = getLocalStorageValue("userActivity") || {};

    const customHeader = `custom-header ${theme === 'theme-light' && 'dark'}`;

    const handleEditWebsite = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex, website: categories[categoryIndex]?.websites && categories[categoryIndex]?.websites[websiteIndex] });
        setEditWebsiteModalVisible(true);
    };

    const handleWebsiteDeleteClick = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex, title: categories[categoryIndex].websites ? categories[categoryIndex].websites[websiteIndex].name : "" });
        setConfirmDeleteVisibleWebsite(true);
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
                                    onClick={() => handleWebsiteDeleteClick(data.no, options.rowIndex)}
                                />
                            </>
                        )}
                    />
                </DataTable>
            </div>
        </>
    );
};

export default WebsitesDatatable;