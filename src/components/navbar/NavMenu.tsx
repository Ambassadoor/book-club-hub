import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionManager } from "../../hooks/useSessionManager";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"
import { AccountCircle} from "@mui/icons-material"
import { Login } from "../login/Login";
type NavMenuProps = {
    user: number | null
    setUser: React.Dispatch<React.SetStateAction<number | null>>
}

// Drop Down Menu for the NavBar. Updates list items depending on screen size. 
export const NavMenu = ({user, setUser}:NavMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | Element>(null)
    const [open, setOpen] = useState(false)
    const {logout} = useSessionManager()

    const pages = [
        {
        text: "Book Search",
        path: "books",
        },
        {
        text: "Clubs",
        path: "clubs"
        },
        {
        text: user && "My Clubs",
        path: user && `clubs/myClubs/${user}`,
        }
    ];

  const navigate = useNavigate()

  const handleNavClick = (path: string) => {
    navigate(path)
    handleCloseMenu()
  }

  const handleOpenMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget)
  };

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

    return (
        <Box className="flex">
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={handleOpenMenu}
                className="md:aria-[menu] lg:aria-[profile menu]"
            >
                <MenuIcon className="md:hidden"/>
                <AccountCircle className="hidden md:inline"/>
            </IconButton>
            <Menu
                className="mt-12"
                id="nav-menu"
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
                {user ? 
                <MenuItem onClick={() => handleNavClick("/profile")}>
                    <Typography>Profile</Typography>
                </MenuItem> :
                <MenuItem onClick={() => {
                    setOpen(true)
                    handleCloseMenu()
                    
                    }}>
                    <Typography>Sign In</Typography>
                </MenuItem>
                }  
                {pages.map((page) => (
                    <MenuItem
                        className="md:hidden"
                        key={page.text}
                        onClick={() => handleNavClick(page.path)}
                    >
                        <Typography>{page.text}</Typography>
                    </MenuItem>
                ))} 
                {user && <MenuItem onClick={() => {
                    handleNavClick(`library/${user}`)
                }}>
                    <Typography>My Library</Typography>
                    </MenuItem>}
                {user && <MenuItem onClick={() => {
                    logout()
                    setUser(null)
                    handleCloseMenu()
                }}>
                        <Typography>Sign Out</Typography>
                    </MenuItem>}
            </Menu>
            {open && <Login open={open} setOpen={setOpen} setUser={setUser} />}
        </Box>
    )
}