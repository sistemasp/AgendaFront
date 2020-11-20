import React, { useState, useEffect, Fragment } from 'react';
import { findPagosByTipoServicioAndServicio } from '../../../services';
import { addZero, toFormatterCurrency } from '../../../utils/utils';
import ModalFormPagos from './ModalFormPagos';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EditIcon from '@material-ui/icons/Edit';
import { findCirugiaByConsultaId } from '../../../services/cirugias';
import { findEsteticaByConsultaId } from '../../../services/estetica';

const ModalPagos = (props) => {
  const {
    open,
    onClose,
    sucursal,
    handleClickGuardarPago,
    servicio,
    setServicio,
    empleado,
    onGuardarModalPagos,
    tipoServicioId,
  } = props;

  const efectivoFormaPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
  const noPagaFormaPagoId = process.env.REACT_APP_FORMA_PAGO_NO_PAGA;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [pagos, setPagos] = useState([]);
  const [pago, setPago] = useState({});
  const [openModalPago, setOpenModalPago] = useState(false);
  const [openModalFactura, setOpenModalFactura] = useState(false);
  const [restante, setRestante] = useState(0);

  const handleClickBuscarRazonSocial = (event, rowData) => {
    setPago(rowData);
    setOpenModalFactura(true);
  }

  const handleOnClickEditarPago = (event, rowData) => {
    setPago(rowData);
    setOpenModalPago(true);
  }

  const columns = [
    { title: 'Fecha', field: 'fecha' },
    { title: 'Hora', field: 'hora' },
    { title: 'Metodo pago', field: 'forma_pago.nombre' },
    { title: 'Cantidad', field: 'cantidad_moneda' },
    { title: 'Descuento(%)', field: 'porcentaje_descuento' },
    { title: 'Descuento', field: 'descuento_moneda' },
    { title: 'Subtotal', field: 'subtotal_moneda' },
    { title: 'Total', field: 'total_moneda' },
    { title: 'Banco', field: 'banco_nombre' },
    { title: 'Tipo Tarjeta', field: 'tipo_tarjeta_nombre' },
    { title: 'Digitos', field: 'digitos_show' },
    { title: 'Pago confirmado', field: 'deposito_confirmado' },
    { title: 'Observaciones', field: 'observaciones' },
  ];

  const options = {
    headerStyle: {
      backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
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
      tooltip: rowData.factura ? 'YA SE GENERO FACTURA' : 'GENERAR FACTURA',
      onClick: handleClickBuscarRazonSocial
    }),
    {
      icon: EditIcon,
      tooltip: 'Editar pago',
      onClick: handleOnClickEditarPago
    }
  ];

  const loadPagos = async () => {
    let totalCE = 0;
    if (tipoServicioId === consultaServicioId) { // SI ES CONSULTA BUSCA CIRUGIA Y ESTETICAS 
      const resCirugias = await findCirugiaByConsultaId(servicio._id);
      if (`${resCirugias.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) { // BUSCA CIRUGIAS
        const cirugia = resCirugias.data;
        totalCE += cirugia.total ? Number(cirugia.total) : 0;
      }
      const resEstetica = await findEsteticaByConsultaId(servicio._id);
      if (`${resEstetica.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) { // BUSCA TOXINAS Y RELLENOS
        const estetica = resEstetica.data;
        totalCE += estetica.total ? Number(estetica.total) : 0;
      }
    }
    const response = await findPagosByTipoServicioAndServicio(tipoServicioId, servicio._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      let acomulado = 0;
      response.data.forEach(item => {
        const fecha = new Date(item.fecha_pago);
        item.fecha = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth())}/${addZero(fecha.getFullYear())}`
        item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
        item.descuento_moneda = toFormatterCurrency(item.descuento);
        item.subtotal_moneda = toFormatterCurrency((Number(item.cantidad) - Number(item.descuento)));
        item.comision_moneda = toFormatterCurrency(item.comision);
        item.total_moneda = toFormatterCurrency(item.total);
        item.banco_nombre = item.banco ? item.banco.nombre : '-';
        item.tipo_tarjeta_nombre = item.tipo_tarjeta ? item.tipo_tarjeta.nombre : '-';
        item.digitos_show = item.digitos ? item.digitos : '-';
        acomulado = Number(acomulado) + Number(item.cantidad);
      });
      setRestante(totalCE + Number(servicio.total ? servicio.total : servicio.precio) - Number(acomulado));
      servicio.pagos = response.data;
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

  useEffect(() => {
    setIsLoading(true);
    loadPagos();
    setIsLoading(false);
  }, []);

  return (
    <Fragment>
      <ModalFormPagos
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
        servicio={servicio}
        empleado={empleado}
        sucursal={sucursal}
        onGuardarModalPagos={onGuardarModalPagos}
        titulo={`PAGOS: ${servicio.paciente.nombres} ${servicio.paciente.apellidos}`}
        openModalFactura={openModalFactura}
        onCloseBuscarRazonSocial={handleCloseBuscarRazonSocial}
        loadPagos={loadPagos}
        restante={restante}
        tipoServicioId={tipoServicioId} />
    </Fragment>


  );
}

export default ModalPagos;