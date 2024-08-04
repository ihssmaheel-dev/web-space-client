import React from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IconDropdown from "./IconDropdown";
import { icons } from "../utils/icons";
import { CategoryI } from "../types";

interface EditCategoryModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    categories: CategoryI[];
    category: CategoryI;
    onUpdateCategory: (category: CategoryI) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ visible, setVisible, categories, category, onUpdateCategory }) => {
    const initialValues = { name: category?.name, icon: category?.icon };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Category name is required")
            .matches(/^[a-zA-Z0-9 ]*$/, "Category name cannot contain special characters")
            .max(12, 'Category name cannot exceed 12 chars')
            .test('duplicate-category', 'This category name already exists', value => category.name !== value ? !categories.some(category => category.name === value) : true),
    });

    const handleSubmit = (values: typeof initialValues) => {
        const updatedCategory: CategoryI = {
            ...category,
            name: values.name,
            icon: values.icon || "pi pi-stop",
            updatedAt: Date.now()
        };

        onUpdateCategory(updatedCategory);
        setVisible(false);
    };

    return (
        <Dialog className="w-6" visible={visible} onHide={() => setVisible(false)} header="Edit Category">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(values, actions) => handleSubmit(values)}>
                {({ setFieldValue, values }) => (
                    <Form>
                        <div className="mb-5">
                            <div className="grid mb-2">
                                <div className="flex flex-column gap-2 col-6">
                                    <label htmlFor="name">Category name <span className="text-red-200">*</span></label>
                                    <Field id="name" name="name" as={InputText} />
                                    <ErrorMessage name="name" component="small" className="p-error ml-1" />
                                </div>
                                <div className="flex flex-column gap-2 col-6">
                                    <label htmlFor="icon">Category Icon</label>
                                    <IconDropdown
                                        value={values.icon}
                                        onChange={(value: string) => setFieldValue('icon', value)}
                                        icons={icons}
                                    />
                                    <ErrorMessage name="icon" component="small" className="p-error ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="p-mt-4">
                            <Button label="Update" icon="pi pi-check" className="mr-2" type="submit" />
                            <Button type="button" label="Cancel" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={() => setVisible(false)} />
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default EditCategoryModal;
