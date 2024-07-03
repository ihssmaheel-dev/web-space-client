import React from 'react';
import { Dropdown, DropdownProps } from 'primereact/dropdown';

interface IconDropdownProps {
    value: string;
    onChange: (value: string) => void;
    icons: { label: string; value: string }[];
}

const IconDropdown: React.FC<IconDropdownProps> = ({ value, onChange, icons }) => {
    const selectedIconTemplate = (option: any, props: DropdownProps) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <i className={`mr-2 pi ${option.value}`}></i>
                    <div>{option.label}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const iconOptionTemplate = (option: any) => {
        return (
            <div className="flex align-items-center">
                <i className={`mr-2 pi ${option.value}`}></i>
                <div>{option.label}</div>
            </div>
        );
    };

    return (
        <Dropdown
            value={value}
            options={icons}
            onChange={(e) => onChange(e.value)}
            placeholder="Select an icon"
            filter
            valueTemplate={selectedIconTemplate}
            itemTemplate={iconOptionTemplate}
        />
    );
}

export default IconDropdown;