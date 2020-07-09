import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import { findPagosByCita } from '../../../services';
import { addZero, toFormatterCurrency } from '../../../utils/utils';
import ModalFormPago2 from './ModalFormPago2';
import AssignmentIcon from '@material-ui/icons/Assignment';

const ModalPago2 = (props) => {
  const {
    open,
    onClose,
    sucursal,
    handleClickGuardarPago,
    cita,
    empleado,
    onGuardarModalPagos,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [pagos, setPagos] = useState([]);
  const [pago, setPago] = useState({});
  const [openModalPago, setOpenModalPago] = useState(false);
  const [openModalFactura, setOpenModalFactura] = useState(false);

  const handleClickBuscarRazonSocial = (event, rowData) => {
    setPago(rowData);
    setOpenModalFactura(true);
  }

  const columns = [
    { title: 'Fecha', field: 'fecha' },
    { title: 'Hora', field: 'hora' },
    { title: 'Metodo pago', field: 'metodo_pago.nombre' },
    { title: 'Cantidad', field: 'cantidad_moneda' },
    { title: 'Comision(%)', field: 'porcentaje_comision' },
    { title: 'Comision', field: 'comision_moneda' },
    { title: 'Total', field: 'total_moneda' },
    { title: 'Banco', field: 'banco.nombre' },
    { title: 'Tipo Tarjeta', field: 'tipo_tarjeta.nombre' },
    { title: 'Digitos', field: 'digitos' },
    { title: 'Pago confirmado', field: 'deposito_confirmado' },
    { title: 'Observaciones', field: 'observaciones' },
  ];

  const options = {
    headerStyle: {
      backgroundColor: '#5DADE2',
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    }
  }

  const localization = {
      header: { actions: 'Facturar' }
  };

  const actions = [
    rowData => ({
      disabled: rowData.factura,
      icon: AssignmentIcon,
      tooltip: rowData.factura ? 'Ya se genero factura' : 'Generar factura',
      onClick: handleClickBuscarRazonSocial
    }),
  ];

  const efectivoMetodoPagoId = process.env.REACT_APP_METODO_PAGO_EFECTIVO;

  useEffect(() => {
    const loadPagos = async () => {
      const response = await findPagosByCita(cita._id);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        response.data.forEach(item => {
          const fecha = new Date(item.fecha_pago);
          item.fecha = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth())}/${addZero(fecha.getFullYear())}`
          item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
          item.cantidad_moneda = toFormatterCurrency(item.cantidad);
          item.comision_moneda = toFormatterCurrency(item.comision);
          item.total_moneda = toFormatterCurrency(item.total);
          if (item.metodo_pago._id === efectivoMetodoPagoId) {
            item = {
              ...item,
              banco: { nombre: '-' },
              tipo_tarjeta: { nombre: '-' },
              digitos: '-'
            }
          }
        });
        setPagos(response.data);
      }
    }
    setIsLoading(true);

    loadPagos();

    setIsLoading(false);

  }, []);

  const loadPagos = async () => {
    const response = await findPagosByCita(cita._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      response.data.forEach(item => {
        const fecha = new Date(item.fecha_pago);
        item.fecha = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth())}/${addZero(fecha.getFullYear())}`
        item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
        item.comision_moneda = toFormatterCurrency(item.comision);
        item.total_moneda = toFormatterCurrency(item.total);
        if (item.metodo_pago._id === efectivoMetodoPagoId) {
          item = {
            ...item,
            banco: { nombre: '-' },
            tipo_tarjeta: { nombre: '-' },
            digitos: '-'
          }
        }
      });
      setPagos(response.data);
    }
  }

  /*const handleClickGuardar = async (event, rowData) => {
    setIsLoading(true);
    rowData.fecha_pago = new Date();
    onGuardarPago(rowData);
    setIsLoading(false);
  }*/

  const handleClickNewPago = () => {
    setOpenModalPago(true);
  }

  const handleClickCancelPago = () => {
    setOpenModalPago(false);
  }

  const handleCloseBuscarRazonSocial = () => {
    setOpenModalFactura(false);
  }

  return (
    <ModalFormPago2
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClickNewPago={handleClickNewPago}
      onClickCancelPago={handleClickCancelPago}
      openModalPago={openModalPago}
      onClickCancel={onClose}
      onClickGuardar={handleClickGuardarPago}
      isLoading={isLoading}
      pagos={pagos}
      pago={pago}
      columns={columns}
      options={options}
      actions={actions}
      localization={localization}
      cita={cita}
      empleado={empleado}
      sucursal={sucursal}
      onGuardarModalPagos={onGuardarModalPagos}
      titulo={`Pagos: ${cita.paciente.nombres} ${cita.paciente.apellidos}`}
      openModalFactura={openModalFactura}
      onCloseBuscarRazonSocial={handleCloseBuscarRazonSocial}
      loadPagos={loadPagos}
    />

  );
}

export default ModalPago2;