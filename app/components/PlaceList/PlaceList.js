import React , {useState, useEffect} from 'react';
import '../App.scss';
import { makeStyles } from '@material-ui/core/styles';
import planeSvg from '../../images/airport.svg';
import hospitalSvg from '../../images/hospitalfix.svg';
import publicSvg from '../../images/public_building.svg';
import routeSvg from '../../images/route.svg';
import trainSvg from '../../images/train.svg';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Search from '@material-ui/icons/Search';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  search: {
    marginTop: theme.spacing(1),
    marginLeft: '5px',
    width: 'calc(100% - 10px)',
  },
}));

const PlaceList = props => {
  
  const classes = useStyles();
  
  const [points, setPoints] = useState([]);

  const [filtered, setFiltered] = useState([]);

  const locateMarker = (index, lat, lng) => () => {
    props.clickedLi(index, lat, lng);
  }

  const handleChange = (e) => {
        // Variable to hold the original version of the list
    let currentList = [];
        // Variable to hold the filtered list before putting into state
    let newList = [];
        // If the search bar isn't empty
    if (e.target.value !== "") {
      // Assign the original list to currentList
      currentList = points;

      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter(item => {
        // change current item to lowercase
        const lc = item.name.toLowerCase();
        // change search term to lowercase
        const filter = e.target.value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        if(lc.includes(filter)){
          return item;
        }
      });
    } else {
            // If the search bar is empty, set newList to original task list
      newList = points;
    }
        // Set the filtered state based on what our rules added to newList
    setFiltered(newList);
  }

  const displayStore = () => {
    return filtered.map((store, index) => {
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
         return <li onClick={locateMarker(index, store.lat, store.lng)} key={index} style={{borderLeft:`4px solid ${color}`}} >
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
      setPoints(props.locations);
      setFiltered(props.locations);
  }, [props.locations]);


  return (
  <section className="place-list">
    <FormControl className={classes.search}>
      <Input
        style={{marginTop: '5px', marginLeft:'10px', marginRight:'10px'}}
        onChange={handleChange}
        id="input-with-icon-adornment" placeholder="Buscar proyecto..."
        startAdornment={
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        }
      />
    </FormControl>
      <h1 style={{marginLeft:'10px', fontSize:'21px', marginBottom: '-5px', marginTop: '21px'}}>Proyectos</h1>
      <ul>
          {displayStore()}
      </ul>
  </section>
  );
  
}

PlaceList.propTypes = {
  collapsed: PropTypes.bool
};

export default PlaceList;
