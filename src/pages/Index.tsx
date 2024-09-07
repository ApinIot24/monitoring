import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import PngArrowLeft from '../components/Icon/arrowright.png';

const Index = () => {
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [error, setError] = useState(null);
    const planning1 = 1008;
    const planning2 = 1344;
    const actual = 90;
    const efficiency = (actual / planning1) * 100;

    useEffect(() => {
        // Fungsi untuk mengambil data dari server
        const fetchData = () => {
            axios.get('')
                .then((response) => {
                    setData(response.data);  // Simpan data di state
                })
                .catch((error) => {
                    //   setError('EROR');
                    console.error(error);
                });
        };
        const fetchData1 = () => {
            axios.get('')
                .then((response) => {
                    setData1(response.data);  // Simpan data di state
                })
                .catch((error) => {
                    //   setError('EROR');
                    console.error(error);
                });
        };
        const interval = setInterval(() => {
            fetchData();
            fetchData1();
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div>
            <div className="mb-5 flex items-center justify-center">
                <div className="max-w-[50%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="p-5 bg-red-600 flex  items-center">
                        <h1 className="text-white text-6xl font-black dark:text-white-light">LINE 1
                        </h1>
                        <IconArrowLeft className='h-[100px] w-[100px] text-white' />
                        <span className='text-white text-6xl font-black'>1,008 CARTON</span>
                    </div>
                    <div className="py-7 px-6">
                        <div className="flex flex-row items-center mb-2">
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col items-center mr-2">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">ACTUAL</h4>

                                <div className="flex flex-col items-center justify-center h-full">
                                    {/* Data Carton */}
                                    {data.map(item => (
                                    <span className="text-red-600 text-9xl font-extrabold text-center mb-4">{item.counter_carton}</span>
                                    ))}
                                    {/* Label Carton */}
                                    <h4 className="text-black text-5xl text-center dark:text-white font-extrabold mt-[70px]">CARTON</h4>
                                </div>
                            </div>
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex  justify-center">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">JAM KE</h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-2 text-black text-2xl font-extrabold w-2/5">1</td>
                                            <td className="border border-red-500 px-2 py-2 text-black text-2xl font-extrabold w-3/5">10</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">2</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">20</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">3</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">30</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">4</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">40</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">5</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">50</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">6</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">60</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">7</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">70</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">8</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">80</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mb-2">
                            <div className="w-[100%] h-[300px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">SHIFT KE</h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">1</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">10</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">2</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">20</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">3</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">30</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-[50%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="p-5 bg-red-600 flex  items-center">
                        <h1 className="text-white text-6xl font-black dark:text-white-light">LINE 2
                        </h1>
                        <IconArrowLeft className='h-[100px] w-[100px] text-white' />
                        <span className='text-white text-6xl font-black'>1,344 CARTON</span>
                    </div>
                    <div className="py-7 px-6">
                        <div className="flex flex-row items-center mb-2">
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col items-center mr-2">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">ACTUAL</h4>
                                <div className="flex flex-col items-center justify-center h-full">
                                    {/* Data Carton */}
                                    {data1.map(item => (
                                    <span className="text-red-600 text-9xl font-extrabold text-center mb-4">{item.counter_carton}</span>
                                    ))}
                                    {/* Label Carton */}
                                    <h4 className="text-black text-5xl text-center dark:text-white font-extrabold  mt-[70px]">CARTON</h4>
                                </div>
                            </div>
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex  justify-center">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">JAM KE</h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-2 text-black text-2xl font-extrabold w-2/5">1</td>
                                            <td className="border border-red-500 px-2 py-2 text-black text-2xl font-extrabold w-3/5">10</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">2</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">20</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">3</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">30</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">4</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">40</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">5</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">50</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">6</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">60</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">7</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">70</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">8</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-2xl font-extrabold">80</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mb-2">
                            <div className="w-[100%] h-[300px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">SHIFT KE</h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-4xl dark:text-white font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">1</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">10</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">2</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">20</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">3</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-4xl font-extrabold">30</td>
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

export default Index;
