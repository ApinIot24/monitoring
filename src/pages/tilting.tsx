import React from 'react';
import ComponentCounter from './ComponentCounter_Tilting';
import ComponentCounter_Carton from './ComponentCounter_NEW_Special_Tilting';
const Index = () => {
    const line = 'l5';

    return (
        <div className="flex items-center justify-center flex-wrap xl:flex-nowrap">
                <div key={line} className="flex-1 h-full lg:max-w-[100%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <ComponentCounter line={line} url={'/'} label={'BSC'}/>
                </div>
            <div key={line} className="flex-1 h-full lg:max-w-[100%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <ComponentCounter_Carton line={line} url={'/'} label={'BSC'}/>
                </div>
        </div>
    );
};

export default Index;