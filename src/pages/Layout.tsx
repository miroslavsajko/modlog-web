import {
    AppBar,
    Box, CircularProgress, Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useEffect, useState} from 'react';
import {Link, Outlet, useLocation} from 'react-router-dom';
import {fetchLastUpdateTimestamp} from "../api/api.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";

const drawerWidth = 220;

const navItems = [
    {label: 'Modlog', path: '/'},
    {label: 'Modlog by Posts', path: '/modlog-posts'},
    {label: 'Charts', path: '/charts'},
];

export default function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<string | undefined>(undefined)
    const isMobile = useMediaQuery('(max-width:800px)');

    const location = useLocation();

    useEffect(() => {
        fetchLastUpdateTimestamp()
            .then((data) => {
                setLastUpdate(convertDateTime(data))
            });
    }, []);

    const drawerBody = (
        <List>
            {navItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                    <ListItemButton component={Link} to={item.path} selected={location.pathname === item.path}
                                    onClick={() => setMobileOpen(false)}>
                        <ListItemText primary={item.label}/>
                    </ListItemButton>
                </ListItem>
            ))}
            <Divider variant="middle" component="li"/>
            <ListItem disablePadding sx={{paddingX: "1rem"}}>
                <ListItemText primary="Last data update:"/>
            </ListItem>
            <ListItem disablePadding sx={{paddingX: "1rem"}}>
                {lastUpdate ? <ListItemText secondary={lastUpdate}/>
                    : <CircularProgress/>}
            </ListItem>
        </List>
    );

    return (
        <Box display="flex" flexDirection="column">

            {/*<AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>*/}
            <AppBar component="nav" position="sticky">
                <Toolbar>
                    {isMobile && (
                        <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
                            <MenuIcon/>
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div">
                        /r/Slovakia Modlog
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box display="flex" flexDirection="row">

                {isMobile ?
                    <Drawer
                        variant={isMobile ? 'temporary' : 'permanent'}
                        open={isMobile ? mobileOpen : true}
                        onClose={() => setMobileOpen(false)}
                        ModalProps={{keepMounted: true}}
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                            },
                        }}
                    >
                        {drawerBody}
                    </Drawer> :
                    <Box minWidth={drawerWidth} width={drawerWidth}>
                        {drawerBody}
                    </Box>
                }

                <Box component="main"
                     flexGrow="1"
                     marginY="1rem"
                     marginX="2rem"
                >
                    <Outlet/>
                </Box>
            </Box>

        </Box>
    );
}
