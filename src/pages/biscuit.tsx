import React, { useState, useEffect, useRef } from "react";
import ComponentCounter from "./ComponentCounter_NEW";

const Biscuit = () => {
  const lines = ["l5"];
  const videos = ["/videos/R2_fixed.mp4"];
  const [showVideo, setShowVideo] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true); // aktifkan autoplay
  const nextPlayTime = useRef<Date | null>(null);

  // Fungsi untuk menjadwalkan waktu berikutnya (tiap 2 jam)
  const scheduleNextPlay = () => {
    const now = new Date();
    const next = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 jam dari sekarang
    nextPlayTime.current = next;
  };

  useEffect(() => {
    if (!isAutoplay) return;

    // Saat awal load
    if (!nextPlayTime.current) {
      scheduleNextPlay();
    }

    const interval = setInterval(() => {
      const now = new Date();

      // Jika sudah mencapai atau melewati waktu yang dijadwalkan
      if (nextPlayTime.current && now >= nextPlayTime.current) {
        setShowVideo(true);
      }
    }, 1*60* 1000); // cek setiap 30 detik

    return () => clearInterval(interval);
  }, [isAutoplay]);

  // Setelah video selesai → kembali ke counter dan jadwalkan lagi 2 jam kemudian
  const handleVideoEnded = () => {
    setShowVideo(false);
    scheduleNextPlay();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* === COUNTER === */}
      {!showVideo && (
        <div className="flex items-center justify-center flex-wrap xl:flex-nowrap h-full">
          {lines.map((line) => (
            <div
              key={line}
              className="lg:max-w-[100%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]
                  rounded border border-white-light dark:border-[#1b2e4b]
                  dark:bg-[#191e3a] dark:shadow-none"
            >
              <ComponentCounter line={line} url={"/tcw"} label={"BSC"} />
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
          onEnded={handleVideoEnded}
        />
      )}

      {/* === Indikator Autoplay === */}
      <div className="absolute top-2 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-md">
        Autoplay:{" "}
        <span className={isAutoplay ? "text-green-400" : "text-red-400"}>
          {isAutoplay ? "ON" : "OFF"}
        </span>
        {nextPlayTime.current && (
          <div className="text-xs text-gray-300 mt-1">
            Next video: {nextPlayTime.current.toLocaleTimeString()}
          </div>
        )}
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

export default Biscuit;
