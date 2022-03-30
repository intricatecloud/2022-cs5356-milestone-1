import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails';
import useStyles from './styles.js';

const List = () => {
  const classes = useStyles();
  const [rating,setRating] = useState('')
  const places = [
    {name:'Statue of Liberty'},
    {name:'High Line Park'},
    {name:"Little Island"},
    {name:"Roosevelt Island"},
    {name:"Hudson Yard"}

  ]

  return (
    <div className={classes.container}>
      <Typography variant="h4">Attractions around you</Typography>   
      <FormControl className={classes.formControl}>
        <InputLabel id="rating">Rating</InputLabel>
        <Select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="3">Above 3.0</MenuItem>
          <MenuItem value="4">Above 4.0</MenuItem>
          <MenuItem value="4.5">Above 4.5</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={3} className={classes.list}>
        {places?.map((place, i) => (
          <Grid item key={i}  xs={12}>
            <PlaceDetails place={place} />
          </Grid>
        ))}
      </Grid>
      
     
    </div>
  );
};

export default List;
