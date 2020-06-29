import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ButtonCustom } from "../basic/ButtonCustom";
import { CheckCustom } from '../basic/CheckCustom';

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
  selectEmpty: {
    marginTop: theme.spacing(2),
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
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  }
}));

const ModalFormPago = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    errors,
    touched,
    handleSubmit,
    isValid,
    bancos,
    metodosPago,
    tiposTarjeta,
    onClickCancel,
    onClickGuardar,
    onChangePaymentMethod,
    onChangeBank,
    onChangeCardType,
    onChangeCantidad,
    onChangeFactura,
    onChangeConfirmado,
    onChangeObservaciones,
    onChangeDigitos,
    open,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-payment">Metodo pago</InputLabel>
                  <Select
                    labelId="simple-select-outlined-payment"
                    id="simple-select-outlined-payment"
                    value={values.metodo_pago}
                    error={Boolean(errors.metodo_pago)}
                    onChange={onChangePaymentMethod}
                    label="Metodo pago" >
                    {metodosPago.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              {
                values.metodo_pago !== process.env.REACT_APP_METODO_PAGO_EFECTIVO && values.metodo_pago !== '' ?
                  <Fragment>

                    <Grid item xs={12}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-banks">Bancos</InputLabel>
                        <Select
                          labelId="simple-select-outlined-banks"
                          id="simple-select-outlined-banks"
                          value={values.banco}
                          error={Boolean(errors.banco)}
                          onChange={onChangeBank}
                          label="Bancos" >
                          {bancos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-card-type">Tipo tarjeta</InputLabel>
                        <Select
                          labelId="simple-select-outlined-card-type"
                          id="simple-select-outlined-card-type"
                          value={values.tipoTarjeta}
                          error={Boolean(errors.tipoTarjeta)}
                          onChange={onChangeCardType}
                          label="Tipo tarjeta" >
                          {tiposTarjeta.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        className={classes.textField}
                        name="digitos"
                        //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                        error={Boolean(errors.digitos)}
                        label="Digitos"
                        value={values.digitos}
                        type='Number'
                        onInput={(e) => {
                          e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                        }}
                        onChange={onChangeDigitos}
                        variant="outlined" />
                    </Grid>
                  </Fragment> : ''
              }

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="cantidad"
                  //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                  error={Boolean(errors.cantidad)}
                  label="Cantidad"
                  value={values.cantidad}
                  onChange={onChangeCantidad}
                  type='Number'
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7)
                  }}
                  variant="outlined" />
              </Grid>


              {
                values.metodo_pago !== process.env.REACT_APP_METODO_PAGO_EFECTIVO && values.metodo_pago !== '' ?
                  <Grid item xs={12}>
                    <h3 className={classes.label}>{`Comision del ${values.porcentaje_comision}%: ${values.comision}`}</h3>
                  </Grid> : ''
              }

              <Grid item xs={12}>
                <h2 className={classes.label}>{`Total: ${values.total}`}</h2>
              </Grid>

              <Grid item xs={6}>
                <CheckCustom
                  checked={values.factura}
                  onChange={onChangeFactura}
                  name="checkedF"
                  label="Factura"
                />
              </Grid>

              {
                values.metodo_pago !== process.env.REACT_APP_METODO_PAGO_EFECTIVO && values.metodo_pago !== '' ?
                  <Grid item xs={6}>
                    <CheckCustom
                      checked={values.confirmado}
                      onChange={onChangeConfirmado}
                      name="checkedC"
                      label="Pago confirmado"
                    />
                  </Grid> : ''
              }

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="observaciones"
                  //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                  error={Boolean(errors.observaciones)}
                  label="Observaciones"
                  value={values.observaciones}
                  onChange={onChangeObservaciones}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickGuardar(e, values)}
                  disabled={!isValid}
                  text='Guardar' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClickCancel} >
                  Cancelar
                </Button>
              </Grid>
            </Grid>

          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormPago;