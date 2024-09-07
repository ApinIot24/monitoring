import React, { useState, useEffect } from 'react';

const Footer = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="dark:text-white text-left text-lg font-bold p-6 pt-0 mt-auto">
            © {currentTime.getFullYear()} MAYORA INDAH TBK : {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
        </div>
    );
};

export default Footer;
