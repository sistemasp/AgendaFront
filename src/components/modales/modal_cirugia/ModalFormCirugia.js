import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid } from '@material-ui/core';
import { CheckCustom } from '../../basic/CheckCustom';
import ModalPagos from '../modal_pagos';
import { Multiselect } from 'multiselect-react-dropdown';
import { toFormatterCurrency } from '../../../utils/utils';
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
  paper: {
    position: 'absolute',
    width: 700,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    width: '100%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#FFFFFF',
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  },
  labelItemRight: {
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'right',
  }
}));

const canceloStatusId = process.env.REACT_APP_CANCELO_STATUS_ID;
const noAsistioStatusId = process.env.REACT_APP_NO_ASISTIO_STATUS_ID;
const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;

const ModalFormCirugia = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    handleSubmit,
    onClose,
    onClickCrearCirugia,
    open,
    onChangeTotal,
    onChangePagado,
    sucursal,
    materiales,
    onChangeMateriales,
    onChangeItemPrecio,
    dataComplete,
    onChangeBiopsia,
    onChangeCantidadBiopsias,
    onChange,
    patologos,
    onChangeCostoBiopsias,
    openModalPagos,
    onCloseModalPagos,
    onGuardarModalPagos,
    cirugia,
    empleado,
    tipoServicioId,
    onChangeFecha,
    onChangeHora,
    horarios,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            {
              openModalPagos ?
                <ModalPagos
                  open={openModalPagos}
                  onClose={onCloseModalPagos}
                  onGuardarModalPagos={onGuardarModalPagos}
                  servicio={values}
                  empleado={empleado}
                  sucursal={sucursal}
                  tipoServicioId={tipoServicioId} />
                : ''
            }
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h1 className={classes.label}>CIRUGIA</h1>
              </Grid>
              <Grid item xs={12}>
                <h2 className={classes.label}>{cirugia.paciente_nombre} ({cirugia.paciente.telefono})</h2>
              </Grid>
              <Grid item xs={12}>
                <h2 className={classes.label}>DERMATÓLOGO: {cirugia.dermatologo.nombre}</h2>
              </Grid>
              {
                /*
                            <Grid item xs={12} sm={6}>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  disableToolbar
                                  disablePast
                                  autoOk
                                  variant="inline"
                                  format="dd/MM/yyyy"
                                  margin="normal"
                                  id="date-picker-inline"
                                  label="FECHA"
                                  value={values.fecha_hora}
                                  onChange={onChangeFecha}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                  invalidDateMessage='SELECCIONA UNA FECHA' />
                              </MuiPickersUtilsProvider>
                            </Grid>
              
                            <Grid item xs={12} sm={6}>
                              <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="simple-select-outlined-hora">Hora</InputLabel>
                                <Select
                                  labelId="simple-select-outlined-hora"
                                  id="simple-select-outlined-hora"
                                  value={values.hora}
                                  onChange={onChangeHora}
                                  label="HORA" >
                                  {horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
                                </Select>
                              </FormControl>
                            </Grid>*/
              }

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="precio"
                  label="TOTAL CIRUGIA"
                  value={values.total}
                  type='Number'
                  onChange={onChangeTotal}
                  onInput={(e) => {
                    e.target.value = e.target.value < 0 ? 0 : e.target.value;
                    e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 6)
                  }}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12} >
                <Multiselect
                  options={materiales} // Options to display in the dropdown
                  displayValue="nombre" // Property name to display in the dropdown options
                  onSelect={(e) => onChangeMateriales(e)} // Function will trigger on select event
                  onRemove={(e) => onChangeMateriales(e)} // Function will trigger on remove event
                  placeholder="Selecciona materiales"
                  selectedValues={values.materiales} // Preselected value to persist in dropdown
                />
              </Grid>
              {
                values.materiales.map((item, index) =>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      className={classes.button}
                      name={item.precio}
                      label={`PRECIO: ${item.nombre}`}
                      value={item.precio}
                      type='Number'
                      onChange={(e) => onChangeItemPrecio(e, index)}
                      variant="outlined" />
                  </Grid>)
              }
              <Grid item xs={12}>
                <br />
              </Grid>
              {
                values._id ?
                  <Grid item xs={12} sm={2}>
                    <CheckCustom
                      checked={values.hasBiopsia}
                      onChange={onChangeBiopsia}
                      name="checkedG"
                      label="BIOPSIAS" />
                  </Grid>
                  : ''
              }

              {values.hasBiopsia ?
                <Fragment>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      className={classes.textField}
                      name="cantidad_biopsias"
                      label="CANTIDAD BIOPSIAS"
                      value={values.cantidad_biopsias}
                      type='Number'
                      onChange={onChange}
                      onInput={(e) => {
                        e.target.value = e.target.value <= 0 ? 1 : e.target.value;
                        e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 1)
                      }}
                      variant="outlined" />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      className={classes.textField}
                      name="costo_biopsias"
                      label="COSTO BIOPSIAS"
                      value={values.costo_biopsias}
                      type='Number'
                      onChange={onChangeCostoBiopsias}
                      onInput={(e) => {
                        e.target.value = e.target.value <= 0 ? 0 : e.target.value;
                        e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 4)
                      }}
                      variant="outlined" />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-hora">PATÓLOGO</InputLabel>
                      <Select
                        labelId="simple-select-outlined-patologo"
                        id="simple-select-outlined-patologo"
                        value={values.patologo}
                        onChange={onChange}
                        name="patologo"
                        label="PATÓLOGO" >
                        {patologos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                </Fragment> : ''
              }

              {
                /*
                values._id ?
                  <Grid item xs={12}>
                    <CheckCustom
                      checked={values.pagado}
                      onChange={onChangePagado}
                      disabled={values.pagado}
                      name="checkedG"
                      label="PAGADO" />
                  </Grid> : ''*/
              }
              <Grid item xs={12}>
                <h2 className={classes.labelItemRight}>PRECIO DE LA APLICACIÓN: {toFormatterCurrency(values.total_aplicacion)}</h2>
              </Grid>
              <Grid item xs={12}>
                <h1 className={classes.labelItemRight}>TOTAL DE LA CIRUGIA: {toFormatterCurrency(values.total)}</h1>
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickCrearCirugia(e, values)}
                  text="GUARDAR" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClose}
                  text="CANCELAR" />
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormCirugia;