import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import {useEffect, useMemo, useState} from 'react';
import {
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {fetchChartData} from "../api/api.ts";
import {ChartData} from "../types/interfaces.ts";
import {modActionColors, modActions} from "../types/translations.ts";

export default function ChartPage() {
    const [barData, setBarData] = useState<ChartData[]>([]);
    const [period, setPeriod] = useState<string>('7d')

    useEffect(() => {
        fetchChartData(period)
            .then((data) => {
                setBarData(data)
            });
    }, [period]);

    const bars = useMemo(() => {
        const actionNames = new Set<string>();
        barData.forEach(data => {
            Object.keys(data).forEach(dataKey => actionNames.add(dataKey))
        })
        actionNames.delete('mod')

        console.info('number of actions: ' + actionNames.size)

        return Array.from(actionNames.values()).sort((a, b) => -a.localeCompare(b))
            .map((value, index) =>
                (<Bar key={'bar'+index} dataKey={value} name={modActions[value]} stackId="a" fill={modActionColors[value]}/>)
            )
    }, [barData]);

    const handleActionChange = (event: SelectChangeEvent) => {
        setPeriod(event.target.value);
    };

    return (
        <Box sx={{p: 2}}>
            <FormControl sx={{mb: 4, minWidth: 200}}>
                <InputLabel id="action-select-label">Timeframe</InputLabel>
                <Select
                    labelId="action-select-label"
                    value={period}
                    label="Action"
                    onChange={handleActionChange}
                >
                    <MenuItem value="7d">7 days</MenuItem>
                    <MenuItem value="1m">1 month</MenuItem>
                    <MenuItem value="3m">3 months</MenuItem>
                    <MenuItem value="6m">6 months</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="subtitle1" sx={{mt: 4, mb: 1}}>
                Total Actions Per Moderator
            </Typography>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart data={barData}>
                    <CartesianGrid/>
                    <XAxis dataKey="mod"/>
                    <YAxis domain={[0, 'auto']} allowDataOverflow={false}/>
                    <Tooltip
                         labelStyle={{color: 'black', textDecoration: 'underline'}}
                    />
                    {bars}
                </BarChart>
            </ResponsiveContainer>

        </Box>
    );
}
