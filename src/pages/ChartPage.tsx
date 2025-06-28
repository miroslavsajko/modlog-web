import {
    Accordion, AccordionDetails, AccordionSummary,
    Checkbox, CircularProgress,
    FormControl, FormControlLabel, FormGroup,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography, useMediaQuery,
} from '@mui/material';
import {useCallback, useEffect, useMemo, useState} from 'react';
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
import {Props} from "recharts/types/component/Label";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    ActionGroup, getActionGroupLabel,
    getModActionGroups,
    getModActionChartColor,
    getModActionLabel,
    getModActions, getModActionsForGroup
} from "../types/translations.ts";

export default function ChartPage() {
    const [barData, setBarData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [period, setPeriod] = useState<string>('7d')
    const isTablet = useMediaQuery('(max-width:800px)');
    const [selectedModActionFilters, setSelectedModActionFilters] = useState<Record<string, boolean>>(
        Object.fromEntries(getModActions().map((modAction) => [modAction, true]))
    );

    const handleChange = (key: string) => {
        setSelectedModActionFilters((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const totalPerMod = useMemo(() => {
        return barData
            .map((data) => {
                return {
                    mod: data.mod,
                    total: Object.entries(data).reduce((previousValue, currentValue) => {
                        if (!selectedModActionFilters[currentValue[0]]) {
                            // if filtered out, do not count it
                            return previousValue
                        }
                        const numericalCurrentValue = Number(currentValue[1]);
                        return previousValue + (isNaN(numericalCurrentValue) ? 0 : numericalCurrentValue)
                    }, 0)
                }
            }).sort((a, b) => {
                if (a.total < b.total) return 1
                if (a.total > b.total) return -1
                return 0
            })
    }, [barData, selectedModActionFilters]);

    const calcMaxDomain = useMemo(() => {
        if (totalPerMod.length === 0) {
            return 0
        }
        const maxTotal = totalPerMod[0].total;
        if (maxTotal < 200) {
            return Math.ceil((maxTotal) / 20) * 20
        }
        return Math.ceil((maxTotal) / 200) * 200
    }, [totalPerMod]);

    // Custom label renderer
    const dynamicPositionLabel = useCallback((props: Props) => {
        const x = Number(props.x)
        const y = Number(props.y)
        const width = Number(props.width)
        const height = Number(props.height)
        const total = totalPerMod.find((val) => val.mod === props.value)?.total ?? 0;
        const percent = total / calcMaxDomain;

        const isLarge = percent > 0.75;

        return (
            <text
                x={isLarge ? x + width - 5 : x + width + 5}
                y={y + height / 2}
                textAnchor={isLarge ? 'end' : 'start'}
                dominantBaseline="middle"
                fill={isLarge ? '#fff' : '#000'}
                fontSize={isTablet ? '0.8rem ' : '1rem'}
                style={{fill: 'white'}}
            >
                {props.value}
            </text>
        );
    }, [calcMaxDomain, isTablet, totalPerMod]);

    useEffect(() => {
        setLoading(true)
        fetchChartData(period)
            .then((data) => {
                setBarData(data)
                setLoading(false)
            });
    }, [period]);

    const bars = useMemo(() => {
        const actionNames = new Set<string>();
        barData.forEach(data => {
            Object.keys(data).forEach(dataKey => actionNames.add(dataKey))
        })
        actionNames.delete('mod')

        return Array.from(actionNames.values()).sort((a, b) => -a.localeCompare(b))
            .filter(modAction => selectedModActionFilters[modAction])
            .map((modAction, index, arr) => (
                <Bar key={'bar' + index} dataKey={modAction} name={getModActionLabel(modAction)} stackId="a"
                     fill={getModActionChartColor(modAction)}>
                    {index === arr.length - 1 ?
                        <LabelList dataKey="mod" content={dynamicPositionLabel}/> : <></>}
                </Bar>)
            )
    }, [barData, dynamicPositionLabel, selectedModActionFilters]);

    const handleActionChange = (event: SelectChangeEvent) => {
        setPeriod(event.target.value);
    };

    return (
        <>
            <FormControl sx={{minWidth: 200}}>
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

            <Typography variant="h6" sx={{mt: 2, mb: 2}}>
                Actions Per Moderator
            </Typography>
            {loading ? <CircularProgress/> :
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart layout="vertical" data={barData}>
                        <XAxis type="number"/>
                        <YAxis dataKey="mod" type="category" width={0}/>
                        <Tooltip
                            labelStyle={{color: 'black', textDecoration: 'underline'}}
                        />
                        {bars}
                    </BarChart>
                </ResponsiveContainer>
            }
            <Typography variant="h6" sx={{mt: 2, mb: 2}}>
                Filter by Mod Action
            </Typography>
            <FormGroup>
                {getModActionGroups().map((category: ActionGroup) => {
                    const modActionsForGroup = getModActionsForGroup(category);
                    if (modActionsForGroup.length === 0) return <></>

                    return <Accordion key={'accordion-' + category}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls={category + "-content"}
                            id={category + "-header"}
                        >
                            <Typography component="span">{getActionGroupLabel(category)}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                            display: 'flex',
                            flexDirection: isTablet ? 'column' : 'row',
                            overflowX: 'auto',
                            p: 2,
                            whiteSpace: 'nowrap',
                        }}>
                            {modActionsForGroup.map((modAction) => {
                                const color = getModActionChartColor(modAction)
                                return (
                                    <FormControlLabel
                                        key={modAction}
                                        control={
                                            <Checkbox
                                                checked={selectedModActionFilters[modAction]}
                                                onChange={() => handleChange(modAction)}
                                                sx={{color, '&.Mui-checked': {color}}}
                                            />
                                        }
                                        label={getModActionLabel(modAction)}
                                        sx={{flex: '0 0 auto'}} // prevent shrinking
                                    />
                                )
                            })}
                        </AccordionDetails>
                    </Accordion>
                })}
            </FormGroup>
        </>
    );
}
