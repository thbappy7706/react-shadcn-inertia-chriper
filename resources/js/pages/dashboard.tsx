import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
    // also import area or others if you want
} from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

type Weather = {
    current_weather?: {
        temperature: number;
        windspeed: number;
        time: string;
        // etc
    };
    hourly?: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
    };
};

type Props = {
    stats: {
        users: number;
        payments: number;
        subscriptions: number;
        revenue: number;
    };
    chartData: {
        monthly: { labels: string[]; values: number[] };
        revenue: { labels: string[]; values: number[] };
        usersByRegion: { name: string; value: number }[];
    };
    weather: Weather | null;
};

export default function Dashboard({ stats, chartData, weather }: Props) {
    // Prepare existing charts (monthly, revenue, usersByRegion) as before...

    const monthlyData = chartData.monthly.labels.map((lbl, i) => ({
        name: lbl,
        value: chartData.monthly.values[i],
    }));
    const revenueData = chartData.revenue.labels.map((lbl, i) => ({
        name: lbl,
        value: chartData.revenue.values[i],
    }));
    const usersByRegionData = chartData.usersByRegion;

    // Prepare weather chart data (if available)
    let tempHourly: { time: string; temperature: number }[] = [];
    let humidityHourly: { time: string; humidity: number }[] = [];

    if (weather && weather.hourly) {
        tempHourly = weather.hourly.time.map((t, i) => ({
            time: t,
            temperature: weather.hourly!.temperature_2m[i],
        }));
        humidityHourly = weather.hourly.time.map((t, i) => ({
            time: t,
            humidity: weather.hourly!.relative_humidity_2m[i],
        }));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Stat cards, same as before */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold">Users</h2>
                            <p className="text-3xl mt-2">{stats.users}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold">Payments</h2>
                            <p className="text-3xl mt-2">{stats.payments}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold">Subscriptions</h2>
                            <p className="text-3xl mt-2">{stats.subscriptions}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold">Revenue</h2>
                            <p className="text-3xl mt-2">${stats.revenue}</p>
                        </CardContent>
                    </Card>
                </div>

                {/*<div className="grid gap-4 md:grid-cols-2">*/}
                {/*    /!* Monthly Bar Chart *!/*/}
                {/*    <Card className="min-h-[300px]">*/}
                {/*        <CardContent className="p-6">*/}
                {/*            <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>*/}
                {/*            <ResponsiveContainer width="100%" height={250}>*/}
                {/*                <BarChart data={monthlyData}>*/}
                {/*                    <XAxis dataKey="name" />*/}
                {/*                    <YAxis />*/}
                {/*                    <Tooltip />*/}
                {/*                    <Bar dataKey="value" fill="#4f46e5" />*/}
                {/*                </BarChart>*/}
                {/*            </ResponsiveContainer>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}

                {/*    /!* Revenue Growth Line Chart *!/*/}
                {/*    <Card className="min-h-[300px]">*/}
                {/*        <CardContent className="p-6">*/}
                {/*            <h2 className="text-lg font-semibold mb-4">Revenue Growth</h2>*/}
                {/*            <ResponsiveContainer width="100%" height={250}>*/}
                {/*                <LineChart data={revenueData}>*/}
                {/*                    <XAxis dataKey="name" />*/}
                {/*                    <YAxis />*/}
                {/*                    <Tooltip />*/}
                {/*                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />*/}
                {/*                </LineChart>*/}
                {/*            </ResponsiveContainer>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}

                {/*    /!* Temperature over time (hourly) *!/*/}
                {/*    {tempHourly.length > 0 && (*/}
                {/*        <Card className="min-h-[300px]">*/}
                {/*            <CardContent className="p-6">*/}
                {/*                <h2 className="text-lg font-semibold mb-4">Hourly Temperature</h2>*/}
                {/*                <ResponsiveContainer width="100%" height={250}>*/}
                {/*                    <LineChart data={tempHourly}>*/}
                {/*                        <XAxis dataKey="time" tickFormatter={(t) => t.slice(11, 16)} />*/}
                {/*                        <YAxis />*/}
                {/*                        <Tooltip labelFormatter={(t) => t} />*/}
                {/*                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" />*/}
                {/*                    </LineChart>*/}
                {/*                </ResponsiveContainer>*/}
                {/*            </CardContent>*/}
                {/*        </Card>*/}
                {/*    )}*/}

                {/*    /!* Humidity over time *!/*/}
                {/*    {humidityHourly.length > 0 && (*/}
                {/*        <Card className="min-h-[300px]">*/}
                {/*            <CardContent className="p-6">*/}
                {/*                <h2 className="text-lg font-semibold mb-4">Hourly Humidity</h2>*/}
                {/*                <ResponsiveContainer width="100%" height={250}>*/}
                {/*                    <LineChart data={humidityHourly}>*/}
                {/*                        <XAxis dataKey="time" tickFormatter={(t) => t.slice(11, 16)} />*/}
                {/*                        <YAxis />*/}
                {/*                        <Tooltip labelFormatter={(t) => t} />*/}
                {/*                        <Line type="monotone" dataKey="humidity" stroke="#3b82f6" />*/}
                {/*                    </LineChart>*/}
                {/*                </ResponsiveContainer>*/}
                {/*            </CardContent>*/}
                {/*        </Card>*/}
                {/*    )}*/}
                {/*</div>*/}



                <div className="grid gap-4 md:grid-cols-2">
                    {/* Monthly Bar Chart */}
                    <Card className="min-h-[300px]">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={monthlyData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#4f46e5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Revenue Growth Line Chart */}
                    <Card className="min-h-[300px]">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Revenue Growth</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={revenueData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Hourly Temperature */}
                    {tempHourly.length > 0 && (
                        <Card className="min-h-[300px]">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Hourly Temperature</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={tempHourly}>
                                        <XAxis dataKey="time" tickFormatter={(t) => t.slice(11, 16)} />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Hourly Humidity */}
                    {humidityHourly.length > 0 && (
                        <Card className="min-h-[300px]">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Hourly Humidity</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={humidityHourly}>
                                        <XAxis dataKey="time" tickFormatter={(t) => t.slice(11, 16)} />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="humidity" stroke="#3b82f6" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* ✅ Users by Region Pie Chart (Restored) */}
                    <Card className="min-h-[300px] md:col-span-2">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Users by Region</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={usersByRegionData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={100}
                                        label
                                    >
                                        {usersByRegionData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={['#4f46e5', '#22c55e', '#f59e0b', '#ef4444'][index % 4]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>







                {/* Optionally show current weather summary */}
                {weather && weather.current_weather && (
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold">Current Weather</h2>
                            <p>
                                Temperature: {weather.current_weather.temperature}°C <br />
                                Wind Speed: {weather.current_weather.windspeed} m/s <br />
                                Time: {weather.current_weather.time}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
