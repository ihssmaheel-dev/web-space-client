import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IconDropdown from "./IconDropdown";
import { icons } from "../utils/icons";
import { CategoryI, ImageType, WebsiteI } from "../types";
import { fetchWebsiteInfo } from "../utils/fetchWebsiteInfo";
import { useToast } from "../contexts/ToastContexts";

interface AddWebsiteModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    categoryIndex: number;
    categories: CategoryI[];
    onAddWebsite: (categoryIndex: number, newWebsite: WebsiteI) => void;
}

const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({ visible, setVisible, categoryIndex, categories, onAddWebsite }) => {
    const { showToast } = useToast();
    const [isScrapeLoading, setIsScrapeLoading] = useState(false);
    const initialValues = { name: "", image: "", imageType: "icon" as ImageType, url: "https://" };

    const validationSchema = Yup.object({
        name: Yup.string().required("Title is required")
            .matches(/^[a-zA-Z0-9]+$/, "No Special characters allowed")
            .min(3, "Title must be at least 3 characters")
            .max(15, "Title can be up to 15 characters long")
            .test('duplicate-title', 'This title already exists', value => !categories[categoryIndex].websites?.some(website => website.name === value)),
        url: Yup.string().url("Invalid URL").required("URL is required")
            .test('duplicate-url', 'This URL already exists', value => !categories[categoryIndex].websites?.some(website => website.url === value)),
    });

    const handleSubmit = (
        values: typeof initialValues,
        { resetForm }: { resetForm: () => void },
    ) => {
        const newWebsite = {
            no: categories[categoryIndex].websites?.length || 0,
            id: crypto.randomUUID(),
            name: values.name,
            image: values.image,
            imageType: values.imageType,
            url: values.url,
            createdAt: Date.now()
        };

        onAddWebsite(categoryIndex, newWebsite);
        setVisible(false);
        resetForm();
    };

    const handleScrape = async (url: string, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void) => {
        if(!url) { return; }

        setIsScrapeLoading(true);
        try {
            const websiteInfo = await fetchWebsiteInfo(url);

            if (websiteInfo) {
                const { title, iconUrl } = websiteInfo;
                setFieldValue('name', title);
                setFieldValue('imageType', 'image');
                setFieldValue('image', iconUrl);
            } else {
                setFieldValue('name', "");
                setFieldValue('imageType', 'icon');
                setFieldValue('image', "");
                showToast("error", "Failed to fetch website info");
            }
        } catch (error) {
            showToast("error", "An error occurred while fetching website info");
        } finally {
            setIsScrapeLoading(false);
        }
    };

    return (
        <Dialog className="w-6" visible={visible} onHide={() => setVisible(false)} header="Add Website">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className="mb-5">
                            <div className="grid mb-1">
                                <div className="flex flex-column gap-2 col-5">
                                    <label htmlFor="url">URL <span className="text-red-200">*</span></label>
                                    <Field id="url" name="url" as={InputText} />
                                    <ErrorMessage name="url" component="small" className="p-error ml-1" />
                                </div>
                                <div className="flex flex-column gap-2 col-1">
                                    <label htmlFor="">&nbsp;</label>
                                    <Button
                                        type="button"
                                        id="scrape"
                                        icon={isScrapeLoading ? "pi pi-spin pi-spinner" : "pi pi-bolt"}
                                        style={{ width: "35px" }}
                                        onClick={() => handleScrape(values.url, setFieldValue)}
                                        disabled={isScrapeLoading}
                                    />
                                </div>
                                <div className="flex flex-column gap-2 col-6">
                                    <label htmlFor="name">Title <span className="text-red-200">*</span></label>
                                    <Field id="name" name="name" as={InputText} />
                                    <ErrorMessage name="name" component="small" className="p-error ml-1" />
                                </div>
                            </div>
                            <div className="grid mb-1">
                                <div className="flex flex-column gap-2 col-6">
                                    <label htmlFor="imageType">Image Type</label>
                                    <Dropdown id="imageType" name="imageType" options={["icon", "image"]} value={values.imageType} onChange={(e) => setFieldValue('imageType', e.value)} placeholder="Select a type" />
                                    <ErrorMessage name="imageType" component="small" className="p-error ml-1" />
                                </div>
                                <div className="flex flex-column gap-2 col-6">
                                    <label htmlFor="image">Image</label>
                                    {values.imageType === "icon" ? (
                                        <IconDropdown value={values.image} onChange={(value) => setFieldValue('image', value)} icons={icons} />
                                    ) : (
                                        <Field id="image" name="image" as={InputText} />
                                    )}
                                    <ErrorMessage name="image" component="small" className="p-error ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="p-mt-4">
                            <Button label="Submit" icon="pi pi-check" className="mr-2" type="submit" />
                            <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={() => setVisible(false)} />
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default AddWebsiteModal;
