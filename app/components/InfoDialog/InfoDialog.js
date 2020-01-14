import React from 'react';
import '../App.scss';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  
const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);
  
const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);
  
export default function InfoDialog(props){

    const [open, setOpen] = React.useState(props.openDialog);

    const [data, setData] = React.useState(props.data);

    const handleClose = () => {
        console.log('click close');
        props.parentStatus(false);
    };

    const calcRoute = (start, end) => () => {
        props.showRoute(start, end);
        handleClose();
    }

    React.useEffect(() => {
        setOpen(props.openDialog);
        setData(props.data);
    }, [props.openDialog, props.data]);

    return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            {data ? data.name : 'No hay titulo'}
        </DialogTitle>
        <DialogContent dividers>
            <Typography gutterBottom>
            Decreto Supremo de Adjudicación:
            DS MOP Nº33 con fecha 05/03/2018
            Mandante:Ministerio de Obras Públicas (MOP)
            Unidad Ejecutora: Dirección General de Concesiones de Obras Públicas
            </Typography>
            <Typography gutterBottom>
            Concesionaria: Sociedad Concesionaria Conexión Vial Ruta 78-68 S.A.(Grupo Costanera)
            Longitud trazado:9 km.
            </Typography>
            <Typography gutterBottom>
            Inicio de la concesión: 21 de abril 2018
            Plazo de la concesión: 540 meses (máximo)
            </Typography>
        </DialogContent>
        {
        (data && data.start && data.end) ?
        <DialogActions>
            <Button autoFocus onClick={calcRoute(data ? data.start : '',data ? data.end : '')} color="primary">
                Ver ruta
            </Button> 
        </DialogActions>
        : null
         }
        </Dialog>
    );

}

