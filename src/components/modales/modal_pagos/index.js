import React, { useState, useEffect, Fragment } from 'react';
import { findPagosByTipoServicioAndServicio } from '../../../services';
import { addZero, toFormatterCurrency } from '../../../utils/utils';
import ModalFormPagos from './ModalFormPagos';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EditIcon from '@material-ui/icons/Edit';
import { findCirugiaByConsultaId } from '../../../services/cirugias';
import { findEsteticaByConsultaId } from '../../../services/esteticas';
import { findEsquemaById } from '../../../services/esquemas';

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

  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
  const efectivoFormaPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
  const noPagaFormaPagoId = process.env.REACT_APP_FORMA_PAGO_NO_PAGA;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [pagos, setPagos] = useState([]);
  const [pago, setPago] = useState({});
  const [esquema, setEsquema] = useState({});
  const [openModalPago, setOpenModalPago] = useState(false);
  const [openModalFactura, setOpenModalFactura] = useState(false);
  const [restante, setRestante] = useState(0);
  const [values, setValues] = useState({
    cantidad: servicio.precio,
    porcentaje_descuento_clinica: servicio.porcentaje_descuento_clinica ? servicio.porcentaje_descuento_clinica : 0,
    descuento_clinica: 0,
    descuento_dermatologo: 0,
    has_descuento_dermatologo: servicio.has_descuento_dermatologo,
    total: servicio.total,
  });

  const handleClickBuscarRazonSocial = (event, rowData) => {
    setPago(rowData);
    setOpenModalFactura(true);
  }

  const handleOnClickEditarPago = (event, rowData) => {
    setPago(rowData);
    setOpenModalPago(true);
  }

  const handleChangeFactura = () => {
    servicio.factura = !servicio.factura;
    setOpenModalFactura(true);
  }

  const columns = [
    { title: 'FECHA', field: 'fecha' },
    { title: 'HORA', field: 'hora' },
    { title: 'FORMA PAGO', field: 'forma_pago.nombre' },
    { title: 'CANTIDAD', field: 'cantidad_moneda' },
    { title: 'TOTAL', field: 'total_moneda' },
    { title: 'BANCO', field: 'banco_nombre' },
    { title: 'TIPO TARJETA', field: 'tipo_tarjeta_nombre' },
    { title: 'DIGITOS', field: 'digitos_show' },
    { title: 'PAGO CONFIRMADO', field: 'deposito_confirmado' },
    { title: 'OBSERVACIONES', field: 'observaciones' },
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
    header: { actions: 'FACTURAR' }
  };

  const actions = [
    {
      icon: EditIcon,
      tooltip: 'EDITAR PAGO',
      onClick: handleOnClickEditarPago
    }
  ];

  const loadPagos = async () => {
    let totalCE = 0;
    const response = await findPagosByTipoServicioAndServicio(tipoServicioId, servicio._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      let acomulado = 0;
      response.data.forEach(item => {
        const fecha = new Date(item.fecha_pago);
        item.fecha = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${addZero(fecha.getFullYear())}`
        item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
        item.cantidad_moneda = toFormatterCurrency(item.cantidad);
        item.comision_moneda = toFormatterCurrency(item.comision);
        item.total_moneda = toFormatterCurrency(item.total);
        item.banco_nombre = item.banco ? item.banco.nombre : '-';
        item.tipo_tarjeta_nombre = item.tipo_tarjeta ? item.tipo_tarjeta.nombre : '-';
        item.digitos_show = item.digitos ? item.digitos : '-';
        acomulado = Number(acomulado) + Number(item.cantidad);
      });
      setRestante(Number(values.total) - Number(acomulado));
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

  const handleCloseBuscarRazonSocial = (val) => {
    //servicio.factura = val;
    setOpenModalFactura(false);
  }

  const getMayorDescuento = () => {
    let porcentajeDescuento = 0;
    switch (servicio.servicio._id) {
      case servicioCirugiaId:
        porcentajeDescuento = esquema.porcentaje_cirugias;
        break;
      case servicioConsultaId:
        porcentajeDescuento = servicio.frecuencia._id === frecuenciaReconsultaId ? esquema.porcentaje_reconsulta : esquema.porcentaje_consulta;
        break;
      case servicioEsteticaId:
        porcentajeDescuento = esquema.porcentaje_dermocosmetica;
        break;
      case servicioAparatologiaId:
        porcentajeDescuento = esquema.porcentaje_laser;
        break;
    }

    return porcentajeDescuento;
  }

  const calcularTotal = (datos) => {
    const cantidad = Number(datos.cantidad);
    const descuento_clinica = cantidad * Number(datos.porcentaje_descuento_clinica) / 100;

    const descuento_dermatologo = datos.has_descuento_dermatologo
      ? (servicio.dermatologo._id !== dermatologoDirectoId
        ? (getMayorDescuento())
        : 0)
      : 0;
    const descuento_dermatologo_final = (descuento_dermatologo * (cantidad - descuento_clinica) / 100);
    let total = cantidad - descuento_clinica - descuento_dermatologo_final;

    let acomulado = 0;
    pagos.forEach(pago => {
      acomulado = Number(acomulado) + Number(pago.cantidad);
    });
    setRestante(servicio.precio - acomulado - descuento_clinica - descuento_dermatologo_final);

    servicio.has_descuento_dermatologo = datos.has_descuento_dermatologo;
    servicio.descuento_dermatologo = descuento_dermatologo;
    servicio.porcentaje_descuento_clinica = datos.porcentaje_descuento_clinica;
    servicio.descuento_clinica = descuento_clinica;
    servicio.total = total;

    setValues({
      cantidad: cantidad,
      descuento_clinica: descuento_clinica,
      descuento_dermatologo: descuento_dermatologo_final,
      has_descuento_dermatologo: datos.has_descuento_dermatologo,
      porcentaje_descuento_clinica: datos.porcentaje_descuento_clinica,
      total: total,
    });
  }

  const handleChangDescuentoDermatologo = (event) => {
    const datos = {
      ...values,
      has_descuento_dermatologo: !values.has_descuento_dermatologo,
    }
    calcularTotal(datos);
  }

  const handleChangeDescuento = (event) => {
    const datos = {
      ...values,
      porcentaje_descuento_clinica: event.target.value,
    }
    calcularTotal(datos);
  }

  const loadEsquema = async () => {
    const response = await findEsquemaById(servicio.dermatologo.esquema);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEsquema(response.data);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    loadPagos();
    loadEsquema();
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
        onChangeFactura={handleChangeFactura}
        loadPagos={loadPagos}
        restante={restante}
        onChangeDescuento={(e) => handleChangeDescuento(e)}
        onChangDescuentoDermatologo={(e) => handleChangDescuentoDermatologo(e)}
        tipoServicioId={tipoServicioId}
        values={values} />
    </Fragment>


  );
}

export default ModalPagos;