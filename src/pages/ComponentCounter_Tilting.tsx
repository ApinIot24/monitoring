
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import IconClock from '../components/Icon/IconClock';
import IconCalendar from '../components/Icon/IconCalendar';
import mayoraimg from '../../public/assets/images/logo2.png';
import { Link } from 'react-router-dom';

interface ComponentCounterProps {
    line: keyof typeof TOTAL_CARTON;
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
    l1: 1016,
    l2: 1368,
    l5: 6640,
    l6: 2312,
    l7: 2432,
};
const TOTAL_CARTON_Sabtu = {
    l1: 630,
    l2: 473,
    l5: 4150,
    l6: 1330,
    l7: 1330,
};

const ComponentCounter: React.FC<ComponentCounterProps> = ({ line, url, label, nameOpsi = null }) => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [currentShift, setCurrentShift] = useState<number | null>(null);
    const [packingData, setPackingData] = useState<PackingData>({ cntr_carton: 0 });
    const [shiftData, setShiftData] = useState<ShiftData>({ shift1: 0, shift2: 0, shift3: 0 });
    const [hourlyData, setHourlyData] = useState<number[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };


    const APIURLs = {
        packing: `http://10.37.12.17:3000/packing_${line}`,
        shift: `http://10.37.12.17:3000/shift_${line}`,
        hourly: {
            shift1: `http://10.37.12.17:3000/shift1_${line}_hourly`,
            shift2: `http://10.37.12.17:3000/shift2_${line}_hourly`,
            shift3: `http://10.37.12.17:3000/shift3_${line}_hourly`,
        },
    };


    const fetchPackingData = async () => {
        try {
            const response = await axios.get(APIURLs.packing);
            setPackingData(response.data[0] || { cntr_carton: 0 });
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data packing');
        }
    };

    const fetchShiftData = async () => {
        try {
            const response = await axios.get(APIURLs.shift);
            setShiftData(response.data[0] || { shift1: 0, shift2: 0, shift3: 0 });
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data shift');
        }
    };

    const fetchHourlyData = async () => {
        const getShiftURL = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const day = now.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu

            let shift: number | null;

            if (day === 6) {
                if ((hours === 6 && minutes >= 46) || ((hours > 6 && hours < 11) || (hours === 11 && minutes <= 45))) {
                    shift = 1;
                    return { shift, url: APIURLs.hourly.shift1 };
                } else if ((hours === 11 && minutes >= 46) || ((hours > 11 && hours < 16) || (hours === 16 && minutes <= 45))) {
                    shift = 2;
                    return { shift, url: APIURLs.hourly.shift2 };
                } else {
                    shift = 3;
                    return { shift, url: APIURLs.hourly.shift3 };
                }
            } else {
                if ((hours === 6 && minutes >= 46) || ((hours > 6 && hours < 14) || (hours === 14 && minutes <= 45))) {
                    shift = 1;
                    return { shift, url: APIURLs.hourly.shift1 };
                } else if ((hours === 14 && minutes >= 46) || ((hours > 14 && hours < 22) || (hours === 22 && minutes <= 45))) {
                    shift = 2;
                    return { shift, url: APIURLs.hourly.shift2 };
                } else {
                    shift = 3;
                    return { shift, url: APIURLs.hourly.shift3 };
                }
            }

            shift = null;
            return { shift, url: null };
        };

        try {
            const shiftData = getShiftURL();
            if (!shiftData.url) {
                setHourlyData([]);
                setCurrentShift(shiftData.shift);
                return;
            }
            const response = await axios.get(shiftData.url);
            const calcDiff = (data: { cntr_carton: number }[]) =>
                data.map((val, i) => (i === 0 ? val.cntr_carton : val.cntr_carton - data[i - 1].cntr_carton));
            setHourlyData(calcDiff(response.data));
            setCurrentShift(shiftData.shift);
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data per jam');
        }
    };

    const getTotalCarton = (line: keyof typeof TOTAL_CARTON): number => {
        const currentDay = new Date().getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
        if (currentDay === 6) {
            return TOTAL_CARTON_Sabtu[line] || 1000;
        }
        return TOTAL_CARTON[line] || 1000;
    };



    useEffect(() => {
        setLoading(true);
        fetchPackingData();
        fetchShiftData();
        fetchHourlyData();
        const interval = setInterval(() => {
            fetchPackingData();
            fetchShiftData();
            fetchHourlyData();
        }, 3000);
        return () => clearInterval(interval);
    }, [line, retryCount]);

    useEffect(() => {
        setLoading(false);
    }, [packingData, shiftData, hourlyData]);

    const getTotalPacked = (): number => packingData.cntr_carton;
    const getAchievement = (): number => {
        const total = getTotalCarton(line);
        return Math.round((getTotalPacked() / total) * 100);
    };



    const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate-fade-in" role="alert" aria-label="Error">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{message}</span>
            <button
                onClick={onRetry}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Coba Lagi"
            >
                Coba Lagi
            </button>
        </div>
    );

    // --- Main Render ---
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
                    <ErrorDisplay message={error} onRetry={() => { setError(null); setRetryCount(retryCount + 1); }} />
                </div>
            )}
            {/* Main UI */}
            {!isLoading && !error && (
                <main className="flex flex-col items-center justify-center flex-wrap xl:flex-nowrap animate-fade-in">
                    <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl border border-red-200 dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none overflow-hidden">
                        <header className="p-2 bg-gradient-to-r from-red-600 via-red-500 to-red-400 flex flex-col items-center shadow-md">
                            <div className="flex flex-col md:flex-row items-center w-full justify-between">
                                <h1 className="text-white text-4xl md:text-5xl 2xl:text-[50px] font-black font-bigNumbers mt-4" aria-label="Judul">{(nameOpsi != null ? nameOpsi : label)} Tilting {line.slice(-1)}</h1>
                                <div className="flex items-center gap-4 mt-4 md:mt-0">
                                    <Link to={url} className="flex items-center" aria-label="Kembali">
                                        <IconArrowLeft className="h-[60px] w-[60px] text-white" />
                                    </Link>
                                    <button onClick={handleFullScreen} className="items-center rounded-lg p-2 bg-white bg-opacity-20 hover:bg-opacity-40 transition" aria-label="Fullscreen">
                                        <img src={mayoraimg} alt="Logo Mayora" className="h-[40px] md:h-[70px] lg:h-[100px]" />
                                    </button>
                                </div>
                                <h1 className="text-white text-4xl md:text-5xl 2xl:text-[50px] font-black font-bigNumbers mt-4" aria-label="Counter">{getTotalCarton(line)} Counter</h1>
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
                                        <h4 className="text-red-900 text-3xl md:text-5xl text-center font-extrabold mt-[150px]">Tilting</h4>
                                    </div>
                                </div>
                                <div className="w-full  min-h-[16rem] h-auto shadow-md rounded-xl border border-red-200 flex justify-center bg-white overflow-x-auto">
                                    <table className="w-full text-center border-collapse font-bigNumbers text-sm md:text-base lg:text-lg">
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
                                                                className={`border border-red-400 text-red-900 font-extrabold w-1/5 text-2xl md:text-4xl lg:text-6xl ${idx > 4 ? 'text-5xl' : 'text-6xl'}`}
                                                            >
                                                                {idx + 1}
                                                            </td>
                                                            <td className={`border border-red-400 text-red-900 font-extrabold w-3/5 text-2xl md:text-4xl lg:text-6xl ${idx > 4 ? 'text-5xl' : 'text-6xl'}`}>
                                                                <div className="flex flex-col items-center justify-center">
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
                            <div className="w-full  min-h-[16rem] h-auto shadow-md rounded-xl border border-red-200 flex justify-center bg-white overflow-x-auto">
                                <table className="w-full text-center border-collapse text-sm md:text-base lg:text-lg">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-400 px-2 py-2 bg-red-100 whitespace-nowrap">
                                                <h4 className="text-red-900 text-base md:text-2xl font-extrabold">SHIFT</h4>
                                            </th>
                                            <th className="border border-red-400 px-2 py-2 bg-red-100 whitespace-nowrap">
                                                <h4 className="text-red-900 text-base md:text-2xl font-extrabold">Tilting</h4>
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

export default ComponentCounter;