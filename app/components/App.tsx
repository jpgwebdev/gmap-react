import React from 'react';
import GoogleMapReact from 'google-map-react';
import './App.scss';
import planeSvg from '../images/airport.svg';
import hospitalSvg from '../images/hospitalfix.svg';
import publicSvg from '../images/public_building.svg';
import routeSvg from '../images/route.svg';
import trainSvg from '../images/train.svg';
import PlaceList from './PlaceList/PlaceList';
import CustomMarker from './CustomMarker/CustomMarker';
import mapStyles from './mapStyles';
import FilterList from './FilterList/FilterList';



class App extends React.Component<any, any>{
  static defaultProps = {
    center: {
      lat: 47.444,
      lng: -122.176
    },
    zoom: 11,
    styles:mapStyles
  };
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
        text={store.name}
        key={index} 
        onClick={this.onMarkerClick} />
    })
  }

  componentDidMount(){
    if(this.state.filteredStores.length < 1){
      this.setState({filteredStores:this.state.stores});
    }
  }

  render() {
    return (
    <section>
       <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
        >
          {this.displayMarkers()}
          </GoogleMapReact>
        <PlaceList
        selectedMarker={this.state.selectedPlace ? this.state.selectedPlace.id : 0} />
        <FilterList/>
    </section>
    );
  }
}

export default App;