import React from 'react';
import ComponentCounter from './ComponentCounter_NEW';

const Report = () => {
    const lines = ['l7', 'l6']; // Ganti sesuai line yang ingin kamu tampilkan

    return (
        <div className="flex items-center justify-center flex-wrap xl:flex-nowrap">
            {lines.map(line => (
                <div
                    key={line}
                    className="lg:max-w-[100%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]
                               rounded border border-white-light dark:border-[#1b2e4b]
                               dark:bg-[#191e3a] dark:shadow-none"
                >
                    <ComponentCounter line={line} url={'/report'} label={'REPORT'} />
                </div>
            ))}
        </div>
    );
};

export default Report;
