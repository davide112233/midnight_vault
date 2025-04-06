"use client";

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { theme } from '../utils/theme';
import { Grid } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import { IoIosMenu } from 'react-icons/io';

const navbarBrand = 'midnight vault';

interface Props {
  window?: () => Window;
}

const drawerWidth = '100vw';

const navItems = [
  { label: 'homepage', path: '/' },
  { label: 'characters', path: '/characters' },
  { label: 'the bests', path: '/bests' },
];

export default function DrawerAppBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: 'center',
        backgroundColor: theme.palette.primary.main,
        minHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ my: 2, marginLeft: '0.8rem' }}>
          <Link
            className="link"
            href="/"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(navbarBrand),
            }}
          />
        </Typography>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <Button variant="contained" sx={{ height: '2.3rem', boxShadow: 'none' }}>
            <AiOutlineClose size={25} />
          </Button>
        </Box>
      </Grid>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <List
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: "10rem",
          }}
        >
          {navItems.map(({ label, path }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                component={Link}
                href={path}
                sx={{
                  textAlign: 'center',
                  color: pathname === path ? theme.palette.secondary.main : theme.palette.text.primary,
                  backgroundColor: pathname === path ? theme.palette.background.paper : "transparent",
                  borderRadius: "5px",
                }}
              >
                <ListItemText
                  primary={DOMPurify.sanitize(label)}
                  sx={{ textTransform: 'capitalize' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ padding: { xl: '0.3rem', xs: '0.2rem' } }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <IoIosMenu size={35} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
              fontSize: { xl: 'xx-large' },
              letterSpacing: '3px',
            }}
          >
            <Link
              className="link"
              href="/"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(navbarBrand),
              }}
            />
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: { xl: '0.5rem' } }}>
            {navItems.map(({ label, path }) => (
              <Button
                key={label}
                component={Link}
                href={path}
                sx={{
                  color: pathname === path ? theme.palette.secondary.main : theme.palette.text.primary,
                  backgroundColor: pathname === path ? theme.palette.background.paper : "transparent",
                  borderRadius: "5px",
                  minWidth: { sm: "5rem", xl: "6.5rem", lg: "6.5rem", md: "5rem" },
                  fontSize: { xl: 'larger' },
                  textTransform: 'capitalize',
                }}
              >
                {DOMPurify.sanitize(label)}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
