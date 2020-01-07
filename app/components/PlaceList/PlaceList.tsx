import React from 'react';
import '../App.scss';
import planeSvg from '../../images/airport.svg';
import hospitalSvg from '../../images/hospitalfix.svg';
import publicSvg from '../../images/public_building.svg';
import routeSvg from '../../images/route.svg';
import trainSvg from '../../images/train.svg';

class PlaceList extends React.Component<any, any>{

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
    }
  }


  displayStore = () => {
    return this.state.stores.map((store, index) => {
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
        let color;
        if(store.estado == 'explotacion'){
            color = '#00e676';
        }else if(store.estado == 'licitacion'){
            color = '#8e0606';
        }else if(store.estado == 'construccion'){
            color = '#2196f3';
        }else if(store.estado == 'estudio'){
            color = '#454';
        }
        const type = store.type.charAt(0).toUpperCase() + store.type.slice(1)
         return <li key={index} style={{borderLeft:`4px solid ${color}`}} >
                    <div className="circle-img" style={{marginLeft:'10px',backgroundColor:color}}><img style={{width:'15px'}} 
                    src={"data:image/svg+xml;utf8,"+iconURL} />
                    </div>
                    <div style={{marginLeft:'20px'}}>
                        <div className="type">{type} en {store.estado}</div>
                        <div>{store.name}</div>
                    </div>
                </li>
      });
  }

  componentDidUpdate(){
    console.log(this.props.selectedMarker);
  }

  render() {
    return (
    <section className="place-list">
        <h1 style={{marginLeft:'10px'}}>Proyects</h1>
        <ul>
            {this.displayStore()}
        </ul>
    </section>
    );
  }
}

export default PlaceList;