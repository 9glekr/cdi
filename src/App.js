import React, {useEffect, useState} from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
//import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import Map from './Map.js';

const useStyles = makeStyles({
    mainBackground: {
        opacity: 0.6,
        filter: 'blur(6px)'
    },
});

function App() {
    const classes = useStyles();

    const handlerClick = e => {
        axios.get('https://source.unsplash.com/random/'+[window.innerWidth, window.innerHeight].join('x')).then(res=>{
            setImageURL(res.request.responseURL);
        });
    };

    const [imageURL, setImageURL] = useState("");

    useEffect(() => {
        axios.get('https://source.unsplash.com/random/'+[window.innerWidth, window.innerHeight].join('x')).then(res=>{
            setImageURL(res.request.responseURL);
        });
    }, []);

    return (<>
        <Map />
        <CardMedia
            className={classes.mainBackground}
            component="img"
            image={imageURL}
            alt=""
            onClick={handlerClick}
        />
    </>)
}

export default App;