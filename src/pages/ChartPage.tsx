import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';

const data = [
    {name: 'Page A', value: 400},
    {name: 'Page B', value: 300},
    {name: 'Page C', value: 200},
];

export default function ChartPage() {
    return (
        <div style={{width: '100%', height: 400, padding: 20}}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="value" fill="#1976d2"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
