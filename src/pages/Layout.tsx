import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
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
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const drawerWidth = 240;

const navItems = [
    { label: 'Modlog', path: '/' },
    { label: 'Modlog by Posts', path: '/modlog-posts' },
    { label: 'Chart', path: '/chart' },
];

export default function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6">My App</Typography>
            </Toolbar>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={Link} to={item.path} onClick={() => setMobileOpen(false)}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* Top AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div">
                        /r/Slovakia Modlog
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Left Drawer */}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? mobileOpen : true}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
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
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3/*, ml: isMobile ? { sm: `${drawerWidth}px` } : undefined */}}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
