import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid } from '@material-ui/core';
import { ButtonCustom } from "../../basic/ButtonCustom";
import { CheckCustom } from '../../basic/CheckCustom';
import TableComponent from '../../table/TableComponent';
import ModalPago from '../modal_pago';
import ModalBuscarRazonSocial from '../modal_buscar_razon_social';
import { toFormatterCurrency } from '../../../utils/utils';

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
    width: '95%',
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

const ModalFormPagos = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    pago,
    pagos,
    titulo,
    isValid,
    onClickCancel,
    onClickGuardar,
    open,
    columns,
    options,
    openModalPago,
    onClickNewPago,
    onClickCancelPago,
    loadPagos,
    servicio,
    empleado,
    sucursal,
    onGuardarModalPagos,
    openModalFactura,
    onCloseBuscarRazonSocial,
    actions,
    restante,
    tipoServicioId,
    onChangeFactura,
    onChangeDescuento,
    onChangDescuentoDermatologo,
    values,
  } = props;

  return (
    <div>
      {
        openModalPago ?
          <ModalPago
            open={openModalPago}
            onClose={onClickCancelPago}
            servicio={servicio}
            pago={pago}
            empleado={empleado}
            sucursal={sucursal}
            loadPagos={loadPagos}
            restante={restante}
            tipoServicioId={tipoServicioId} />
          : ''
      }
      {
        openModalFactura ?
          <ModalBuscarRazonSocial
            open={openModalFactura}
            onClose={onCloseBuscarRazonSocial}
            pago={pago}
            servicio={servicio}
          /> : ''
      }
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={true}>
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={onClickNewPago}
                text='AGREGAR PAGO' />
            </Grid>

            <Grid item xs={true} sm={true}>
              <TextField
                className={classes.textField}
                name="porcentaje_descuento_clinica"
                label="% DESCUENTO"
                value={values.porcentaje_descuento_clinica}
                onChange={onChangeDescuento}
                type='Number'

                onInput={(e) => {
                  e.target.value = e.target.value > 100 ? 100 : e.target.value;
                  e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 5)
                }}
                variant="outlined" />
            </Grid>

            <Grid item xs={true} sm={true}>
              <CheckCustom
                checked={values.has_descuento_dermatologo}
                onChange={onChangDescuentoDermatologo}
                name="checkedC"
                label="DESCUENTO DERMATÓLOGO" />
            </Grid>

            <Grid item xs={true} sm={true}>
              <CheckCustom
                checked={servicio.factura}
                onChange={onChangeFactura}
                disabled={servicio.factura}
                name="checkedF"
                label="REQUIERE FACTURA"
              />
            </Grid>
          </Grid>
          <TableComponent
            titulo={titulo}
            columns={columns}
            data={pagos}
            options={options}
            actions={actions}
            localization={
              {
                header: {
                  actions: 'Factura'
                }
              }
            } />

          <Grid container xs={12}>
            <Grid item xs={true} sm={true}>
              <h1>{`PRECIO: ${toFormatterCurrency(servicio.precio)}`}</h1>
            </Grid>
            <Grid item xs={true} sm={true}>
              <h1>{`TOTAL: ${toFormatterCurrency(values.total)}`}</h1>
            </Grid>
            <Grid item xs={true} sm={true}>
              <h1>{`RESTANTE: ${toFormatterCurrency(restante)}`}</h1>
            </Grid>
          </Grid>

          <Grid container xs={12}>
            {
              //!servicio.pagado ?
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onGuardarModalPagos(servicio)}
                  disabled={pagos == ![]}
                  text='Guardar' />
              </Grid> //: ''
            }
            <Grid item xs={12} sm={6}>
              <Button
                className={classes.button}
                color="secondary"
                variant="contained"
                onClick={onClickCancel} >
                {!servicio.pagado ? 'Cancelar' : 'Salir'}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormPagos;