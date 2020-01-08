import React from 'react';
import '../App.scss';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
const styles = {
    formControl:{
      marginTop:'10px',
      display: 'block',
      fontSize:'.8em'
    }
  };
class PlaceList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
        selectValue:'todos',
        radioValue:'todos'
    }
  }

  handleChange = (name) => (event) => {
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
  
  render() {
    const { classes } = this.props;
    return (
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
    );
  }
}

export default withStyles(styles)(PlaceList);

