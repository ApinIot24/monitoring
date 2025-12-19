import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import mayoraimg from '../../public/assets/images/logo2.png';
import dayjs from 'dayjs';
import { date } from 'yup';

const Index_2 = () => {
    const [packing_l1, setData] = useState([]);
    const [packing_l2, setData1] = useState([]);

    const [JamPackingl1_shift, setJamPackingl1_shift] = useState([]);
    const [JamPackingl2_shift, setJamPackingl2_shift] = useState([]);

    const [ShiftPackingl1, setShiftPackingl1] = useState({});
    const [ShiftPackingl2, setShiftPackingl2] = useState({});

    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handlefullscrean = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setfullscrean(true);
            });
        } else {
            document.exitFullscreen().then(() => {
                setfullscrean(false);
            });
        }
    };
    const [urlapi] = useState({
        packingl1_shift1: 'http://10.37.12.34:3000/shift1_l1_hourly',
        packingl1_shift2: 'http://10.37.12.34:3000/shift2_l1_hourly',
        packingl1_shift3: 'http://10.37.12.34:3000/shift3_l1_hourly',

        packingl2_shift1: 'http://10.37.12.34:3000/shift1_l2_hourly',
        packingl2_shift2: 'http://10.37.12.34:3000/shift2_l2_hourly',
        packingl2_shift3: 'http://10.37.12.34:3000/shift3_l2_hourly',

        packingl1_shift: 'http://10.37.12.34:3000/shift_l1',
        packingl2_shift: 'http://10.37.12.34:3000/shift_l2',
    });

    const total_planing_l1 = 1008;
    const total_planing_l2 = 1344;

    const packing_cntr_l1 = packing_l1.length > 0 ? packing_l1.map(item => item.cntr_carton).reduce((a, b) => a + b, 0) : 0;
    const packing_cntr_l2 = packing_l2.length > 0 ? packing_l2.map(item => item.cntr_carton).reduce((a, b) => a + b, 0) : 0;

    const packingAchive_l1 = total_planing_l1 > 0 ? (packing_cntr_l1 / total_planing_l1) * 100 : 0;
    const packingAchive_l2 = total_planing_l2 > 0 ? (packing_cntr_l2 / total_planing_l2) * 100 : 0;

    useEffect(() => {
        const fetchData = () => {
            axios.get('http://10.37.12.34:3000/packing_l1')
                .then((response) => {
                    setData(response.data.length > 0 ? response.data : [{ cntr_carton: 0 }]);
                })
                .catch((error) => {
                    setData([{ cntr_carton: 0 }]);
                    console.error(error);
                });
        };
        const fetchData1 = () => {
            axios.get('http://10.37.12.34:3000/packing_l2')
                .then((response) => {
                    setData1(response.data.length > 0 ? response.data : [{ cntr_carton: 0 }]);
                })
                .catch((error) => {
                    setData1([{ cntr_carton: 0 }]);
                    console.error(error);
                });
        };
        fetchData();
        fetchData1();

        const interval = setInterval(() => {
            fetchData();
            fetchData1();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setLoading(false);
        const packingl1_hourly_shift = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            let apiURL = '';
            if ((hours === 6 && minutes >= 46) || ((hours > 6 && hours < 14) || (hours === 14 && minutes <= 45))) {
                apiURL = urlapi.packingl1_shift1;
            } else if ((hours === 14 && minutes >= 46) || ((hours > 14 && hours < 22) || (hours === 22 && minutes <= 45))) {
                apiURL = urlapi.packingl1_shift2;
            } else {
                apiURL = urlapi.packingl1_shift3;
            }

            axios.get(apiURL)
                .then(response => {
                    let datalasts = response.data;
                    let counts = [];
                    for (let index = 0; index < datalasts.length; index++) {
                        if (index === 0) {
                            counts.push(datalasts[index].cntr_carton);
                        } else {
                            counts.push(datalasts[index].cntr_carton - datalasts[index - 1].cntr_carton);
                        }
                    }
                    setJamPackingl1_shift(counts);
                })
                .catch(error => {
                    console.log(error);
                });
        };

        const packingl2_hourly_shift = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            let apiURL = '';
            if ((hours === 6 && minutes >= 46) || ((hours > 6 && hours < 14) || (hours === 14 && minutes <= 45))) {
                apiURL = urlapi.packingl2_shift1;
            } else if ((hours === 14 && minutes >= 46) || ((hours > 14 && hours <= 22) || (hours === 22 && minutes <= 45))) {
                apiURL = urlapi.packingl2_shift2;
            } else {
                apiURL = urlapi.packingl2_shift3;
            }

            axios.get(apiURL)
                .then(response => {
                    let datalasts = response.data;
                    let counts = [];
                    for (let index = 0; index < datalasts.length; index++) {
                        if (index === 0) {
                            counts.push(datalasts[index].cntr_carton);
                        } else {
                            counts.push(datalasts[index].cntr_carton - datalasts[index - 1].cntr_carton);
                        }
                    }
                    setJamPackingl2_shift(counts);
                })
                .catch(error => {
                    console.log(error);
                });
        };

        const shift1Packingl1 = () => {
            axios.get(urlapi.packingl1_shift)
                .then(response => {
                    const dataolah = response.data[0] ? response.data[0] : { shift1: 0, shift2: 0, shift3: 0 };
                    setShiftPackingl1(dataolah);
                })
                .catch(error => {
                    setShiftPackingl1({ shift1: 0, shift2: 0, shift3: 0 });
                    console.log(error);
                });
        };

        const shift1Packingl2 = () => {
            axios.get(urlapi.packingl2_shift)
                .then(response => {
                    const dataolah = response.data[0] ? response.data[0] : { shift1: 0, shift2: 0, shift3: 0 };
                    setShiftPackingl2(dataolah);
                })
                .catch(error => {
                    setShiftPackingl2({ shift1: 0, shift2: 0, shift3: 0 });
                    console.log(error);
                });
        };

        packingl1_hourly_shift();
        packingl2_hourly_shift();
        shift1Packingl1();
        shift1Packingl2();

        const interval = setInterval(() => {
            packingl1_hourly_shift();
            packingl2_hourly_shift();
            shift1Packingl1();
            shift1Packingl2();
        }, 3000);
        return () => clearInterval(interval);
    }, [urlapi]);

    return (
        <div>
            <div className="mb-5 flex items-center justify-center flex-wrap xl:flex-nowrap">
                <div className="lg:max-w-[50%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="p-5 bg-red-600 flex  items-center">
                        <h1 className="text-white  text-5xl 2xl:text-[65px] font-black dark:text-white-light">LINE 1</h1>
                        <IconArrowLeft className='h-[100px] w-[100px] text-white' />
                        <span className='text-white  text-5xl 2xl:text-[65px] font-black'>1,008 CARTON</span>
                        <button onClick={handlefullscrean} className="items-center rounded-lg p-2 ml-auto">
                            <img src={mayoraimg} alt="" className='h-[50px]  md:h-[70px] lg:h-[100px]' />
                        </button>
                    </div>
                    <div className="py-7 px-6">
                        <div className="flex flex-row items-center mb-2">
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col items-center mr-2">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">ACTUAL</h4>
                                <div className="flex flex-col items-center justify-center h-full">
                                    {/* Data Carton */}
                                    {packing_l1.map(item => (
                                        <span className="text-red-600 text-[70px] xl:text-[170px] font-black text-center mt-[100px]">{item.cntr_carton}</span>
                                    ))}
                                    {/* Label Carton */}
                                    <h4 className="text-black text-5xl text-center dark:text-white font-extrabold mt-[150px]">CARTON</h4>
                                </div>
                            </div>
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex  justify-center">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">JAM </h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {JamPackingl1_shift.length > 0 ? (
                                            JamPackingl1_shift.map((item, index) => (
                                                <tr key={index}>
                                                    <td
                                                        className={`border border-red-500 px-2 py-2 text-black font-extrabold w-1/5 ${JamPackingl1_shift.length > 4 ? 'text-5xl' : 'text-8xl'
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </td>
                                                    <td
                                                        className={`border border-red-500 px-2 py-2 text-black font-extrabold w-3/5 ${JamPackingl1_shift.length > 4 ? 'text-5xl' : 'text-8xl'
                                                            }`}
                                                    >
                                                        {item}
                                                    </td>
                                                </tr>
                                            ))) : (<tr>
                                                <td className="border border-red-500 px-2 py-2 text-black text-9xl font-extrabold w-1/5">1</td>
                                                <td className="border border-red-500 px-2 py-2 text-black text-9xl font-extrabold w-3/5">0</td>
                                            </tr>)}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center mb-2">
                            <div className="w-[100%] md:w-[50%] h-[300px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col justify-center mb-2 md:mb-0 md:mr-2">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">Achive</h4>
                                <div className="flex flex-col items-center justify-center h-full">
                                    {/* Data Carton */}
                                    <span className="text-red-600 text-[70px] xl:text-[130px] font-black text-center ">{Math.trunc(packingAchive_l1)}%</span>
                                </div>
                            </div>
                            <div className="w-[100%] md:w-[50%] h-[300px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">SHIFT </h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">1</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{ShiftPackingl1.shift1}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">2</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{ShiftPackingl1.shift2}</td>
                                        </tr>     <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">3</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{ShiftPackingl1.shift3}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:max-w-[50%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="p-5 bg-red-600 flex  items-center">
                        <h1 className="text-white  text-5xl 2xl:text-[65px] font-black dark:text-white-light">LINE 2</h1>
                        <IconArrowLeft className='h-[100px] w-[100px] text-white' />
                        <span className='text-white  text-5xl 2xl:text-[65px] font-black'>1,344 CARTON</span>
                        <button onClick={handlefullscrean} className="items-center rounded-lg p-2 ml-auto">
                            <img src={mayoraimg} alt="" className='h-[50px]  md:h-[70px] lg:h-[100px]' />
                        </button>
                    </div>
                    <div className="py-7 px-6">
                        <div className="flex flex-row items-center mb-2">
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col items-center mr-2">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">ACTUAL</h4>
                                <div className="flex flex-col items-center justify-center h-full">
                                    {/* Data Carton */}
                                    {packing_l2.map(item => (
                                        <span className="text-red-600 text-[70px] xl:text-[170px] font-black text-center mt-[100px]">{item.cntr_carton}</span>
                                    ))}
                                    {/* Label Carton */}
                                    <h4 className="text-black text-5xl text-center dark:text-white font-extrabold mt-[150px]">CARTON</h4>
                                </div>
                            </div>
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex  justify-center">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">JAM </h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {JamPackingl2_shift.length > 0 ? (
                                            JamPackingl2_shift.map((item, index) => (
                                                <tr key={index}>
                                                    <td
                                                        className={`border border-red-500 px-2 py-2 text-black font-extrabold w-1/5 ${JamPackingl2_shift.length > 4 ? 'text-5xl' : 'text-8xl'
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </td>
                                                    <td
                                                        className={`border border-red-500 px-2 py-2 text-black font-extrabold w-3/5 ${JamPackingl2_shift.length > 4 ? 'text-5xl' : 'text-8xl'
                                                            }`}
                                                    >
                                                        {item}
                                                    </td>
                                                </tr>
                                            ))) : (<tr>
                                                <td className="border border-red-500 px-2 py-2 text-black text-9xl font-extrabold w-1/5">1</td>
                                                <td className="border border-red-500 px-2 py-2 text-black text-9xl font-extrabold w-3/5">0</td>
                                            </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center mb-2">
                            <div className="w-[100%] md:w-[50%] h-[300px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col justify-center mb-2 md:mb-0 md:mr-2">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">Achive</h4>
                                <div className="flex flex-col items-center justify-center h-full">
                                    {/* Data Carton */}
                                    <span className="text-red-600 text-[70px] xl:text-[130px] font-black text-center ">{Math.trunc(packingAchive_l2)}%</span>
                                </div>
                            </div>
                            <div className="w-[100%] md:w-[50%] h-[300px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">SHIFT </h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">1</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{ShiftPackingl2.shift1}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">2</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{ShiftPackingl2.shift2}</td>
                                        </tr>     <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">3</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{ShiftPackingl2.shift3}</td>
                                        </tr>
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

export default Index_2;
