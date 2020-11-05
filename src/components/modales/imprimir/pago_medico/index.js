import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero, generateFolio } from '../../../../utils/utils';
import ModalFormImprimirPagoMedico from './ModalFormImprimirPagoMedico';
import {
  findCirugiasByPayOfDoctorTurno,
  findDatesByPayOfDoctorTurno,
  findEsteticasByPayOfDoctorTurno,
  createPagoMedico,
  showTodayPagoMedicoBySucursalTurno,
  createEgreso,
} from '../../../../services';
import {
  findConsultsByPayOfDoctorHoraAplicacion,
  findConsultsByPayOfDoctorHoraAplicacionFrecuencia,
} from '../../../../services/consultas';
import { showCorteTodayBySucursalAndTurno } from '../../../../services/corte';
import { findFacialesByPayOfDoctorHoraAplicacion } from '../../../../services/faciales';
import { findLasersByPayOfDoctorHoraAplicacion } from '../../../../services/laser';
import { findAparatologiasByPayOfDoctorHoraAplicacion } from '../../../../services/aparatolgia';
import { findCirugiasByPayOfDoctorHoraAplicacion } from '../../../../services/cirugias';
import { findEsteticasByPayOfDoctorHoraAplicacion } from '../../../../services/estetica';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalImprimirPagoMedico = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    medico,
    sucursal,
    empleado,
    setOpenAlert,
    setMessage,
  } = props;

  const [show, setShow] = useState(true);
  const [consultas, setConsultas] = useState([]);
  const [consultasPrimeraVez, setConsultasPrimeraVez] = useState([]);
  const [consultasReconsultas, setConsultasReconsultas] = useState([]);
  const [cirugias, setCirugias] = useState([]);
  const [faciales, setFaciales] = useState([]);
  const [lasers, setLasers] = useState([]);
  const [aparatologias, setAparatologias] = useState([]);
  const [esteticas, setEsteticas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [turno, setTurno] = useState('m');
  const [pagoMedico, setPagoMedico] = useState();
  const [corte, setCorte] = useState();

  const atendidoId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
  const primeraVezFrecuenciaId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
  const reconsultaFrecuenciaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const revisadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
  const derivadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const realizadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
  const noAplicaTipoCitaId = process.env.REACT_APP_TIPO_CITA_NO_APLICA_ID;
  const pagoMedicoTipoEgresoId = process.env.REACT_APP_TIPO_EGRESO_PAGO_MEDICO_ID;
  const efectivoMetodoPagoId = process.env.REACT_APP_METODO_PAGO_EFECTIVO;
  const manuelAcunaSucursalId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;

  const loadConsultas = async (hora_apertura, hora_cierre) => {
    const response = await findConsultsByPayOfDoctorHoraAplicacion(sucursal._id, medico._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setConsultas(response.data);
    }
  }

  const loadConsultasPrimeraVez = async (hora_apertura, hora_cierre) => {
    const response = await findConsultsByPayOfDoctorHoraAplicacionFrecuencia(sucursal._id, medico._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), primeraVezFrecuenciaId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setConsultasPrimeraVez(response.data);
    }
  }

  const loadConsultasReconsulta = async (hora_apertura, hora_cierre) => {
    const date = new Date();
    const response = await findConsultsByPayOfDoctorHoraAplicacionFrecuencia(sucursal._id, medico._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), reconsultaFrecuenciaId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setConsultasReconsultas(response.data);
    }
  }

  const loadCirugias = async (hora_apertura, hora_cierre) => {
    const response = await findCirugiasByPayOfDoctorHoraAplicacion(sucursal._id, medico._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCirugias(response.data);
    }
  }

  const loadFaciales = async (hora_apertura, hora_cierre) => {
    const response = await findFacialesByPayOfDoctorHoraAplicacion(sucursal._id, medico._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setFaciales(response.data);
    }
  }

  const loadLasers = async (hora_apertura, hora_cierre) => {
    const response = await findLasersByPayOfDoctorHoraAplicacion(sucursal._id, medico._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setLasers(response.data);
    }
  }

  const loadAparatologias = async (hora_apertura, hora_cierre) => {
    const response = await findAparatologiasByPayOfDoctorHoraAplicacion(sucursal._id, medico._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setAparatologias(response.data);
    }
  }

  const loadEsteticas = async (hora_apertura, hora_cierre) => {
    const response = await findEsteticasByPayOfDoctorHoraAplicacion(sucursal._id, medico._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEsteticas(response.data);
    }
  }

  const findPagoToday = async (hora_apertura, hora_cierre) => {
    const response = await showTodayPagoMedicoBySucursalTurno(medico._id, sucursal._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const pagoMedico = response.data;
      setPagoMedico(pagoMedico);
      if (pagoMedico) {
        setConsultas(pagoMedico.consultas);
      } else {
        await loadConsultas(hora_apertura, hora_cierre);
      }
      await loadCirugias(hora_apertura, hora_cierre);
      await loadFaciales(hora_apertura, hora_cierre);
      await loadLasers(hora_apertura, hora_cierre);
      await loadAparatologias(hora_apertura, hora_cierre);
      await loadEsteticas(hora_apertura, hora_cierre);
      await loadConsultasPrimeraVez(hora_apertura, hora_cierre);
      await loadConsultasReconsulta(hora_apertura, hora_cierre);
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

    // TOTAL DE LAS CONSULTAS 
    consultas.forEach(consulta => {
      let totalPagos = 0;
      consulta.pagos.forEach(pago => {
        totalPagos += Number(pago.total);
      })
      const pagoMedico = Number(totalPagos) * Number(medico.porcentaje) / 100;
      total += Number(pagoMedico);
    });

    // TOTAL DE LAS CIRUGIAS
    cirugias.forEach(cirugia => {
      const pagoMedico = Number(cirugia.precio) * Number(medico.porcentaje) / 100;
      total += Number(pagoMedico);
    });

    // TOTAL DE LOS TRATAMIENTOS
    /*citas.forEach(cita => {
      let comisionMedico = 0;
      cita.areas.forEach(area => {
        switch (cita.tipo_cita) {
          case revisadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_revisado : area.comision_revisado_ma);
            break;
          case derivadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_derivado : area.comision_derivado_ma);
            break;
          case realizadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_realizado : area.comision_realizado_ma);
            break;
          case noAplicaTipoCitaId:
            comisionMedico += Number(0);
            break;
        }
      });
      const pagoMedico = comisionMedico;
      total += Number(pagoMedico);
    });*/

    // TOTAL DE LOS FACIALES
    faciales.forEach(facial => {
      let comisionMedico = 0;
      facial.areas.forEach(area => {
        switch (facial.tipo_cita._id) {
          case revisadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_revisado : area.comision_revisado_ma);
            break;
          case derivadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_derivado : area.comision_derivado_ma);
            break;
          case realizadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_realizado : area.comision_realizado_ma);
            break;
          case noAplicaTipoCitaId:
            comisionMedico += Number(0);
            break;
        }
      });
      const pagoMedico = comisionMedico;
      total += Number(pagoMedico);
    });

    // TOTAL DE LOS LASERS
    lasers.forEach(laser => {
      let comisionMedico = 0;
      laser.areas.forEach(area => {
        switch (laser.tipo_cita._id) {
          case revisadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_revisado : area.comision_revisado_ma);
            break;
          case derivadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_derivado : area.comision_derivado_ma);
            break;
          case realizadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_realizado : area.comision_realizado_ma);
            break;
          case noAplicaTipoCitaId:
            comisionMedico += Number(0);
            break;
        }
      });
      const pagoMedico = comisionMedico;
      total += Number(pagoMedico);
    });

    // TOTAL DE LAS APARATOLOGIAS
    aparatologias.forEach(aparatologia => {
      let comisionMedico = 0;
      aparatologia.areas.forEach(area => {
        switch (aparatologia.tipo_cita._id) {
          case revisadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_revisado : area.comision_revisado_ma);
            break;
          case derivadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_derivado : area.comision_derivado_ma);
            break;
          case realizadoTipoCitaId:
            comisionMedico += Number(sucursal._id !== manuelAcunaSucursalId ? area.comision_realizado : area.comision_realizado_ma);
            break;
          case noAplicaTipoCitaId:
            comisionMedico += Number(0);
            break;
        }
      });
      const pagoMedico = comisionMedico;
      total += Number(pagoMedico);
    });

    // TOTAL DE LAS ESTETICAS
    esteticas.map(estetica => {
      const pagoMedico = Number(estetica.precio) * Number(medico.porcentaje_estetica) / 100;
      total += Number(pagoMedico);
    });

    const pagoMedico = {
      fecha_pago: new Date(),
      medico: medico,
      consultas: consultas,
      cirugias: cirugias,
      faciales: faciales,
      lasers: lasers,
      aparatologias: aparatologias,
      esteticas: esteticas,
      sucursal: sucursal._id,
      turno: turno,
      retencion: (total / 2),
      total: total,
      pagado: true,
    }

    const response = await createPagoMedico(pagoMedico);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const data = response.data;
      if (data._id) {
        //setOpenAlert(true);
        //setMessage('El pago se genero correctamente');
      }

      const egreso = {
        create_date: new Date(),
        hora_aplicacion: new Date(),
        tipo_egreso: pagoMedicoTipoEgresoId,
        recepcionista: empleado,
        concepto: medico.nombre,
        cantidad: data.retencion,
        sucursal: sucursal._id,
        metodo_pago: efectivoMetodoPagoId,
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
          <ModalFormImprimirPagoMedico
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            medico={medico}
            sucursal={sucursal}
            corte={corte}
            consultasPrimeraVez={consultasPrimeraVez}
            consultasReconsultas={consultasReconsultas}
            cirugias={cirugias}
            faciales={faciales}
            lasers={lasers}
            aparatologias={aparatologias}
            esteticas={esteticas}
            turno={turno}
            pagoMedico={pagoMedico}
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

export default ModalImprimirPagoMedico;