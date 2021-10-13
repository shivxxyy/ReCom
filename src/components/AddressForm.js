import React, { useEffect, useState } from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import CustomTextField from './CustomTextField'
import {commerce} from '../lib/commerce'
import {Link} from 'react-router-dom'
const AddressForm = ({checkoutToken,next}) => {
    const methods= useForm()
    const [shippingCountries, setShippingCountries]= useState([])
    const [shippingCountry, setShippingCountry]= useState('')
    const [shippingSubdivisons, setShippingSubdivisions]=useState([])
    const [shippingSubdivison, setShippingSubdivision]=useState('')
    const [shippingOptions, setShippingOptions]=useState([])
    const [shippingOption, setShippingOption]=useState('')

    const countries= Object.entries(shippingCountries).map(([code,name])=>({id:code, label:name}))
    const subdivisions= Object.entries(shippingSubdivisons).map(([code,name])=>({id:code, label:name}))
    const options= shippingOptions.map((sO)=>({id:sO.id,label:`${sO.description} - (${sO.price.formatted_with_symbol})`}))

    const fetchShippingCountries=async (checkoutTokenId)=>{
        const {countries}= await commerce.services.localeListShippingCountries(checkoutTokenId)

        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])
    }

    const fetchSubdivisions=async (countryCode)=>{
        const {subdivisions}= await commerce.services.localeListSubdivisions(countryCode)

        setShippingSubdivisions(subdivisions)
        setShippingSubdivision(Object.keys(subdivisions)[0])
    }

    const fetchShippingOptions=async(checkoutTokenId, country, region=null)=>{
        const options= await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region})

        setShippingOptions(options)
        setShippingOption(options[0].id)
    }

    useEffect(()=>{
        fetchShippingCountries(checkoutToken.id)
    },[])

    useEffect(()=>{
        if(shippingCountry) fetchSubdivisions(shippingCountry)
    },[shippingCountry])

    useEffect(()=>{
        if(shippingSubdivison) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivison)
    },[shippingSubdivison])
    return (
        <div>
            <Typography variant='h6' gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((data)=>next({...data, shippingCountry, shippingSubdivison, shippingOption}))}>
                <Grid container spacing={3}>
                <CustomTextField required name='firstName' label='First Name'/>
                <CustomTextField required name='lastName' label='Last Name'/>
                <CustomTextField required name='address1' label='Address'/>
                <CustomTextField required name='email' label='Email'/>
                <CustomTextField required name='city' label='City'/>
                <CustomTextField required name='zip' label='ZIP/ Postal Code'/>
                <Grid item sm={12} xs={6}>
                    <InputLabel>Shipping Country</InputLabel>
                    <Select value={shippingCountry} fullWidth onChange={(e)=> setShippingCountry(e.target.value)}>
                    {countries.map((country)=>(
                        <MenuItem key={country.id} value={country.id}>
                            {country.label}
                        </MenuItem>
                    ))}
                    </Select>
                </Grid>
                 <Grid item sm={12} xs={6}>
                    <InputLabel>Shipping Subdivision</InputLabel>
                    <Select value={shippingSubdivison} fullWidth onChange={(e)=> setShippingSubdivision(e.target.value)}>
                    {subdivisions.map((subdivision)=>(
                        <MenuItem key={subdivision.id} value={subdivision.id}>
                            {subdivision.label}
                        </MenuItem>
                    ))}
                    </Select>
                </Grid>
               <Grid item sm={12} xs={6}>
                    <InputLabel>Shipping Options</InputLabel>
                    <Select value={shippingOption} fullWidth onChange={(e)=> setShippingOption(e.target.value)}>
                    {options.map((option)=>(
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                    </Select>
                </Grid>
                </Grid>
                <br/>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Button component={Link} to='/cart' variant='outlined'>Back to Cart</Button>
                    <Button type='submit' variant='contained' color='primary'>Next</Button>
                </div>
            </form>
            </FormProvider>
        </div>
    )
}

export default AddressForm
