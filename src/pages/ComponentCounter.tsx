import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import IconClock from '../components/Icon/IconClock';
import IconCalendar from '../components/Icon/IconCalendar';
import mayoraimg from '../../public/assets/images/logo2.png';
import { Link } from 'react-router-dom';

const ComponentCounter = ({ line, url , label}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentShift, setCurrentShift] = useState(null);
    const [packingData, setPackingData] = useState({ cntr_carton: 0 });
    const [shiftData, setShiftData] = useState({ shift1: 0, shift2: 0, shift3: 0 });
    const [hourlyData, setHourlyData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            shift3: `http://10.37.12.17:3000/shift3_${line}_hourly`
        }
    };

    const TOTAL_CARTON = {
        l1: 1008,
        l2: 1344,
        l5: 6640,
        l7: 2432,
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
            let shift;

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
        };

        try {
            const shiftData = getShiftURL();
            const response = await axios.get(shiftData.url);

            const calcDiff = (data) =>
                data.map((val, i) => (i === 0 ? val.cntr_carton : val.cntr_carton - data[i - 1].cntr_carton));

            setHourlyData(calcDiff(response.data));
            setCurrentShift(shiftData.shift);
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data per jam');
        }
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
    }, [line]);

    useEffect(() => {
        setLoading(false);
    }, [packingData, shiftData, hourlyData]);

    const getTotalPacked = () => packingData.cntr_carton;
    const getAchievement = () => {
        const total = TOTAL_CARTON[line] || 1000; // Default jika line tidak dikenal
        return Math.round((getTotalPacked() / total) * 100);
    };

    return (
        <div>
            <div className="mb-5 flex items-center justify-center flex-wrap xl:flex-nowrap">
                <div className="w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="p-5 bg-red-600 flex flex-col items-center">
                        <div className='flex w-[100%]'>
                            <Link to="/" className="items-center">
                                <h1 className="text-white text-lg 2xl:text-[15px] font-black dark:text-white-light pr-3">WFR</h1>
                            </Link>
                            <Link to="/biscuit" className="items-center">
                                <h1 className="text-white text-lg 2xl:text-[15px] font-black dark:text-white-light pr-3">BSC</h1>
                            </Link>
                            <Link to="/tcw" className="items-center">
                                <h1 className="text-white text-lg 2xl:text-[15px] font-black dark:text-white-light">TCW</h1>
                            </Link>
                        </div>
                        <div className="flex flex-row items-center">
                            <h1 className="text-white text-5xl 2xl:text-[50px] font-black font-bigNumbers mt-4">{label} LINE {line.slice(-1)}</h1>
                            <Link to={url} className="flex items-center mt-4">
                                <IconArrowLeft className="h-[100px] w-[100px] text-white" />
                            </Link>
                            <h1 className="text-white text-5xl 2xl:text-[50px] font-black font-bigNumbers mt-4">{TOTAL_CARTON[line]} CARTON</h1>
                            <button onClick={handleFullScreen} className="mt-4 items-center rounded-lg p-2">
                                <img src={mayoraimg} alt="" className="h-[50px] md:h-[70px] lg:h-[100px]" />
                            </button>
                        </div>
                        <div className="text-white text-left font-bigNumbers font-bold p-6 pt-0 mt-auto">
                            <h3 className="text-3xl flex flex-row items-center"> Shift : {currentShift}  <IconCalendar className='ml-2' />  {currentTime.toLocaleDateString('id-ID')}  <IconClock className='ml-2' /> {currentTime.toLocaleTimeString()}</h3>
                        </div>
                    </div>
                    <div className="py-7 px-6">
                        <div className="flex flex-row items-center mb-2">
                            <div className="w-full h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col items-center mb-2">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">ACTUAL</h4>
                                <div className="flex flex-col items-center justify-center h-full">
                                    <span className="text-red-600 text-[70px] xl:text-[170px] font-black text-center mt-[100px] font-bigNumbers">{getTotalPacked()}</span>
                                    <h4 className="text-black text-5xl text-center dark:text-white font-extrabold mt-[150px]">CARTON</h4>
                                </div>
                            </div>

                            <div className="w-full h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center">
                                <table className="w-full text-center border-collapse font-bigNumbers">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">JAM</h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hourlyData.length > 0 ? (
                                            hourlyData.map((carton, idx) => {
                                                const maxCarton = TOTAL_CARTON[line];
                                                const percent = ((carton / maxCarton) * 100).toFixed(1); // Hitung persentase
                                                return (
                                                    <tr key={idx}>
                                                        <td className={`border border-red-500 px-2 py-2 text-black font-extrabold w-1/5 ${hourlyData.length > 4 ? 'text-5xl' : 'text-6xl'}`}>
                                                            {idx + 1}
                                                        </td>
                                                        <td className={`border border-red-500 px-2 py-2 text-black font-extrabold w-3/5 ${hourlyData.length > 4 ? 'text-5xl' : 'text-6xl'}`}>
                                                            {carton}  ({percent}%)
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td className="border border-red-500 px-2 py-2 text-black text-9xl font-extrabold w-1/5">1</td>
                                                <td className="border border-red-500 px-2 py-2 text-black text-9xl font-extrabold w-3/5">0</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center mb-2">
                            <div className="w-full md:w-full h-[300px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col justify-center mb-2 md:mb-0">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">Achievement</h4>
                                <div className="flex flex-col items-center justify-center h-full">
                                    <span className="text-red-600 text-[70px] xl:text-[130px] font-black text-center font-bigNumbers">{getAchievement()}%</span>
                                </div>
                            </div>

                            <div className="w-full md:w-full h-[300px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">SHIFT</h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='font-bigNumbers'>
                                        {Object.entries(shiftData).map(([shift, carton]) => {
                                            const maxCarton = TOTAL_CARTON[line]; // Target per shift
                                            const percent = ((carton / maxCarton) * 100).toFixed(1); // Hitung persentase
                                            return (
                                                <tr key={shift}>
                                                    <td className="border border-red-500 px-2 py-1 text-black text-6xl font-extrabold">{shift.slice(-1)}</td>
                                                    <td className="border border-red-500 px-2 py-1 text-black text-6xl font-extrabold">{carton} ({percent}%)</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentCounter;
