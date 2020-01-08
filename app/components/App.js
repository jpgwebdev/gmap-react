import React, {useState,useRef, useEffect} from 'react';
import GoogleMapReact from 'google-map-react';
import { makeStyles } from '@material-ui/core/styles';
import './App.scss';
import axios from 'axios';
import planeSvg from '../images/airport.svg';
import hospitalSvg from '../images/hospitalfix.svg';
import publicSvg from '../images/public_building.svg';
import routeSvg from '../images/route.svg';
import trainSvg from '../images/train.svg';
import PlaceList from './PlaceList/PlaceList';
import InfoDialog from './InfoDialog/InfoDialog';
import mapStyles from './mapStyles';
import FilterList from './FilterList/FilterList';
import LinearProgress from '@material-ui/core/LinearProgress';
import Marker from './Marker/Marker';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    position:'absolute',
    top:'0',
    left:'0',
    zIndex:'99'
  },
}));

export default function App(){
  const createMapOptions = (maps) => {
    return {
      styles: mapStyles
    };
  }
  const classes = useStyles();
  // setup map
  const mapRef = useRef();

  const [points, setPoints] = useState([]);

  let [loading, setLoading] = useState(true);

  let [openDialog, setOpenDialog] = useState(false);

  let [data, setData] = useState(null);

  const loadMarkers = () => {
    axios({
        method: 'GET',
        url: `http://localhost/kaleida/mapacopsa/data.php`,
    })        
    .then(response => {
      console.log('Response',JSON.parse(response.data));
      setPoints(JSON.parse(response.data));
      setLoading(false);
    });
  }

  const dialogStatus = (status) => {
    console.log('Status', status);
    setOpenDialog(status);
  }

  const onMarkerClick = (index, name) => (event) => {
    console.log('Clicked marker #'+index);
    let data = {
      name: name
    }
    setOpenDialog(true);
    setData(data);
  }

  useEffect(() => {
    loadMarkers();
  }, []);

  return (
  <section id="map">
      { 
        loading ?
        <div className={classes.root}>
          <LinearProgress />
        </div>
        : null
      }

      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCPrJBzd1PuG0sZnQd0IwVSJBUmxHxMvMY' }}
        defaultCenter={{lat: 47.444, lng: -122.176}}
        defaultZoom={10}
        options={createMapOptions}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
      >
      {points.length > 0 ? points.map((store, index) => {

        let iconURL;
        if(store.type == 'hospitalaria'){
          iconURL = hospitalSvg;
        }else if(store.type == 'aeropuerto'){
          iconURL = planeSvg;
        }else if(store.type == 'vial'){
          iconURL = routeSvg;
        }else if(store.type == 'tren'){
          iconURL = trainSvg;
        }else if(store.type == 'publica'){
          iconURL = publicSvg;
        }

        let bC;
        if(store.estado == 'explotacion'){
            bC = '#00e676';
        }else if(store.estado == 'licitacion'){
            bC = '#8e0606';
        }else if(store.estado == 'construccion'){
            bC = '#2196f3';
        }else if(store.estado == 'estudio'){
            bC = '#454';
        }

        return <Marker  
          key={index}
          borderColor={bC}
          icon={iconURL}
          lat={store.lat}
          lng={store.lng}
          onClick={onMarkerClick(index, store.name)} />
      }) : ''}
      </GoogleMapReact>
      <PlaceList points={points}/>
      <FilterList/>
      <InfoDialog openDialog={openDialog} data={data} parentStatus={dialogStatus}/>
  </section>
  );
  
}
