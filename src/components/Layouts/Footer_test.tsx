import React, { useState, useEffect } from 'react';

const Footer = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [fullscreen, setfullscrean] = useState(true);
    const handlefullscrean = () => {
        if(!document.fullscreenElement){
            document.documentElement.requestFullscreen().then(() => {
                setfullscrean(true);
            });
        } else {
            document.exitFullscreen().then(() => {
                setfullscrean(false);
            })
        }
    }
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="dark:text-white text-left text-lg font-bold p-6 pt-0 mt-auto">
            © {currentTime.getFullYear()} MAYORA INDAH TBK : {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
            <button onClick={handlefullscrean}
            className={`flex items-center p-2 rounded-full ${fullscreen ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white-light/40 hover:text-red-500'}`}
            ></button>
        </div>
    );
};

export default Footer;
