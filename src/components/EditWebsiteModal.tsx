import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IconDropdown from "./IconDropdown";
import { icons } from "../utils/icons";
import { WebsiteI } from '../types';

interface EditWebsiteModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    website: WebsiteI | null;
    onUpdateWebsite: (updatedWebsite: WebsiteI) => void;
}

const EditWebsiteModal: React.FC<EditWebsiteModalProps> = ({ visible, setVisible, website, onUpdateWebsite }) => {
    if(!website) return null;

    const initialValues = {
        name: website.name,
        image: website.image,
        imageType: website.imageType || "icon",
        url: website.url
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Title is required"),
        url: Yup.string().url("Invalid URL").required("URL is required"),
    });

    const handleSubmit = (values: typeof initialValues) => {
        const updatedWebsite: WebsiteI = {
            ...website,
            name: values.name,
            image: values.image,
            imageType: values.imageType,
            url: values.url
        };

        onUpdateWebsite(updatedWebsite);
        setVisible(false);
    }

    return (
        <Dialog visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} header="Edit Website">
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
                                    <Button id="scrape" icon="pi pi-bolt" style={{ width: "35px", height: "44px" }} type="button" disabled />
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
                                        <IconDropdown value={values.image || ""} onChange={(value) => setFieldValue('image', value)} icons={icons} />
                                    ) : (
                                        <Field id="image" name="image" as={InputText} />
                                    )}
                                    <ErrorMessage name="image" component="small" className="p-error ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="p-mt-4">
                            <Button label="Update" icon="pi pi-check" className="mr-2" type="submit" />
                            <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={() => setVisible(false)} />
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default EditWebsiteModal