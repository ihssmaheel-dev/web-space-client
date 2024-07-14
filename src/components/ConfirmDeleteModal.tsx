import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react'

interface ConfirmDeleteModalProps {
    visible: boolean;
    confirmDelete: (e: React.MouseEvent) => void;
    cancelDelete: (e: React.MouseEvent) => void;
    title?: string;
}

const ConfirmDeleteModal : React.FC<ConfirmDeleteModalProps> = ({ visible, confirmDelete, cancelDelete, title }) => {
    return (
        <Dialog onClick={(e) => { e.stopPropagation(); }} visible={visible} onHide={() => cancelDelete} closable={false} modal header="Confirm Delete"
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={cancelDelete}
                        />
                        <Button
                            label="Delete"
                            className="p-button-danger"
                            onClick={confirmDelete}
                        />
                    </div>
                }
            >
                <div>Are you sure you want to delete <b>{title && title.toLocaleUpperCase()}</b>?</div>
            </Dialog>
    )
}

export default ConfirmDeleteModal