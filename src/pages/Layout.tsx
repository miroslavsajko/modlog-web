import {
    AppBar,
    Box,
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
import {useState} from 'react';
import {Link, Outlet, useLocation} from 'react-router-dom';

const drawerWidth = 220;

const navItems = [
    {label: 'Modlog', path: '/'},
    {label: 'Modlog by Posts', path: '/modlog-posts'},
    {label: 'Charts', path: '/charts'},
];

export default function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:800px)');

    const location = useLocation();

    const drawer = (
        <div>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={Link} to={item.path} selected={location.pathname === item.path}
                                        onClick={() => setMobileOpen(false)}>
                            <ListItemText primary={item.label}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
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
                        {drawer}
                    </Drawer> :
                    <Box minWidth={drawerWidth} width={drawerWidth}>
                        {drawer}
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
