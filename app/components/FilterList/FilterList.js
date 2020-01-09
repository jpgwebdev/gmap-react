import React from 'react';
import '../App.scss';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
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
        radioEstado:[],
        radioTipo:[]
    }
  }

  handleRadioChange = (name) => (event) => {
    let radioVal = event.target.value;
    if(event.target.checked){
      if(name == 'estado'){
        this.setState(prevState=>({radioEstado:[...prevState.radioEstado,radioVal]}),() => {
          //console.log('Updated array estado',this.state.radioEstado);
          this.props.estadoFilters(this.state.radioEstado);
        })
      }else if(name == 'tipo'){
        this.setState(prevState=>({radioTipo:[...prevState.radioTipo,radioVal]}),() => {
          //console.log('Updated array tipo',this.state.radioTipo);
          this.props.tipoFilters(this.state.radioTipo);
        })
      }
    }else{
      if(name == 'estado'){
        this.setState(prevState => ({ radioEstado: prevState.radioEstado.filter(name => name !== radioVal) }),() => {
          this.props.estadoFilters(this.state.radioEstado);
        });
      }else if(name  == 'tipo'){
        this.setState(prevState => ({ radioTipo: prevState.radioTipo.filter(name => name !== radioVal) }),() => {
          this.props.tipoFilters(this.state.radioTipo);
        });
      }
      
    }
  }
  
  render() {
    const { classes } = this.props;
    return (
        <div className="map-filters">
        <FormControl className={classes.formControl}>
        <FormLabel component="legend">Estado de Obra</FormLabel>
        <FormGroup aria-label="estado">
          
            <FormControlLabel
            control={<Checkbox color="primary" value="todos" onChange={this.handleRadioChange('estado')}/>}
            label="Todos"
            labelPlacement="end"
            />

            <FormControlLabel
            control={<Checkbox color="primary" value="explotacion" onChange={this.handleRadioChange('estado')}/>}
            label="Explotación"
            labelPlacement="end"
            />

            <FormControlLabel
            control={<Checkbox color="primary" value="construccion" onChange={this.handleRadioChange('estado')}/>}
            label="Construcción"
            labelPlacement="end"
            />

            <FormControlLabel
            control={<Checkbox color="primary" value="licitacion" onChange={this.handleRadioChange('estado')}/>}
            label="Licitación"
            labelPlacement="end"
            />

            <FormControlLabel
            control={<Checkbox color="primary" value="estudio" onChange={this.handleRadioChange('estado')}/>}
            label="Estudio"
            labelPlacement="end"
            />

        </FormGroup>
        </FormControl>
        <FormControl className={classes.formControl}>
        <FormLabel component="legend">Tipo de Obra</FormLabel>
        <FormGroup aria-label="estado">
          
          <FormControlLabel
          control={<Checkbox color="secondary" value="todos" onChange={this.handleRadioChange('tipo')}/>}
          label="Todos"
          labelPlacement="end"
          />

          <FormControlLabel
          control={<Checkbox color="secondary" value="riego" onChange={this.handleRadioChange('tipo')}/>}
          label="Obras de riego"
          labelPlacement="end"
          />

          <FormControlLabel
          control={<Checkbox color="secondary" value="publica" onChange={this.handleRadioChange('tipo')}/>}
          label="Edificación publica"
          labelPlacement="end"
          />

          <FormControlLabel
          control={<Checkbox color="secondary" value="hospitalaria" onChange={this.handleRadioChange('tipo')}/>}
          label="Hospitalaria"
          labelPlacement="end"
          />

          <FormControlLabel
          control={<Checkbox color="secondary" value="vial" onChange={this.handleRadioChange('tipo')}/>}
          label="Obra vial"
          labelPlacement="end"
          />

          <FormControlLabel
          control={<Checkbox color="secondary" value="penitenciaria" onChange={this.handleRadioChange('tipo')}/>}
          label="Penitenciaria"
          labelPlacement="end"
          />
      </FormGroup>
        </FormControl>
        <Button style={{marginTop:'20px'}} variant="contained" color="primary" href="#contained-buttons">
            Filtrar
        </Button>
        </div>
    );
  }
}

export default withStyles(styles)(PlaceList);

