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

  const [locations, setLocations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoom, setZoom] = useState([]);
  const [bounds, setBounds] = useState([]);

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
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({lat:lat,lng:lng})
    mapRef.current.fitBounds(bounds);
  }
  
  // change var dialog to closed if clicked close in infodialog component
  const dialogStatus = (status) => {
    //console.log('Status', status);
    setOpenDialog(status);
  }

  const getEstadoFilters = (filters) => {
    console.log('Filters in parent estado',filters);
    let newFilter = [];
    const filterBounds = new window.google.maps.LatLngBounds();
    if(filters.length > 0){
      filters.map((name, index) => {
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
        console.log("Filtrado #"+index+": ",newFilter);
        setFiltered(newFilter);
        mapRef.current.fitBounds(filterBounds);
      });

    }else{
      setFiltered(locations);
      const allBounds = new window.google.maps.LatLngBounds();
      locations.map(location => {
        allBounds.extend({lat: location.lat, lng: location.lng});
      });
      mapRef.current.fitBounds(allBounds);
    }
  }

  const getTipoFilters = (filters) => {
    console.log('Filters in parent estado',filters);
    let newFilter = [];
    if(filters.length > 0){
      filters.map((name, index) => {
        console.log('Por asignar',newFilter.length);
        if(newFilter.length >= 1){
          console.log('entro en concat');
          console.log("Filtered array:",filtered);
          newFilter = filtered.concat(locations.filter(point => point.type == name));
        }else{
          console.log('entro en no concat');
          newFilter = locations.filter(point => point.type == name);
        }
        console.log("Filtrado #"+index+": ",newFilter);
        setFiltered(newFilter);
      });

    }else{
      setFiltered(locations);
    }
  }

  // open dialog and pass data
  const showDialogWithData = (index, name) => {
    let data = {
      name: name
    }
    setOpenDialog(true);
    setData(data);
  }

  // on marker click
  const onMarkerClick = (index, name) => (event) => {
    //console.log('Clicked marker #'+index);
    showDialogWithData(index, name);
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
        bootstrapURLKeys={{ key: 'AIzaSyCPrJBzd1PuG0sZnQd0IwVSJBUmxHxMvMY' }}
        defaultCenter={{lat: -33.502491, lng: -70.654811}}
        defaultZoom={5}
        options={createMapOptions}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
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
          lat={store.lat}
          lng={store.lng}
          onClick={onMarkerClick(index, store.name)} />
      }) : ''}
      
      </GoogleMapReact>
      <PlaceList locations={locations} clickedLi={openFromList}/>
      <FilterList estadoFilters={getEstadoFilters} tipoFilters={getTipoFilters}/>
      <InfoDialog openDialog={openDialog} data={data} parentStatus={dialogStatus}/>
  </section>
  );
  
}
