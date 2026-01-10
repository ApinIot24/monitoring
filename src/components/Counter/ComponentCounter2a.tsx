import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IconArrowLeft from '../Icon/IconArrowLeft';
import IconClock from '../Icon/IconClock';
import IconCalendar from '../Icon/IconCalendar';
import mayoraimg from '../../../public/assets/images/logo2.png';
import { Link } from 'react-router-dom';

interface ComponentCounter2aProps {
    line: string;
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

const ComponentCounter2a = ({ line, url, label, nameOpsi = null }: ComponentCounter2aProps) => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [currentShift, setCurrentShift] = useState<number | null>(null);
    const [packingData, setPackingData] = useState<PackingData>({ cntr_carton: 0 });
    const [shiftData, setShiftData] = useState<ShiftData>({ shift1: 0, shift2: 0, shift3: 0 });
    const [hourlyData, setHourlyData] = useState<number[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [retry, setRetry] = useState(0);

    const headerTitle =
        line.includes('renceng')
            ? `RENCENG ${line.slice(-2).toUpperCase()}`
            : line.includes('tray')
                ? `TRAY ${line.slice(-2).toUpperCase()}`
                : (nameOpsi != null ? nameOpsi : label);

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
        packing: `http://10.37.12.34:3000/packing_${line}`,
        shift: `http://10.37.12.34:3000/shift_${line}`,
        hourly: {
            shift1: `http://10.37.12.34:3000/shift1_${line}_hourly`,
            shift2: `http://10.37.12.34:3000/shift2_${line}_hourly`,
            shift3: `http://10.37.12.34:3000/shift3_${line}_hourly`
        }
    };

    const SHIFT_TARGETS_WEEKDAY: Record<string, ShiftData> = {
        renceng_l2a: { shift1: 6000, shift2: 6000, shift3: 4200 },
        tray_l2a: { shift1: 2163, shift2: 2163, shift3: 1514 },
    };
    const SHIFT_TARGETS_SATURDAY: Record<string, ShiftData> = {
        renceng_l2a: { shift1: 4375, shift2: 4375, shift3: 3063 },
        tray_l2a: { shift1: 935, shift2: 935, shift3: 655 },
    };
    const isSaturday = () => new Date().getDay() === 6;
    const getShiftTargetsForLine = (lineKey: string): ShiftData => {
        const source = isSaturday() ? SHIFT_TARGETS_SATURDAY : SHIFT_TARGETS_WEEKDAY;
        return source[lineKey] || { shift1: 0, shift2: 0, shift3: 0 };
    };
    const getShiftTarget = (lineKey: string, shift: number | null): number => {
        const targets = getShiftTargetsForLine(lineKey);
        if (shift === 1) return targets.shift1;
        if (shift === 2) return targets.shift2;
        if (shift === 3) return targets.shift3;
        return 0;
    };
    const getShiftTargetByKey = (lineKey: string, shiftKey: keyof ShiftData): number => {
        const targets = getShiftTargetsForLine(lineKey);
        return targets[shiftKey] || 0;
    };
    const getDailyTarget = (lineKey: string): number => {
        const t = getShiftTargetsForLine(lineKey);
        return (t.shift1 + t.shift2 + t.shift3);
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
            const day = now.getDay();

            let shift;

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
            if (!shiftData.url || !shiftData.shift) {
                setHourlyData([]);
                setCurrentShift(null);
                return;
            }

            const response = await axios.get(shiftData.url);

            if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                setHourlyData([]);
                setCurrentShift(shiftData.shift);
                return;
            }

            const calcDiff = (data: PackingData[]) =>
                data.map((val: PackingData, i: number) => {
                    if (i === 0) {
                        return val.cntr_carton || 0;
                    }
                    const prev = data[i - 1]?.cntr_carton || 0;
                    const curr = val.cntr_carton || 0;
                    return Math.max(0, curr - prev);
                });

