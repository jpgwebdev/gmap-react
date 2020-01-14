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
import useSupercluster from "use-supercluster";
import Button from '@material-ui/core/Button';

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
  button: {
    position:'fixed',
    top:'20px',
    left: '320px',
    zIndex: '9'
  }
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
  const directionRef = useRef();

  const [locations, setLocations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoom, setZoom] = useState([]);
  const [bounds, setBounds] = useState([]);
  const [backVisible, setBackVisible] = useState(false);
  //loader of markers call
  let [loading, setLoading] = useState(true);
  
  // dialog status to avoid permanent close of dialog if clicked multiple markers
  let [openDialog, setOpenDialog] = useState(false);

  // send data to InfoDialog
  let [data, setData] = useState(null);

  //load markers call
  const loadMarkers = () => {
    axios({
        method: 'GET',
        url: `http://git.kaleidadigital.com/mapacopsa/data.php`,
    })        
    .then(response => {
      console.log('Response',JSON.parse(response.data));
      setLocations(JSON.parse(response.data));
      setFiltered(JSON.parse(response.data))
      setLoading(false);
    });
  }

  // Open dialog if click item list
  const openFromList = (index, lat, lng) => {
    //console.log('Clicked child');
    const singleBound = new window.google.maps.LatLngBounds();
    singleBound.extend({lat:lat,lng:lng});
    mapRef.current.setCenter(singleBound.getCenter());
    mapRef.current.setZoom(9);
  }
  
  // change var dialog to closed if clicked close in infodialog component
  const dialogStatus = (status) => {
    //console.log('Status', status);
    setOpenDialog(status);
  }

  const getFilters = (filters) => {
    console.log('Filters in parent estado',filters);
    let newFilter = [];
    const filterBounds = new window.google.maps.LatLngBounds();
    if(filters.estado.length > 0 || filters.tipo.length > 0){
      filters.estado.map((name, index) => {
        console.log('Por asignar',newFilter.length);
        if(newFilter.length >= 1){
          console.log('entro en concat');
          console.log("Filtered array:",filtered);
          newFilter = filtered.concat(locations.filter((point) => {
            if(point.estado == name){
              filterBounds.extend({lat: point.lat, lng: point.lng});
              return point;
            }
          }));
        }else{
          console.log('entro en no concat');
          newFilter = locations.filter((point) => {
            if(point.estado == name){
              filterBounds.extend({lat: point.lat, lng: point.lng});
              return point;
            }
          });
        }
      });

      filters.tipo.map((name, index) => {
        console.log('Por asignar',newFilter.length);
        if(newFilter.length >= 1){
          console.log('entro en concat');
          console.log("Filtered array:",filtered);
          newFilter = filtered.concat(locations.filter((point) => {
            if(point.type == name){
              filterBounds.extend({lat: point.lat, lng: point.lng});
              return point;
            }
          }));
        }else{
          console.log('entro en no concat');
          newFilter = locations.filter((point) => {
            if(point.type == name){
              filterBounds.extend({lat: point.lat, lng: point.lng});
              return point;
            }
          });
        }
      });

      console.log("Filtrado : ",newFilter);
      setFiltered(newFilter);
      console.log(filterBounds);

      if(filtered.length < 1){
        mapRef.current.setCenter(filterBounds.getCenter());
        mapRef.current.setZoom(9);
      }else{
        mapRef.current.fitBounds(filterBounds);
      }

    }else{
      fitAllBounds();
    }
  }

  const fitAllBounds = () => {
    setFiltered(locations);
    const allBounds = new window.google.maps.LatLngBounds();
    locations.map(location => {
      allBounds.extend({lat: location.lat, lng: location.lng});
    });
    mapRef.current.fitBounds(allBounds);
  }

  const closeRender = () => {
    console.log('close render');
    directionRef.current.setMap(null);
    setBackVisible(false);
    fitAllBounds();
  }

  // open dialog and pass data
  const showDialogWithData = (store) => {

    setOpenDialog(true);
    setData(store);
  }

  // on marker click
  const onMarkerClick = (store) => (event) => {
    //console.log('Clicked marker #'+index);
    showDialogWithData(store);
  }

  const calcRoute = (start, end) => {
    setBackVisible(true);
    console.log('Calc route in APP.JS', start);
    let directionsService = new window.google.maps.DirectionsService();
    let request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionRef.current.setDirections(result);
      }
    });
    directionRef.current.setMap(mapRef.current);
  }

  //load markers
  useEffect(() => {
    loadMarkers();
  }, []);

  const points = locations.map(project => ({
    type: "Feature",
    properties: { cluster: false, estado: project.estado, type: project.type },
    geometry: {
      type: "Point",
      coordinates: [
        project.lng,
        project.lat
      ]
    }
  }));

  const {clusters} = useSupercluster({
    points,
    bounds,
    zoom,
    options: {radius: 75, maxZoom:20}
  });


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
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
        defaultCenter={{lat: -33.502491, lng: -70.654811}}
        defaultZoom={5}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps}) => {
          mapRef.current = map;
          directionRef.current = new maps.DirectionsRenderer();
        }}
        onChange={({zoom,bounds}) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ]);

        }}
      >

      {filtered.length > 0 ? filtered.map((store, index) => {
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
          name={store.name}
          lat={store.lat}
          lng={store.lng}
          onClick={onMarkerClick(store)} />
      }) : ''}

      </GoogleMapReact>
      {backVisible ?
      <Button className={classes.button} variant="contained" color="primary" onClick={closeRender}>
        Volver
      </Button>
       : null}
      <PlaceList locations={filtered} clickedLi={openFromList}/>
      <FilterList  changeFilters={getFilters}/>
      <InfoDialog showRoute={calcRoute} openDialog={openDialog} data={data} parentStatus={dialogStatus}/>
  </section>
  );
  
}
