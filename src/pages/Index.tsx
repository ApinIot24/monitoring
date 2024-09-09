import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import mayoraimg from '../../public/favicon.png';
import dayjs from 'dayjs';
import { date } from 'yup';



const Index = () => {
    // const [time_now, SetTime] = useState(new Date().toLocaleTimeString);
    const [packing_l1, setData] = useState([]);
    const [packing_l2, setData1] = useState([]);

    // const [JamPackingl1, setJamPackingl1] = useState([]);
    // const [JamPackingl2, setJamPackingl2] = useState([]);

    const [JamPackingl1_shift, setJamPackingl1_shift] = useState([]);
    const [JamPackingl2_shift, setJamPackingl2_shift] = useState([]);

    const [ShiftPackingl1, setShiftPackingl1] = useState([]);
    const [ShiftPackingl2, setShiftPackingl2] = useState([]);

    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fieldtwo] = useState([
        { field: 'id', headerName: 'No', width: 150 },
        { field: 'hourly', headerName: 'Time', width: 150 },
        { field: 'cntr_bandet', headerName: 'Counter Banded', width: 150 },
        { field: 'cntr_carton', headerName: 'Counter Carton', width: 150 },
        { field: 'tanggal', headerName: 'Date', width: 150 }
    ])
    const today = dayjs().format('YYYY-MM-DD');
    // const today = '2024-09-05';
    const [urlapi] = useState({
        packingl1_shift1: 'http://10.37.12.17:3000/shift1_l1_hourly',
        packingl1_shift2: 'http://10.37.12.17:3000/shift2_l1_hourly',
        packingl1_shift3: 'http://10.37.12.17:3000/shift3_l1_hourly',

        packingl2_shift1: 'http://10.37.12.17:3000/shift1_l2_hourly',
        packingl2_shift2: 'http://10.37.12.17:3000/shift2_l2_hourly',
        packingl2_shift3: 'http://10.37.12.17:3000/shift3_l2_hourly',

        packingl1_all: 'http://10.37.12.17:3000/packing_l1_hourly',
        packingl2_all: 'http://10.37.12.17:3000/packing_l2_hourly',

        packingl1_shift: `http://10.37.12.17:3000/packing_l1_daily/date/${today}`,
        packingl2_shift: `http://10.37.12.17:3000/packing_l2_daily/date/${today}`,
    })
    useEffect(() => {
        // Fungsi untuk mengambil data dari server
        const fetchData = () => {
            axios.get('http://10.37.12.17:3000/packing_l1')
                .then((response) => {
                    setData(response.data);  // Simpan data di state
                })
                .catch((error) => {
                    //   setError('EROR');
                    console.error(error);
                });
        };
        const fetchData1 = () => {
            axios.get('http://10.37.12.17:3000/packing_l2')
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

    useEffect(() => {
        setLoading(false);
       const awal = () => {
        const packingl1_hourly_shift = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            if ((hours === 6 && minutes >= 46) || ((hours > 6 && hours < 14) || hours === 14 && minutes >= 45)) {
                axios.get(urlapi.packingl1_shift1)
                    .then(response => {
                        var datalasts = response.data;
                        let counts = [];
                        if (datalasts.length === 0) {
                            setJamPackingl1_shift([0]);
                        } else {
                            for (let index = 0; index < datalasts.length; index++) {
                                counts.push(datalasts[index].cntr_carton)
                            }
                            setJamPackingl1_shift(counts);
                        }

                        console.log("packing1", counts)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else if ((hours === 14 && minutes >= 46) || ((hours === 14 && hours >= 22) || hours === 22 && minutes >= 45)) {
                axios.get(urlapi.packingl1_shift2)
                    .then(response => {
                        var datalasts = response.data;
                        let counts = [];
                        if (datalasts.length === 0) {
                            setJamPackingl1_shift([0]);
                        } else {
                            for (let index = 0; index < datalasts.length; index++) {
                                counts.push(datalasts[index].cntr_carton)
                            }
                            setJamPackingl1_shift(counts);
                        }

                        console.log("packing1", counts)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                axios.get(urlapi.packingl1_shift3)
                    .then(response => {
                        var datalasts = response.data;
                        let counts = [];
                        if (datalasts.length === 0) {
                            setJamPackingl1_shift([0]);
                        } else {
                            for (let index = 0; index < datalasts.length; index++) {
                                counts.push(datalasts[index].cntr_carton)
                            }
                            setJamPackingl1_shift(counts);
                        }

                        console.log("packing1", counts)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

        }
        const packingl2_hourly_shift = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            if ((hours === 6 && minutes >= 46) || ((hours > 6 && hours < 14) || hours === 14 && minutes >= 45)) {
                axios.get(urlapi.packingl2_shift1)
                    .then(response => {
                        var datalasts = response.data;
                        let counts = [];
                        if (datalasts.length === 0) {
                            setJamPackingl2_shift([0]);
                        } else {
                            for (let index = 0; index < datalasts.length; index++) {
                                counts.push(datalasts[index].cntr_carton)
                            }
                            setJamPackingl2_shift(counts);
                        }

                        console.log("packing2", counts)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else if ((hours === 14 && minutes >= 46) || ((hours === 14 && hours >= 22) || hours === 22 && minutes >= 45)) {
                axios.get(urlapi.packingl2_shift2)
                    .then(response => {
                        var datalasts = response.data;
                        let counts = [];
                        if (datalasts.length === 0) {
                            setJamPackingl2_shift([0]);
                        } else {
                            for (let index = 0; index < datalasts.length; index++) {
                                counts.push(datalasts[index].cntr_carton)
                            }
                            setJamPackingl2_shift(counts);
                        }

                        console.log("packing2", counts)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                axios.get(urlapi.packingl2_shift3)
                    .then(response => {
                        var datalasts = response.data;
                        let counts = [];
                        if (datalasts.length === 0) {
                            setJamPackingl2_shift([0]);
                        } else {
                            for (let index = 0; index < datalasts.length; index++) {
                                counts.push(datalasts[index].cntr_carton)
                            }
                            setJamPackingl2_shift(counts);
                        }

                        console.log("packing2", counts)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

        }
        const shiftPackingl1 = () => {
            axios.get(urlapi.packingl1_shift)
                .then(response => {
                    var dataolah = response.data;
                    let shifts1 = [];
                    for (let i = 0; i < dataolah.length; i++) {
                        shifts1[i] = {};
                        shifts1[i].id = i + 1
                        shifts1[i].cntr_bandet = dataolah[i].cntr_bandet
                        shifts1[i].cntr_carton = dataolah[i].cntr_carton
                    }
                    console.log('shitf', shifts1);
                    setShiftPackingl1(shifts1)
                })
                .catch(error => {
                    console.log(error);
                });
        }
        const shiftPackingl2 = () => {
            axios.get(urlapi.packingl2_shift)
                .then(response => {
                    var dataolah = response.data;
                    let shifts2 = [];
                    for (let i = 0; i < dataolah.length; i++) {
                        shifts2[i] = {};
                        shifts2[i].id = i + 1
                        shifts2[i].cntr_bandet = dataolah[i].cntr_bandet
                        shifts2[i].cntr_carton = dataolah[i].cntr_carton
                    }
                    console.log('shitf', shifts2);
                    setShiftPackingl2(shifts2)
                })
                .catch(error => {
                    console.log(error);
                });
        }
        packingl1_hourly_shift();
        packingl2_hourly_shift();
        shiftPackingl1();
        shiftPackingl2();
       } 
       awal();
        const interval = setInterval(() => {
            awal();
        }, 1800000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="mb-5 flex items-center justify-center">
                <div className="max-w-[50%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="p-5 bg-red-600 flex  items-center">
                        <h1 className="text-white text-[65px] font-black dark:text-white-light">LINE 1</h1>
                        <IconArrowLeft className='h-[100px] w-[100px] text-white' />
                        <span className='text-white text-[65px] font-black'>1,008 CARTON</span>
                        <div className="bg-white items-center rounded-lg p-2 ml-auto">
                            <img src={mayoraimg} alt="" className='h-[100px]' />
                        </div>
                    </div>
                    <div className="py-7 px-6">
                        <div className="flex flex-row items-center mb-2">
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col items-center mr-2">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">ACTUAL</h4>
                                <div className="flex flex-col items-center justify-center h-full">
                                    {/* Data Carton */}
                                    {packing_l1.map(item => (
                                        <span className="text-red-600 text-[170px] font-black text-center mt-[100px]">{item.cntr_carton}</span>
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
                                                <h4 className="text-white text-2xl font-extrabold">JAM KE</h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {JamPackingl1_shift.map((item, index) => (
                                            <tr>
                                                <td className="border border-red-500 px-2 py-2 text-black text-5xl font-extrabold w-1/5">{index + 1}</td>
                                                <td className="border border-red-500 px-2 py-2 text-black text-5xl font-extrabold w-3/5">{item}</td>
                                            </tr>
                                        ))}
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
                                        {ShiftPackingl1.length > 0 ? (
                                            ShiftPackingl1.map((item, index) => (
                                                <tr>
                                                    <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{index + 1}</td>
                                                    <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{item.cntr_carton}</td>
                                                </tr>
                                            ))
                                        )
                                            : (<tr>
                                                <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">1</td>
                                                <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">0</td>
                                            </tr>)}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-[50%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="p-5 bg-red-600 flex  items-center">
                        <h1 className="text-white text-[65px] font-black dark:text-white-light">LINE 2</h1>
                        <IconArrowLeft className='h-[100px] w-[100px] text-white' />
                        <span className='text-white text-[65px] font-black'>1,344 CARTON</span>
                        <div className="bg-white items-center rounded-lg p-2 ml-auto">
                            <img src={mayoraimg} alt="" className='h-[100px]' />
                        </div>
                    </div>
                    <div className="py-7 px-6">
                        <div className="flex flex-row items-center mb-2">
                            <div className="w-[50%] h-[500px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex flex-col items-center mr-2">
                                <h4 className="text-black text-5xl mt-4 text-center dark:text-white font-black font-extrabold mb-2">ACTUAL</h4>
                                <div className="flex flex-col items-center justify-center h-full">
                                    {/* Data Carton */}
                                    {packing_l2.map(item => (
                                        <span className="text-red-600 text-[170px] font-black text-center mt-[100px]">{item.cntr_carton}</span>
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
                                                <h4 className="text-white text-2xl font-extrabold">JAM KE</h4>
                                            </th>
                                            <th className="border border-red-500 px-4 py-2">
                                                <h4 className="text-white text-2xl font-extrabold">CARTON</h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {JamPackingl2_shift.map((item, index) => (
                                            <tr>
                                                <td className="border border-red-500 px-2 py-2 text-black text-5xl font-extrabold w-1/5">{index + 1}</td>
                                                <td className="border border-red-500 px-2 py-2 text-black text-5xl font-extrabold w-3/5">{item}</td>
                                            </tr>
                                        ))}
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
                                        {ShiftPackingl2.length > 0 ? (
                                            ShiftPackingl2.map((item, index) => (
                                                <tr>
                                                    <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{index + 1}</td>
                                                    <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">{item.cntr_carton}</td>
                                                </tr>
                                            ))
                                        )
                                            : (<tr>
                                                <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">1</td>
                                                <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">0</td>
                                            </tr>)}

                                        {/* <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">2</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">0</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">3</td>
                                            <td className="border border-red-500 px-2 py-1 text-black text-7xl font-extrabold">0</td>
                                        </tr> */}
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