            setHourlyData(calcDiff(response.data));
            setCurrentShift(shiftData.shift);
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data per jam');
            setHourlyData([]);
            setCurrentShift(null);
        }
    };

    const getTotalCarton = (line: string): number => {
        return getDailyTarget(line) || 1000;
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

    useEffect(() => {
        if (packingData && shiftData && hourlyData) setLoading(false);
    }, [packingData, shiftData, hourlyData]);

    const getTotalPacked = (): number => {
        const carton = packingData?.cntr_carton || 0;
        return Number(carton) || 0;
    };

    const getAchievement = (): number => {
        // Calculate achievement based on current shift if available, otherwise use daily target
        // This ensures achievement matches the shift table percentages for the active shift
        if (currentShift !== null) {
            const shiftKey = `shift${currentShift}` as keyof ShiftData;
            const carton = shiftData[shiftKey] || 0;
            const maxCarton = getShiftTargetByKey(line, shiftKey);
            if (maxCarton > 0) {
                const achievement = Math.round((Number(carton) / maxCarton) * 100);
                return isNaN(achievement) ? 0 : achievement;
            }
        }

        // Fallback: calculate based on daily target
        const dailyTarget = getTotalCarton(line);
        if (dailyTarget <= 0) return 0;
        const packed = getTotalPacked();
        const achievement = Math.round((packed / dailyTarget) * 100);
        return isNaN(achievement) ? 0 : achievement;
    };

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
                                <h1 className="text-white text-4xl md:text-5xl 2xl:text-[50px] font-black font-bigNumbers mt-4" aria-label="Counter">{(currentShift ? getShiftTarget(line, currentShift) : getTotalCarton(line))} CARTON</h1>
                            </div>
                            <div className="text-white text-left font-bigNumbers font-bold p-6 pt-0 mt-auto w-full flex flex-col md:flex-row justify-between items-center">
                                <h3 className="text-2xl md:text-3xl flex flex-row items-center" aria-label="Shift dan Waktu"> Shift : {currentShift !== null ? currentShift : '-'}  <IconCalendar className='ml-2' />  {currentTime.toLocaleDateString('id-ID')}  <IconClock className='ml-2' /> {currentTime.toLocaleTimeString()}</h3>
                            </div>
                        </header>
                        <section className="py-7 px-6 bg-gradient-to-br from-white via-red-50 to-red-100 border-b border-red-200">
                            <div className="flex flex-col md:flex-row items-center mb-2 gap-6">
                                <div className="w-full  min-h-[16rem] h-auto shadow-md rounded-xl border border-red-200 flex flex-col items-center mb-2 bg-white">
                                    <h4 className="text-red-900 text-3xl md:text-5xl mt-4 text-center font-black font-extrabold mb-2">ACTUAL</h4>
                                    <div className="flex flex-col items-center justify-center h-full p-3">
                                        <span className="text-red-600 text-[70px] xl:text-[170px] font-black text-center mt-[100px] font-bigNumbers">{getTotalPacked().toLocaleString()}</span>
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
                                                    const cartonValue = Number(carton) || 0;
                                                    const maxCarton = getShiftTarget(line, currentShift);
                                                    const percent = maxCarton > 0
                                                        ? ((cartonValue / maxCarton) * 100).toFixed(1)
                                                        : '0.0';
                                                    return (
                                                        <tr key={idx} className="hover:bg-red-50 transition">
                                                            <td
                                                                className={`border border-red-400 text-red-900 font-extrabold w-1/5 ${hourlyData.length > 4 ? 'text-5xl' : 'text-6xl'}`}
                                                            >
                                                                {idx + 1}
                                                            </td>
                                                            <td className={`border border-red-400 text-red-900 font-extrabold w-3/5 ${hourlyData.length > 4 ? 'text-5xl' : 'text-6xl'}`}>
                                                                <div className="flex flex-row items-center justify-center">
                                                                    <h3>{cartonValue.toLocaleString()}</h3>
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
                                    <div className="w-full bg-gray-200 rounded-full h-6 mt-[5rem]">
                                        <div
                                            className="bg-red-500 h-6 rounded-full"
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
                                        {(['shift1', 'shift2', 'shift3'] as Array<keyof ShiftData>).map((shiftKey) => {
                                            const carton = shiftData[shiftKey] || 0;
                                            const maxCarton = getShiftTargetByKey(line, shiftKey);
                                            const percent = maxCarton > 0
                                                ? ((Number(carton) / maxCarton) * 100).toFixed(1)
                                                : '0.0';
                                            const shiftNumber = shiftKey.slice(-1);

                                            return (
                                                <tr key={shiftKey} className="hover:bg-red-50 transition">
                                                    <td className="border border-red-400 text-red-900 font-extrabold w-1/5 text-2xl md:text-4xl lg:text-5xl">{shiftNumber}</td>
                                                    <td className="border border-red-400 text-red-900 font-extrabold w-3/5 text-2xl md:text-4xl lg:text-5xl">{Number(carton).toLocaleString()} ({percent}%)</td>
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

export default ComponentCounter2a;
