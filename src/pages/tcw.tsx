import React from 'react';
import ComponentCounter from './ComponentCounter';

const tcw = () => {
    const lines = ['l7', 'l6']; // Sesuaikan dengan line yang ingin ditampilkan

    return (
        <div className="mb-5 flex items-center justify-center flex-wrap xl:flex-nowrap">
            {lines.map(line => (
                <div key={line} className="lg:max-w-[100%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <ComponentCounter line={line} url={'/'} label={'TCW'}/>
                </div>
            ))}
        </div>
    );
};

export default tcw;