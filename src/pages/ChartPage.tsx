import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography, useMediaQuery,
} from '@mui/material';
import {useEffect, useMemo, useState} from 'react';
import {
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer, LabelList,
} from 'recharts';
import {fetchChartData} from "../api/api.ts";
import {ChartData} from "../types/interfaces.ts";
import {modActionColors, modActions} from "../types/translations.ts";

export default function ChartPage() {
    const [barData, setBarData] = useState<ChartData[]>([]);
    const [period, setPeriod] = useState<string>('7d')
    const isTablet = useMediaQuery('(max-width:800px)');

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

        return Array.from(actionNames.values()).sort((a, b) => -a.localeCompare(b))
            .map((value, index, arr) =>
                (<Bar key={'bar' + index} dataKey={value} name={modActions[value]} stackId="a"
                      fill={modActionColors[value]}>
                    {index === arr.length - 1 ?
                        <LabelList dataKey="mod" position={"right"} fontSize={isTablet ? '0.8rem ' : '1rem'}
                                   style={{fill: "white"}}/> : <></>}
                </Bar>)
            )
    }, [barData, isTablet]);

    const handleActionChange = (event: SelectChangeEvent) => {
        setPeriod(event.target.value);
    };

    return (
        <>
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
                <BarChart layout="vertical" data={barData}>
                    <XAxis type="number"
                           domain={[() => 0, (dataMax: number) => Math.ceil((dataMax * 1.25) / 200) * 200]}/>
                    <YAxis dataKey="mod" type="category" width={0}/>
                    <Tooltip
                        labelStyle={{color: 'black', textDecoration: 'underline'}}
                    />
                    {bars}
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
