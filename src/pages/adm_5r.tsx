import React, { useState, useEffect } from "react";
import ComponentCounter_carton from "./ComponentCounter_NEW";
import ComponentCounter from "./ComponentCounter_Tilting";

const c_adm_bsc = () => {
    const line = "l5";
    const videos = ["/videos/R2_fixed.mp4"]; // Tambahkan path video kamu
    const [showVideo, setShowVideo] = useState(false);
    const [isAutoplay, setIsAutoplay] = useState(false);

    // Fungsi untuk mengecek waktu aktif autoplay (jam tertentu)
    const checkAutoplayTime = () => {
        const hour = new Date().getHours();
        return (
            (hour >= 10 && hour < 13) ||
            (hour >= 17 && hour < 21) ||
            (hour >= 1 && hour < 5)
        );
    };

    // Efek awal: cek apakah saat ini di jam autoplay
    useEffect(() => {
        setIsAutoplay(checkAutoplayTime());
    }, []);

    // Efek untuk menjalankan autoplay
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isAutoplay) {
            interval = setInterval(() => {
                setShowVideo((prev) => !prev); // bergantian tiap 15 menit
            }, 15 * 60 * 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isAutoplay]);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* Tampilan Counter */}
            {!showVideo && (
                <div className="flex items-center justify-center flex-wrap xl:flex-nowrap h-full">
                    <div
                        key={`${line}-1`}
                        className="flex-1 h-full lg:max-w-[100%] w-full 
                      bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] 
                      rounded border border-white-light 
                      dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none"
                    >
                        <ComponentCounter line={line} url={"/"} label={"BSC"} />
                    </div>
                    <div key={line} className="flex-1 h-full lg:max-w-[100%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <ComponentCounter_carton line={line} url={'/'} label={'BSC'}/>
                </div>

                </div>
            )}

            {/* Tampilan Video */}
            {showVideo && (
                <video
                    src={videos[0]}
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                    onEnded={() => setShowVideo(false)}
                />
            )}

            {/* Indikator Autoplay */}
            <div className="absolute top-2 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-md">
                Autoplay:{" "}
                <span className={isAutoplay ? "text-green-400" : "text-red-400"}>
                    {isAutoplay ? "ON" : "OFF"}
                </span>
            </div>

            {/* Kontrol tombol manual */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                {/* Tombol pindah slide */}
                <button
                    onClick={() => setShowVideo(false)}
                    className="bg-white/20 text-black px-4 py-2 rounded hover:bg-white/40"
                >
                    Counter
                </button>
                <button
                    onClick={() => setShowVideo(true)}
                    className="bg-white/20 text-black px-4 py-2 rounded hover:bg-white/40"
                >
                    Video
                </button>

                {/* Tombol Autoplay ON/OFF */}
                <button
                    onClick={() => setIsAutoplay((prev) => !prev)}
                    className="bg-white/20 text-black px-4 py-2 rounded hover:bg-white/40"
                >
                    {isAutoplay ? "Matikan Autoplay" : "Nyalakan Autoplay"}
                </button>
            </div>
        </div>
    );
};

export default c_adm_bsc;
