import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import {
  createEgreso,
} from '../../../../services/egresos';
import { showCorteTodayBySucursalAndTurno } from '../../../../services/corte';
import {
  indCirugiasByPayOfDoctorHoraAplicacionPA,
  findCirugiasByPayOfPatologoHoraAplicacion,
  updateCirugia
} from '../../../../services/cirugias';
import ModalFormImprimirPagoPatologo from './ModalFormImprimirPagoPatologo';
import { createPagoPatologo, showTodayPagoPatologoBySucursalTurno } from '../../../../services/pago_patologo';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalImprimirPagoPatologo = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    patologo,
    sucursal,
    empleado,
    setOpenAlert,
    setMessage,
  } = props;

  const [show, setShow] = useState(true);
  const [cirugias, setCirugias] = useState([]);
  const [biopsias, setBiopsias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [turno, setTurno] = useState('m');
  const [pagoDermatologo, setPagoDermatologo] = useState();
  const [corte, setCorte] = useState();

  const pagoPatologoTipoEgresoId = process.env.REACT_APP_TIPO_EGRESO_PAGO_PATOLOGO_ID;
  const efectivoMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;

  const loadCirugias = async (hora_apertura, hora_cierre) => {
    const response = await findCirugiasByPayOfPatologoHoraAplicacion(sucursal._id, patologo._id, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const cirugias = response.data;
      cirugias.forEach(cirugia => {
        setBiopsias([...biopsias, ...cirugia.biopsias]);
      });
      setCirugias(cirugias);
    }
  }

  const loadCirugiasCPA = async (hora_apertura, hora_cierre) => {
    /*const response = await findCirugiasByPayOfDoctorHoraAplicacionPA(sucursal._id, patologo._id, canceladoCPId, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCirugiasPA(response.data);
    }*/
  }

  const findPagoToday = async (hora_apertura, hora_cierre) => {
    const response = await showTodayPagoPatologoBySucursalTurno(patologo._id, sucursal._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const pagoDermatologo = response.data;
      setPagoDermatologo(pagoDermatologo);
      if (pagoDermatologo) {
      } else {
      }
      await loadCirugias(hora_apertura, hora_cierre);
      await loadCirugiasCPA(hora_apertura, hora_cierre);
      setIsLoading(false);
    }
  }

  const handleClickImprimir = (e) => {
    setShow(false);
    setTimeout(() => {
      window.print();
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

  const handleClickPagar = async () => {
    setIsLoading(true);
    let total = 0;

    // TOTAL DE LAS CIRUGIAS
    cirugias.forEach(async (cirugia) => {
      const pagoPatologo = Number(cirugia.costo_biopsias);
      cirugia.pago_patologo = pagoPatologo;
      updateCirugia(cirugia._id, cirugia)
      total += Number(pagoPatologo);
    });

    const pagoPatologo = {
      fecha_pago: new Date(),
      patologo: patologo,
      biopsias: biopsias,
      sucursal: sucursal._id,
      turno: turno,
      retencion: (patologo.pago_completo ? 0 : total),
      total: (patologo.pago_completo ? total : 0),
      pagado: true,
    }


    const response = await createPagoPatologo(pagoPatologo);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const data = response.data;

      const egreso = {
        create_date: new Date(),
        hora_aplicacion: corte.create_date,
        tipo_egreso: pagoPatologoTipoEgresoId,
        recepcionista: empleado,
        turno: corte.turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
        concepto: patologo.nombre,
        cantidad: data.total,
        retencion: data.retencion,
        sucursal: sucursal._id,
        forma_pago: efectivoMetodoPagoId,
      }

      const resp = await createEgreso(egreso);
      if (`${resp.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setIsLoading(false);
      }
    }

    findCorte();
  };

  const handleObtenerInformacion = async (corte) => {
    await findPagoToday(corte.hora_apertura, corte.hora_cierre);
  };

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
  };

  const findCorte = async () => {
    const response = await showCorteTodayBySucursalAndTurno(sucursal._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCorte(response.data);
      handleObtenerInformacion(response.data);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    findCorte();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormImprimirPagoPatologo
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            patologo={patologo}
            sucursal={sucursal}
            corte={corte}
            cirugias={cirugias}
            turno={turno}
            pagoDermatologo={pagoDermatologo}
            onClickImprimir={handleClickImprimir}
            onCambioTurno={() => handleCambioTurno()}
            onObtenerInformacion={() => handleObtenerInformacion()}
            findCorte={findCorte}
            onClickPagar={() => handleClickPagar()}
            show={show}
            empleado={empleado} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalImprimirPagoPatologo;