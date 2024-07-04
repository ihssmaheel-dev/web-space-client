import React from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IconDropdown from "./IconDropdown";
import { icons } from "../utils/icons";

interface CategoryI {
    no: number;
    id: string;
    name: string;
    icon: string;
    websites?: WebsiteI[];
}

type ImageType = "icon" | "image";

interface WebsiteI {
    no: number;
    id: string;
    name: string;
    image?: string;
    imageType?: ImageType;
    description: string;
    link: string;
}

interface AddCategoryModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    categoriesLength: number;
    onAddCategory: (category: CategoryI) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, setVisible, categoriesLength, onAddCategory }) => {
    const initialValues = {
        categoryName: "",
        categoryIcon: "",
        description: ""
    };

    const validationSchema = Yup.object({
        categoryName: Yup.string()
            .required("Category name is required")
            .matches(/^[a-zA-Z0-9 ]*$/, "Category name cannot contain special characters"),
        description: Yup.string()
            .test(
                'maxWords',
                'Description cannot exceed 30 words',
                value => !value || value.split(' ').filter(word => word).length <= 30
            ),
    });

    const handleSubmit = (values: any, { resetForm }: { resetForm: () => void }) => {
        const newCategory = {
            no: categoriesLength,
            id: crypto.randomUUID(),
            name: values.categoryName,
            icon: values.categoryIcon || "pi pi-stop",
            description: values.description,
            websites: []
        };

        onAddCategory(newCategory);
        setVisible(false);
        resetForm();
    };

    return (
        <Dialog visible={visible} style={{ width: '46vw' }} onHide={() => setVisible(false)} header="Add Category">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div className="mb-5">
                            <div className="grid mb-2">
                                <div className="flex flex-column gap-2 col-6">
                                    <label htmlFor="categoryName">Category name <span className="text-red-200">*</span></label>
                                    <Field id="categoryName" name="categoryName" as={InputText} />
                                    <ErrorMessage name="categoryName" component="small" className="p-error ml-1" />
                                </div>
                                <div className="flex flex-column gap-2 col-6">
                                    <label htmlFor="categoryIcon">Category Icon</label>
                                    <IconDropdown
                                        value={values.categoryIcon}
                                        onChange={(value: string) => setFieldValue('categoryIcon', value)}
                                        icons={icons}
                                    />
                                    <ErrorMessage name="categoryIcon" component="small" className="p-error ml-1" />
                                </div>
                            </div>
                            <div className="flex flex-column gap-2">
                                <label htmlFor="description">Description</label>
                                <Field id="description" name="description" as={InputTextarea} rows={3} />
                                <ErrorMessage name="description" component="small" className="p-error ml-1" />
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
}

export default AddCategoryModal;
