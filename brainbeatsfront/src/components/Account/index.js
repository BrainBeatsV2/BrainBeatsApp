import React from 'react'
//import {Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink} from './NavbarElements'
import logo from '../../images/logo_dev.png'
const index = () => {
return (
    <>
    <Nav>
        <NavLink to="/">
            <img style={{height:'50px'}} src={logo} alt='logo' />
            <h1>Brain Beats</h1>
        </NavLink>
        <Bars />
        <NavMenu>
        </NavMenu>
        <NavBtn>
            <NavBtnLink to="/login">Login</NavBtnLink>
        </NavBtn>
    </Nav>
    </>

       );
};

export default index
