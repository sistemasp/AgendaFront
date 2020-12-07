import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Grid, IconButton, InputAdornment, OutlinedInput, InputLabel, FormControl, MenuItem, Select, TextField } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { ButtonCustom } from '../../basic/ButtonCustom';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#FFFFFF',
  },
}));

const ModalFormNuevoIngreso = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    onClickCancel,
    onClickGuardar,
    open,
    dataComplete,
    onChangeTipoIngreso,
    tipoIngresos,
    onChangeMetodoPago,
    formaPagos,
    onChange,
    onAgregarConceto,
  } = props;

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open} >
      <div style={modalStyle} className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h2>AGREGAR INGRESO</h2>
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              name="concepto"
              label="CONCEPTO"
              value={values.concepto}
              onChange={onChange}
              variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              name="cantidad"
              label="CANTIDAD"
              value={values.cantidad}
              type='Number'
              onInput={(e) => {
                e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 7)
              }}
              onChange={onChange}
              variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-hora">TIPO INGRESO</InputLabel>
              <Select
                labelId="simple-select-outlined-tipo-ingreso"
                id="simple-select-outlined-tipo-ingreso"
                value={values.tipo_ingreso}
                onChange={onChangeTipoIngreso}
                label="TIPO INGRESO" >
                {tipoIngresos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-metodo-pago">METODO PAGO</InputLabel>
              <Select
                labelId="simple-select-outlined-metodo-pago"
                id="simple-select-outlined-metodo-pago"
                value={values.forma_pago}
                onChange={onChangeMetodoPago}
                label="METODO PAGO" >
                {formaPagos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ButtonCustom
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={onAgregarConceto}
              disabled={dataComplete}
              text='AGREGAR' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ButtonCustom
              className={classes.button}
              color="secondary"
              variant="contained"
              onClick={onClickCancel}
              text='CANCELAR' />
          </Grid>
        </Grid>
      </div>
    </Modal>

  );
}

export default ModalFormNuevoIngreso;