import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import itemData from './itemData.js';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    imageList: {
      width: 1000,
      height: 1000,
    },
  }));



const Picture = () => {
    const classes = useStyles();
  
    return (
        <div className={classes.root}>
          <ImageList rowHeight={600} className={classes.imageList} cols={1}>
            {itemData.map((item) => (
              <ImageListItem key={item.img} cols={item.cols || 1}>
                <img src={item.img} alt={item.title} />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      );
};


export default Picture;
