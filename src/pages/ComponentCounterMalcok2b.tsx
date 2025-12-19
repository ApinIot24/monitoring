import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import IconClock from '../components/Icon/IconClock';
import IconCalendar from '../components/Icon/IconCalendar';
import mayoraimg from '../../public/assets/images/logo2.png';
import { Link } from 'react-router-dom';

interface ComponentCounterProps {
    line: string;      // ex: "renceng_l2b" / "tray_l2b"
    url: string;
    label: string;
    nameOpsi?: string | null;
}

interface PackingData {
    cntr_carton: number;
}

interface ShiftData {
    shift1: number;
    shift2: number;
    shift3: number;
}

const TOTAL_CARTON = {
    renceng_l2b: 1016,
    tray_l2b: 1016,
};
const TOTAL_CARTON_Sabtu = {
    renceng_l2b: 630,
    tray_l2b: 630,
};

const ComponentCounterMalcok2b: React.FC<ComponentCounterProps> = ({ line, url, label, nameOpsi = null }) => {

    // UI state
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [currentShift, setCurrentShift] = useState<number | null>(null);
    const [packingData, setPackingData] = useState<PackingData>({ cntr_carton: 0 });
    const [shiftData, setShiftData] = useState<ShiftData>({ shift1: 0, shift2: 0, shift3: 0 });
    const [hourlyData, setHourlyData] = useState<number[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [retry, setRetry] = useState(0);

    // TITLE (HEADER)
    const headerTitle =
        line === "renceng_l2b"
            ? "Renceng"
            : line === "tray_l2b"
                ? "Tray"
                : label;

    // pisahkan format, tapi backend sebenarnya tidak butuh eksplisit
    const [type] = line.split("_"); // renceng / tray

    // Dynamic API sesuai pattern lo:
    const API = {
        packing: `http://10.37.12.17:3000/packing${line}`,
        shift: `http://10.37.12.17:3000/shift_l2b`,
        hourly: {
            shift1: `http://10.37.12.17:3000/shift1${line}_hourly`,
            shift2: `http://10.37.12.17:3000/shift2${line}_hourly`,
            shift3: `http://10.37.12.17:3000/shift3${line}_hourly`,
        },
    };

    // ===== TIMER =====
    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const handleFullScreen = () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    };

    // ===== API FUNCS =====
    const fetchPackingData = async () => {
        try {
            const response = await axios.get(API.packing);
            setPackingData(response.data[0] || { cntr_carton: 0 });
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data packing');
        }
    };

    // GET SHIFT (selalu shift_l2b)
    const fetchShiftData = async () => {
        try {
            const response = await axios.get(API.shift);
            setShiftData(response.data[0] || { shift1: 0, shift2: 0, shift3: 0 });
        } catch (err) {
            console.error(err);
        setError('Gagal memuat data shift');
        }
    };

    // GET HOURLY
    const fetchHourlyData = async () => {

        const getShiftURL = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const day = now.getDay(); // 6 = Sabtu

            let shift: number;

            if (day === 6) {
                // --- SHIFT SABTU ---
                if ((hours === 6 && minutes >= 46) || (hours > 6 && hours < 11) || (hours === 11 && minutes <= 45)) {
                    shift = 1;
                    return { shift, url: API.hourly.shift1 };
                }
                if ((hours === 11 && minutes >= 46) || (hours > 11 && hours < 16) || (hours === 16 && minutes <= 45)) {
                    shift = 2;
                    return { shift, url: API.hourly.shift2 };
                }
                shift = 3;
                return { shift, url: API.hourly.shift3 };

            } else {
                // --- SHIFT NORMAL ---
                if ((hours === 6 && minutes >= 46) || (hours > 6 && hours < 14) || (hours === 14 && minutes <= 45)) {
                    shift = 1;
                    return { shift, url: API.hourly.shift1 };
                }
                if ((hours === 14 && minutes >= 46) || (hours > 14 && hours < 22) || (hours === 22 && minutes <= 45)) {
                    shift = 2;
                    return { shift, url: API.hourly.shift2 };
                }
                shift = 3;
                return { shift, url: API.hourly.shift3 };
            }
        };

        try {
            const shiftInfo = getShiftURL();

            setCurrentShift(shiftInfo.shift);

            if (!shiftInfo.url) {
                setHourlyData([]);
                return;
            }

            const response = await axios.get(shiftInfo.url);

            const diff = response.data.map((val: any, i: number) =>
                i === 0 ? val.cntr_carton : val.cntr_carton - response.data[i - 1].cntr_carton
            );

            setHourlyData(diff);

        } catch (err) {
            console.error(err);
            setError('Gagal memuat data per jam');
        }
    };

    useEffect(() => {
        if (packingData && shiftData && hourlyData) setLoading(false);
    }, [packingData, shiftData, hourlyData]);

    const getTotalCarton = (line: string): number => {
        const day = new Date().getDay();
        if (day === 6) return TOTAL_CARTON_Sabtu[line] || 1000;
        return TOTAL_CARTON[line] || 1000;
    };

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                await Promise.all([
                    fetchPackingData(),
                    fetchShiftData(),
                    fetchHourlyData()
                ]);

                if (mounted) setError(null);

            } catch (err) {
                if (mounted) setError("Gagal memuat data");
            }
        };

        load();
        const timer = setInterval(load, 10000);

        return () => {
            mounted = false;
            clearInterval(timer);
        };
    }, [line, retry]);

    // AUTO REMOVE LOADING
    useEffect(() => {
        setLoading(false);
    }, [packingData, shiftData, hourlyData]);

    // COUNTER CALC
    const getTotalPacked = (): number => packingData.cntr_carton;

    const getAchievement = (): number => {
        const total = getTotalCarton(line);
        return Math.round((getTotalPacked() / total) * 100);
    };

    // ERROR UI
    const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong>Error:</strong> {message}
            <button
                onClick={onRetry}
                className="block bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 animate-fade-in">
            {/* Loading and Error UI */}
            {isLoading && (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-3xl text-red-600 font-bold animate-fade-in">Loading...</div>
                </div>
            )}
            {error && (
                <div className="flex justify-center items-center h-screen">
                    <ErrorDisplay message={error} onRetry={() => { setError(null); setRetry(retry + 1); }} />
                </div>
            )}
            {/* Main UI */}
            {!isLoading && !error && (
                <main className="flex flex-col items-center justify-center flex-wrap xl:flex-nowrap animate-fade-in">
                    <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl border border-red-200 dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none overflow-hidden">
                        <header className="p-2 bg-gradient-to-r from-red-600 via-red-500 to-red-400 flex flex-col items-center shadow-md">
                            <div className="flex flex-col md:flex-row items-center w-full justify-between">
                                <h1 className="text-white text-4xl md:text-5xl 2xl:text-[50px] font-black font-bigNumbers mt-4" aria-label="Judul">{headerTitle}</h1>
                                <div className="flex items-center gap-4 mt-4 md:mt-0">
                                    <Link to={url} className="flex items-center" aria-label="Kembali">
                                        <IconArrowLeft className="h-[60px] w-[60px] text-white" />
                                    </Link>
                                    <button onClick={handleFullScreen} className="items-center rounded-lg p-2 bg-white bg-opacity-20 hover:bg-opacity-40 transition" aria-label="Fullscreen">
                                        <img src={mayoraimg} alt="Logo Mayora" className="h-[40px] md:h-[70px] lg:h-[100px]" />
                                    </button>
                                </div>
                                <h1 className="text-white text-4xl md:text-5xl 2xl:text-[50px] font-black font-bigNumbers mt-4" aria-label="Counter">{getTotalCarton(line)} COUNTER</h1>
                            </div>
                            <div className="text-white text-left font-bigNumbers font-bold p-6 pt-0 mt-auto w-full flex flex-col md:flex-row justify-between items-center">
                                <h3 className="text-2xl md:text-3xl flex flex-row items-center" aria-label="Shift dan Waktu"> Shift : {currentShift}  <IconCalendar className='ml-2' />  {currentTime.toLocaleDateString('id-ID')}  <IconClock className='ml-2' /> {currentTime.toLocaleTimeString()}</h3>
                            </div>
                        </header>

                            <section className="py-7 px-6 bg-gradient-to-br from-white via-red-50 to-red-100 border-b border-red-200">
                                <div className="flex flex-col md:flex-row items-center mb-2 gap-6">
                                <div className="w-full  min-h-[16rem] h-auto shadow-md rounded-xl border border-red-200 flex flex-col items-center mb-2 bg-white">
                                    <h4 className="text-red-900 text-3xl md:text-5xl mt-4 text-center font-black font-extrabold mb-2">ACTUAL</h4>
                                    <div className="flex flex-col items-center justify-center h-full p-3">
                                        <span className="text-red-600 text-[70px] xl:text-[170px] font-black text-center mt-[100px] font-bigNumbers">{getTotalPacked()}</span>
                                        <h4 className="text-red-900 text-3xl md:text-5xl text-center font-extrabold mt-[150px]">CARTON</h4>
                                    </div>
                                </div>
                                <div className="w-full min-h-[16rem] h-auto shadow-md rounded-xl border border-red-200 flex justify-center bg-white overflow-x-auto">
                                    <table className="w-full text-center border-collapse font-bigNumbers text-sm md:text-base lg:text-lg flex-grow">
                                        <thead>
                                            <tr>
                                                <th className="border border-red-400 px-2 py-2 bg-red-100 whitespace-nowrap">
                                                    <h4 className="text-red-900 text-base md:text-2xl font-extrabold">JAM</h4>
                                                </th>
                                                <th className="border border-red-400 px-2 py-2 bg-red-100 whitespace-nowrap">
                                                    <h4 className="text-red-900 text-base md:text-2xl font-extrabold">CARTON</h4>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hourlyData.length > 0 ? (
                                                hourlyData.map((carton, idx) => {
                                                    const maxCarton = getTotalCarton(line);
                                                    const percent = ((carton / maxCarton) * 100).toFixed(1);
                                                    return (
                                                        <tr key={idx} className="hover:bg-red-50 transition">
                                                            <td
                                                                className={`border border-red-400 text-red-900 font-extrabold w-1/5 ${hourlyData.length > 4 ? 'text-5xl' : 'text-6xl'}`}
                                                            >
                                                                {idx + 1}
                                                            </td>
                                                            <td className={`border border-red-400 text-red-900 font-extrabold w-3/5 ${hourlyData.length > 4 ? 'text-5xl' : 'text-6xl'}`}>
                                                                <div className="flex flex-row items-center justify-center">
                                                                    <h3>{carton}</h3>
                                                                    <h3>({percent}%)</h3>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td className="border border-red-400 text-red-900 text-2xl md:text-4xl lg:text-6xl font-extrabold w-1/5">
                                                        1
                                                    </td>
                                                    <td className="border border-red-400 text-red-900 text-2xl md:text-4xl lg:text-6xl font-extrabold w-3/5">
                                                        0
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </section>
                            <section className="flex flex-col md:flex-row items-center mb-2 gap-6 bg-gradient-to-br from-white via-red-50 to-red-100 p-6">
                                <div className="w-full min-h-[16rem] h-auto shadow-md rounded-xl border border-red-200 flex flex-col justify-center mb-2 md:mb-0 bg-white p-4 md:p-8">
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <span className="text-red-900 text-3xl md:text-5xl text-center font-black font-extrabold mb-12">
                                            Achievement
                                        </span>
                                        <span className="text-red-600 text-[70px] xl:text-[130px] font-black text-center font-bigNumbers">
                                            {getAchievement()}%
                                        </span>

                                        {/* Achievement Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-6 mt-[5rem]">
                                            <div
                                                className="bg-red-500 h-6 rounded-full" // Choose your bar color (e.g., bg-green-500)
                                                style={{ width: `${getAchievement()}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full min-h-[16rem] h-auto shadow-md rounded-xl border border-red-200 flex justify-center bg-white overflow-x-auto">
                                    <table className="w-full text-center border-collapse font-bigNumbers text-sm md:text-base lg:text-lg flex-grow">
                                        <thead>
                                            <tr>
                                                <th className="border border-red-400 px-2 py-2 bg-red-100 whitespace-nowrap">
                                                    <h4 className="text-red-900 text-base md:text-2xl font-extrabold">SHIFT</h4>
                                                </th>
                                                <th className="border border-red-400 px-2 py-2 bg-red-100 whitespace-nowrap">
                                                    <h4 className="text-red-900 text-base md:text-2xl font-extrabold">CARTON</h4>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='font-bigNumbers'>
                                            {Object.entries(shiftData).map(([shift, carton]) => {
                                                const maxCarton = getTotalCarton(line);
                                                const percent = ((carton / maxCarton) * 100).toFixed(1);
                                                return (
                                                    <tr key={shift} className="hover:bg-red-50 transition">
                                                        <td className="border border-red-400 text-red-900 font-extrabold w-1/5 text-2xl md:text-4xl lg:text-5xl">{shift.slice(-1)}</td>
                                                        <td className="border border-red-400 text-red-900 font-extrabold w-3/5 text-2xl md:text-4xl lg:text-5xl">{carton} ({percent}%)</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                    </div>
                </main>
            )}
            {/* Animation CSS */}
            <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fadeIn 0.5s ease-out;
                    }
                `}</style>
        </div>
    );
};

export default ComponentCounterMalcok2b;
