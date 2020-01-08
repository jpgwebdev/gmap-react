import React , {useState, useEffect} from 'react';
import '../App.scss';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import planeSvg from '../../images/airport.svg';
import hospitalSvg from '../../images/hospitalfix.svg';
import publicSvg from '../../images/public_building.svg';
import routeSvg from '../../images/route.svg';
import trainSvg from '../../images/train.svg';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function PlaceList(props){
  
  const classes = useStyles();
  
  const [points, setPoints] = useState([]);

  const displayStore = () => {
    return points.map((store, index) => {
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


  useEffect(() => {
      setPoints(props.points);
  }, [props.points]);


  return (
  <section className="place-list">
    <FormControl className={classes.margin}>
      <InputLabel htmlFor="input-with-icon-adornment">Buscar proyectos</InputLabel>
      <Input
        id="input-with-icon-adornment"
        startAdornment={
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        }
      />
    </FormControl>
      <h1 style={{marginLeft:'10px'}}>Proyects</h1>
      <ul>
          {displayStore()}
      </ul>
  </section>
  );
  
}
