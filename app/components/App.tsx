import React from 'react';
import { Map, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import './App.scss';
import planeSvg from '../images/airport.svg';
import hospitalSvg from '../images/hospitalfix.svg';
import publicSvg from '../images/public_building.svg';
import routeSvg from '../images/route.svg';
import trainSvg from '../images/train.svg';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PlaceList from './PlaceList/PlaceList';
import CustomMarker from './CustomMarker/CustomMarker';
const styles = {
  formControl:{
    marginTop:'10px',
    display: 'block',
    fontSize:'.8em'
  }
};

class App extends React.Component<any, any>{

  constructor(props: any){
    super(props);

    this.state = {
      stores: [
              {name:"Aeropuerto El Loa Calama", estado:'explotacion', type:'aeropuerto', lat: 47.49855629475769, lng: -122.14184416996333},
              {name:"Embalse Convento Viejo", estado:'estudio', type:'tren', lat: 47.359423, lng: -122.021071},
              {name:"Camino La Madera", estado:'construccion', type:'vial', lat: 47.2052192687988, lng: -121.988426208496},
              {name:"Tunel el Melón", estado:'licitacion', type:'vial', lat: 47.6307081, lng: -122.1434325},
              {name:"Hospital de Antofagasta", estado:'explotacion', type:'hospitalaria', lat: 47.3084488, lng: -122.2140121},
              {name:"Puerto Terrestre Los Andes", estado:'licitacion', type:'publica', lat: 47.5524695, lng: -122.0425407}
              ],
      filteredStores:[],
      activeMarker: {},
      selectedPlace: {},
      showingInfoWindow: false,
      selectValue:'todos',
      radioValue:'todos'
    }
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  onMouseoverMarker(props, marker, e){
    //console.log(marker);
    //marker.icon.scaledSize = {width:40,height:40};
  };

  displayMarkers = () => {
    return this.state.filteredStores.map((store, index) => {
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

      return <CustomMarker 
        icon={{
          url:'data:image/svg+xml;utf8,'+iconURL,
          scaledSize:  new this.props.google.maps.Size(25,25),
        }} 
        onMouseOver={this.onMouseoverMarker}
        name={store.name} 
        key={index} 
        id={index} 
        position={{
          lat: store.lat,
          lng: store.lng
        }}
      onClick={this.onMarkerClick} />
    })
  }

  handleChange = (name) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    this.setState({
      ...this.state,
      filteredStores: event.target.value != 'todos' ? this.state.stores.filter((store) => {
        return store.type == event.target.value;
      }) : this.state.stores,
      selectValue:event.target.value
    },() =>{
      console.log('Filtered: ',this.state.filteredStores);
    });
  };

  handleRadioChange = () => (event) => {
    this.setState({
      ...this.state,
      filteredStores: event.target.value != 'todos' ? this.state.stores.filter((store) => {
        return store.estado == event.target.value;
      }) : this.state.stores,
      radioValue:event.target.value
    },() =>{
      console.log('Filtered: ',this.state.filteredStores);
    });  
  }

  hoverMarker(index){
    console.log(index + " was hovered");
  }

  componentDidMount(){
    if(this.state.filteredStores.length < 1){
      this.setState({filteredStores:this.state.stores});
    }
  }

  render() {
    const { classes } = this.props;
    return (
    <section>
        <PlaceList heyMarker={this.hoverMarker} selectedMarker={this.state.selectedPlace ? this.state.selectedPlace.id : 0}/>
        <Map
          google={this.props.google}
          zoom={8}
          id="map"
          disableDefaultUI={true}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        >
          {this.displayMarkers()}
          <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
        </Map>
      <div className="map-filters">
      <FormControl className={classes.formControl}>
        <FormLabel component="legend">Estado de Obra</FormLabel>
        <RadioGroup aria-label="estado" name="estado" value={this.state.radioValue} onChange={this.handleRadioChange()}>
          <FormControlLabel
            value="todos"
            control={<Radio color="primary" />}
            label="Todos"
            labelPlacement="end"
          />
          <FormControlLabel
            value="explotacion"
            control={<Radio color="primary" />}
            label="Explotación"
            labelPlacement="end"
          />
          <FormControlLabel
            value="construccion"
            control={<Radio color="primary" />}
            label="Construcción"
            labelPlacement="end"
          />
          <FormControlLabel
            value="licitacion"
            control={<Radio color="primary" />}
            label="Licitación"
            labelPlacement="end"
          />
          <FormControlLabel
            value="estudio"
            control={<Radio color="primary" />}
            label="Estudio"
            labelPlacement="end"
          />
        </RadioGroup>
        </FormControl>
        <FormControl className={classes.formControl}>
        <FormLabel component="legend">Tipo de Obra</FormLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          style={{width:'100%'}}
          value={this.state.selectValue}
          onChange={this.handleChange('tipo')}
        >
          <MenuItem value="todos">
            <em>Todos</em>
          </MenuItem>
          <MenuItem value='riego'>Obras de Riego</MenuItem>
          <MenuItem value='publica'>Edificación Publica</MenuItem>
          <MenuItem value='aeropuerto'>Aeropuertaria</MenuItem>
          <MenuItem value='vial'>Obra Vial</MenuItem>
          <MenuItem value='penitenciaria'>Penitenciaria</MenuItem>
          <MenuItem value='hospitalaria'>Hospitalaria</MenuItem>
        </Select>
        </FormControl>
        <Button style={{marginTop:'20px'}} variant="contained" color="primary" href="#contained-buttons">
          Filtrar
        </Button>
      </div>
    </section>
    );
  }
}

export default withStyles(styles)(GoogleApiWrapper({
  apiKey: 'AIzaSyCPrJBzd1PuG0sZnQd0IwVSJBUmxHxMvMY'
})(App));