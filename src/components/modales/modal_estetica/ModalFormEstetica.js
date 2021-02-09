import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Grid } from '@material-ui/core';
import { Multiselect } from 'multiselect-react-dropdown';
import { toFormatterCurrency } from '../../../utils/utils';
import { ButtonCustom } from '../../basic/ButtonCustom';
import ModalPagos from '../modal_pagos';
import { CheckCustom } from '../../basic/CheckCustom';

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
  labelItemLeft: {
    height: '100%',
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'left',
    display: "flex",
    alignItems: "center",
  },
  labelItemRight: {
    height: '100%',
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'right',
    alignSelf: 'center',
    display: "flex",
    alignItems: "center",
  },
  labelItemCenter: {
    height: '100%',
    marginTop: '0px',
    marginBottom: '0px',
    alignSelf: 'center',
    textAlign: 'center',
    display: "flex",
    alignItems: "center",
  },
}));

const canceloStatusId = process.env.REACT_APP_CANCELO_STATUS_ID;
const noAsistioStatusId = process.env.REACT_APP_NO_ASISTIO_STATUS_ID;
const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;

const ModalFormEstetica = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    handleSubmit,
    onClose,
    onClickCrearEstetica,
    open,
    onChangeTotal,
    onChangePagado,
    sucursal,
    toxinasRellenos,
    materiales,
    onChangeToxinasRellenos,
    onChangeMateriales,
    onChangeItemUnidades,
    onChangeItemPrecio,
    openModalPagos,
    onCloseModalPagos,
    onGuardarModalPagos,
    consulta,
    empleado,
    tipoServicioId,
    estetica,
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
                <h1 className={classes.label}>TOXINAS Y RELLENOS</h1>
              </Grid>
              <Grid item xs={12}>
                <h2 className={classes.label}>{estetica.paciente_nombre} ({estetica.paciente.telefono})</h2>
              </Grid>
              <Grid item xs={12}>
                <h2 className={classes.label}>DERMATÓLOGO: {estetica.dermatologo.nombre}</h2>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="total"
                  label="PRECIO TOTAL"
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
                  options={toxinasRellenos} // Options to display in the dropdown
                  displayValue="nombre" // Property name to display in the dropdown options
                  onSelect={(e) => onChangeToxinasRellenos(e)} // Function will trigger on select event
                  onRemove={(e) => onChangeToxinasRellenos(e)} // Function will trigger on remove event
                  placeholder="TOXINAS Y RELLENOS"
                  selectedValues={values.toxinas_rellenos} // Preselected value to persist in dropdown
                />
              </Grid>
              <Grid item xs={3} >
                <h3 className={classes.labelItemLeft}>{`NOMBRE`}</h3>
              </Grid>
              <Grid item xs={3} >
                <h3 className={classes.labelItemCenter}> {`CANTIDAD UNIDADES`} </h3>
              </Grid>
              <Grid className={classes.labelItemLeft} item xs={3} >
                <h3 className={classes.labelItemCenter}>{`PRECIO POR UNIDAD`}</h3>
              </Grid>
              <Grid item xs={3} >
                <h3 className={classes.labelItemRight}> {`TOTAL`} </h3>
              </Grid>
              {
                values.toxinas_rellenos ?
                  values.toxinas_rellenos.map((item, index) =>
                    <Fragment>
                      <Grid item xs={3} >
                        <h3 className={classes.labelItemLeft}>{item.nombre}</h3>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          className={classes.labelItemCenter}
                          name={item.unidades}
                          label={`UNIDADES`}
                          value={item.unidades}
                          type='Number'
                          onChange={(e) => onChangeItemUnidades(e, index)}
                          onInput={(e) => {
                            e.target.value = e.target.value < 0 ? 0 : e.target.value;
                            e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 3)
                          }}
                          variant="outlined" />
                      </Grid>
                      <Grid item xs={3} >
                        <h3 className={classes.labelItemCenter}>{toFormatterCurrency(item.precio)}</h3>
                      </Grid>
                      <Grid item xs={3} >
                        <h3 className={classes.labelItemRight}>{toFormatterCurrency(item.unidades * item.precio)}</h3>
                      </Grid>
                    </Fragment>) : ''
              }

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

              {
                values._id ?
                  <Grid item xs={12}>
                    <CheckCustom
                      checked={values.pagado}
                      onChange={onChangePagado}
                      disabled={values.pagado}
                      name="checkedG"
                      label="PAGADO" />
                  </Grid> : ''
              }
              <Grid item xs={12}>
                <h2 className={classes.labelItemRight}>PRECIO ACPLICACIÓN: {toFormatterCurrency(values.total_aplicacion)}</h2>
              </Grid>
              <Grid item xs={12}>
                <h1 className={classes.labelItemRight}>TOTAL: {toFormatterCurrency(values.total)}</h1>
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickCrearEstetica(e, values)}
                  text='GUARDAR' />
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

export default ModalFormEstetica;