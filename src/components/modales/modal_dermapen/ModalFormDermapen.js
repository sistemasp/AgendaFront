import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Divider } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
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

const ModalFormDermapen = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    handleSubmit,
    onClose,
    onClickCrearCirugia,
    open,
    medicos,
    onChangeDoctors,
    sucursal,
    materiales,
    onChangeMateriales,
    onChangeItemPrecio,
    dataComplete,
    onChangeBiopsia,
    onClickAgendar,
    onChange,
    onChangeFecha,
    onChangeHora,
    openModalPagos,
    onCloseModalPagos,
    onGuardarModalPagos,
    consulta,
    empleado,
    tipoServicioId,
    disableDate,
    horarios,
    paciente,
  } = props;

  console.log("DERADHIAD", materiales);
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
                <h1 className={classes.label}>DERMAPEN</h1>
              </Grid>
              <Grid item xs={12}>
          <h2 className={classes.label}>{`${paciente.nombres} ${paciente.apellidos}`}</h2>
              </Grid>
              <Grid item xs={12} >
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-hora">Medico</InputLabel>
                  <Select
                    labelId="simple-select-outlined-medico"
                    id="simple-select-outlined-medico"
                    value={values.medico}
                    onChange={onChangeDoctors}
                    label="Medico" >
                    {medicos.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid
                    container
                    justify="center"
                    alignItems="center" >
                    <KeyboardDatePicker
                      className={classes.button}
                      disableToolbar
                      //disablePast
                      autoOk
                      disabled={disableDate}
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
                      invalidDateMessage='Selecciona una fecha' />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-hora">HORA</InputLabel>
                  <Select
                    labelId="simple-select-outlined-hora"
                    id="simple-select-outlined-hora"
                    value={values.hora}
                    onChange={onChangeHora}
                    disabled={!values.fecha_hora}
                    label="Hora" >
                    {console.log("HOFOASFHOAFA", horarios)}
                    {horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} >
                <Multiselect
                  options={materiales} // Options to display in the dropdown
                  displayValue="nombre" // Property name to display in the dropdown options
                  onSelect={(e) => onChangeMateriales(e)} // Function will trigger on select event
                  onRemove={(e) => onChangeMateriales(e)} // Function will trigger on remove event
                  placeholder="SELECCIONA MATERIALES"
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

              <Grid item xs={12}>
                <h2 className={classes.labelItemRight}>PRECIO DERMAPEN: {toFormatterCurrency(values.precio)}</h2>
              </Grid>
              <Grid item xs={12}>
                <h1 className={classes.labelItemRight}>TOTAL A PAGAR: {toFormatterCurrency(values.total)}</h1>
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickAgendar(values)}
                  text='AGENDAR' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClose}
                  text='CANCELAR' />
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormDermapen;