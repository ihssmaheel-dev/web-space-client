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
    url: string;
}

interface AddCategoryModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    categories: CategoryI[];
    onAddCategory: (category: CategoryI) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, setVisible, categories, onAddCategory }) => {
    const initialValues = {
        name: "",
        icon: "",
        description: ""
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Category name is required")
            .matches(/^[a-zA-Z0-9 ]*$/, "Category name cannot contain special characters")
            .test(
                'maxChars',
                'Category name cannot exceed 12 chars',
                value => !value || value.split("").filter(char => char).length <= 12
            )
            .test('duplicate-category', 'This category name already exists', function(value) {
                const { path, createError } = this;
                const isDuplicate = categories?.some(category => category.name === value)
                return isDuplicate ? createError({ path, message: 'This category name already exists' }) : true;
            }),
        description: Yup.string()
            .test(
                'maxWords',
                'Description cannot exceed 30 words',
                value => !value || value.split(' ').filter(word => word).length <= 30
            ),
    });

    const handleSubmit = (values: any, { resetForm }: { resetForm: () => void }) => {
        const newCategory = {
            no: categories.length,
            id: crypto.randomUUID(),
            name: values.name,
            icon: values.icon || "pi pi-stop",
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
                onSubmit={(values, actions) => handleSubmit(values, actions)}
            >
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
