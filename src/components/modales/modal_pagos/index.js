import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import { updateSurgery, findSurgeryBySucursalIdAndFree, updateConsult, showAllBanco, showAllMetodoPago, showAllTipoTarjeta, findHistoricByPaciente, findPagoByIds } from '../../../services';
import { addZero, toFormatterCurrency } from '../../../utils/utils';
import ModalFormPagos from './ModalFormPagos';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos")
});

const ModalPagos = (props) => {
  const {
    open,
    onClose,
    paciente,
    handleClickGuardarPago,
    openModalPago,
    setOpenModalPago,
    pagosIds,
  } = props;

  const [pagos, setPagos] = useState([]);

  const columns = [
    { title: 'Fecha', field: 'fecha_show' },
    { title: 'Hora', field: 'hora' },
    { title: 'Metodo pago', field: 'servicio.nombre' },
    { title: 'Cantidad', field: 'show_tratamientos' },
    { title: 'Comision(%)', field: 'numero_sesion' },
    { title: 'Comision', field: 'tipo_cita.nombre' },
    { title: 'Total', field: 'status.nombre' },
    { title: 'Banco', field: 'sucursal.nombre'},
    { title: 'Tipo Tarjeta', field: 'sucursal.nombre'},
    { title: 'Digitos', field: 'precio_moneda' },
    { title: 'Factura', field: 'precio_moneda' },
    { title: 'Pago confirmado', field: 'precio_moneda' },
    { title: 'Observaciones', field: 'precio_moneda' },
  ];

  const options = {
    headerStyle: {
        backgroundColor: '#5DADE2',
        color: '#FFF',
        fontWeight: 'bolder',
        fontSize: '18px'
    }
  }

  console.log("PAGOS IDS:", pagosIds);

  useEffect(async() => {
    const loadPagos = async() => {
      const response = await findPagoByIds(pagosIds ? pagosIds : '5efb52c3d82d00000871ced7');
      if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
        setPagos(response.data);
      }
    }

    await loadPagos();

  }, [pagosIds]);

  const loadPagos = async() => {
    const response = await findPagoByIds(pagosIds ? pagosIds : '5efb52c3d82d00000871ced7');
    if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
      setPagos(response.data);
    }
  }

  const handleClickNewPago = () => {
    setOpenModalPago(true);
  }

  const handleClickCancelPago = () => {
    setOpenModalPago(false);
  }

  return (
    <ModalFormPagos
        open={open}
        openModalPago={openModalPago}
        onClickCancel={onClose}
        onClickNewPago={handleClickNewPago}
        onClickCancelPago={handleClickCancelPago}
        pagos={pagos}
        columns={columns}
        options={options}
        handleClickGuardarPago={handleClickGuardarPago}
        loadPagos={loadPagos}
        titulo={`Pagos: ${paciente.nombres} ${paciente.apellidos}`}/>
  );
}

export default ModalPagos;