import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import AlertWindow from '../../components/alert';

import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

const PopDensity = ({ data }) => {
    const [alert, setAlert] = useState(false);
    const [chart, setChart] = useState({
        chartdata: {
            labels: ['5 km', '10 km', '30 km', '100 km'],
            datasets: [
                {
                    label: 'Population Density',
                    data: [0, 0, 0, 0],
                    borderColor: 'rgba(185, 28, 2, 1)',
                    fill: false,
                },
            ],
        },
        chartconfig: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Population Density"
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: true,
                },
                y: {
                    display: true,
                    type: 'logarithmic',
                }
            }
        }
    });
    const [forceUpdate, setForceUpdate] = useState(0);

    useEffect(() => { onload(); }, []);
    function onload() {
        var Data = data;
        var keys = ['population_5km', 'population_10km', 'population_30km', 'population_100km'];
        var population_density = [];
        for (const key of keys) {
            population_density.push(Data[key]);
        }

        if (Data['population_5km'] === undefined) {
            setAlert({ title: '', content: (<>Failed to fetch population data.<br></br>Not logged in. Go to <Link to="/profile" className="text-red-600">Login</Link></>) });
            return;
        }
        else {
            let newChart = chart;
            newChart['chartdata']['datasets'][0]['data'] = population_density;
            setChart(newChart);
            setForceUpdate(forceUpdate + 1);
        }
    }

    return (
        <>
            {alert ?
                <AlertWindow title={alert.title} content={alert.content} />
                :
                <div className="flex flex-col justify-center w-full h-full">
                        <div className="chart-container">
                            <Line
                                data={chart.chartdata}
                                options={chart.chartconfig}
                                key={forceUpdate}
                            />
                    </div>
                </div>
            }
        </>
    )
}

export default PopDensity;


