import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';

import useStyles from './styles.js';

const Map = () => {
  const classes = useStyles();
  const coords = {lat:0,lng:0}
  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyBFunsUmQ7N12nT29zMLRFg_srdOdtHSUo'}}
        defaultCenter={coords}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        // options={''}
        // onChange={''}
        // onChildClick={''}
      >         
      </GoogleMapReact>
    </div>
  );
};

export default Map;
