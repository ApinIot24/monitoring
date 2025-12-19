import React, { useState, useEffect } from "react";
import ComponentCounter from "./ComponentCounter_NEW";

const Index = () => {
    const lines = ["l1", "l2"]; // Sesuaikan dengan line yang ingin ditampilkan
    const videos = ["/videos/R2_fixed.mp4"]; // Ganti sesuai lokasi videomu
    const [showVideo, setShowVideo] = useState(false);
    const [isAutoplay, setIsAutoplay] = useState(false);

    // Fungsi untuk mengecek jam aktif autoplay
    const checkAutoplayTime = () => {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();

        // Jam 10.00 - 13.00
        const isMorning = hour >= 10 && hour < 13;

        // Jam 17.20 - 21.00
        const isEvening = hour >= 17 && hour < 21;

        // Jam 01.00 - 05.00
        const isNight = hour >= 1 && hour < 5;

        return isMorning || isEvening || isNight;
    };
    // const checkAutoplayTime = () => {
    //     const hour = new Date().getHours();
    //     return (
    //         (hour >= 10 && hour < 13) ||
    //         (hour >= 17 && hour < 21) ||
    //         (hour >= 1 && hour < 5)
    //     );
    // };

    // Cek waktu autoplay saat komponen dimuat
    useEffect(() => {
        setIsAutoplay(checkAutoplayTime());
    }, []);

    // Jalankan autoplay tiap 15 menit sekali di jam aktif
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isAutoplay) {
            interval = setInterval(() => {
                setShowVideo((prev) => !prev);
            }, 120 * 60 * 1000); // 1 menit
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isAutoplay]);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* === COUNTER === */}
            {!showVideo && (
                <div className="flex items-center justify-center flex-wrap xl:flex-nowrap">
                    {lines.map((line) => (
                        <div
                            key={line}
                            className="lg:max-w-[100%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]
                         rounded border border-white-light dark:border-[#1b2e4b]
                         dark:bg-[#191e3a] dark:shadow-none"
                        >
                            <ComponentCounter line={line} url={"/biscuit"} label={"WFR"} />
                        </div>
                    ))}
                </div>
            )}

            {/* === VIDEO === */}
            {showVideo && (
                <video
                    src={videos[0]}
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                    onEnded={() => setShowVideo(false)} // Kembali ke counter setelah video selesai
                />
            )}

            {/* === Indikator Autoplay === */}
            <div className="absolute top-2 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-md">
                Autoplay:{" "}
                <span className={isAutoplay ? "text-green-400" : "text-red-400"}>
                    {isAutoplay ? "ON" : "OFF"}
                </span>
            </div>

            {/* === Kontrol Manual === */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
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

export default Index;
