import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"
import { Book } from "@mui/icons-material";
import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

export const NavBar = (): JSX.Element =>{
    const [anchorEl, setAnchorEl] = useState<null| Element>(null)

    const userId = 0

    const pages = [
        {
            text: "Books",
            path: "books"
        }, 
        {
            text: "Clubs",
            path: "clubs"
        },
        {
            text: "My Library",
            path: `library/${userId}`
        }
    ]

    const navigate = useNavigate()

    const handleNavLinkClick = (path: string ) => {
        navigate(path)
    }

    const handleOpenMenu = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                  <Toolbar className="flex justify-between items-center">
                    <Box className="flex items-center">
                        <Box className="flex" onClick={() => handleNavLinkClick("/")}>
                            <Book/>
                            <Typography className="mx-2 text-nowrap">Book Club Hub</Typography>
                        </Box>
                        <Box className="hidden md:flex md:ml-10 gap-10">
                            {pages.map(page => (
                                <Button
                                    key={page.text}
                                    value={page.path}
                                    className="text-white text-nowrap"
                                    onClick={() => handleNavLinkClick(page.path)}
                                >{page.text}</Button>
                            ))}
                        </Box>
                    </Box>
                    <Box className="flex md:hidden">
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleOpenMenu}
                            >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            className="mt-12"
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right"
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right"
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                        >
                            {pages.map(page => (
                                <MenuItem 
                                    key={page.text} onClick={() => handleNavLinkClick(page.path)}>
                                    <Typography>{page.text}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                  </Toolbar>
            </AppBar>
        </Box>
    )
}