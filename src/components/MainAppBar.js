import React, { useState } from 'react';
import MenuIcon from "@mui/icons-material/Menu";
import { logoutUserFromFirebase } from '../firebase';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";

  const MainBarApp = ({headerText}) => {

    const [anchorEl, setAnchorEl] = useState(null); // לניהול תפריט ההמבורגר

    const handleLogout = async () => {
        await logoutUserFromFirebase()
        window.location.href = "/";
    };
    
    // פתיחה וסגירה של תפריט ההמבורגר
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    {headerText}
                </Typography>
                {/* כפתור תפריט המבורגר */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleLogout}>יציאה</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
  };

  export default MainBarApp;








// const MainAppBar = ({headerText}) => {
//     const [anchorEl, setAnchorEl] = useState(null); // לניהול תפריט ההמבורגר

//     const handleLogout = async () => {
//         await logoutUserFromFirebase()
//         window.location.href = "/";
//     };
    
//     // פתיחה וסגירה של תפריט ההמבורגר
//     const handleMenuOpen = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
    
//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };
    

//     return (

//         <AppBar position="static">
//             <Toolbar>
//                 <Typography variant="h6" style={{ flexGrow: 1 }}>
//                     headerText
//                 </Typography>
//                 {/* כפתור תפריט המבורגר */}
//                 <IconButton
//                     edge="end"
//                     color="inherit"
//                     aria-controls="menu-appbar"
//                     aria-haspopup="true"
//                     onClick={handleMenuOpen}
//                 >
//                     <MenuIcon />
//                 </IconButton>
//                 <Menu
//                     id="menu-appbar"
//                     anchorEl={anchorEl}
//                     anchorOrigin={{
//                         vertical: "top",
//                         horizontal: "right",
//                     }}
//                     keepMounted
//                     transformOrigin={{
//                         vertical: "top",
//                         horizontal: "right",
//                     }}
//                     open={Boolean(anchorEl)}
//                     onClose={handleMenuClose}
//                 >
//                     <MenuItem onClick={handleLogout}>יציאה</MenuItem>
//                 </Menu>
//             </Toolbar>
//         </AppBar>
//     )
// }

// export default MainAppBar

