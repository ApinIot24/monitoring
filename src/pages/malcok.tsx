import React from 'react';
import ComponentCounterMalcok2b from './ComponentCounterMalcok2b';

const Malcok2b = () => {
    const lines = ['renceng_l2b', 'tray_l2b']; // Sesuaikan dengan line yang ingin ditampilkan

    return (
        <div className="mb-5 flex items-center justify-center flex-wrap xl:flex-nowrap">
            {lines.map(line => (
                <div key={line} className="lg:max-w-[100%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <ComponentCounterMalcok2b line={line} url={'/'} label={'MALCOK2B'}/>
                </div>
            ))}
        </div>
    );
};

export default Malcok2b;
