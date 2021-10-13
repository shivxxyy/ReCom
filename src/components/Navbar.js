import React from 'react'
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core'
import { ShoppingCart } from '@material-ui/icons'
import useStyles from './navbarStyles'
import commerce from './images/commerce.png'
import {Link, useLocation} from 'react-router-dom'
const Navbar = ({totalItems}) => {
    const classes= useStyles()
    const location = useLocation()
    return (
        <div>
            <AppBar position='fixed' className={classes.appBar} color='inherit'>
                <Toolbar>
                    <Typography component={Link} to='/' variant='h6' className={classes.title} color='inherit'>
                        <img src={commerce} alt='Commerce.js' height='25px' className='image'/>
                        ReCom
                    </Typography>
                    <div classsName='grow'/>
                    {location.pathname==='/' && (
                    <div className={classes.button}>
                        <IconButton component={Link} to='/cart' aria-label='Show cart items' color='inherit'>
                            <Badge badgeContent={totalItems} color='secondary'>
                            <ShoppingCart/>
                            </Badge>
                        </IconButton>
                    </div>)}
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar
