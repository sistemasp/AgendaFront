import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero, generateFolio } from '../../../../utils/utils';
import ModalFormImprimirPagoMedico from './ModalFormImprimirPagoMedico';
import {
  findConsultsByPayOfDoctorTurno,
  findCirugiasByPayOfDoctorTurno,
  findDatesByPayOfDoctorTurno,
  findEsteticasByPayOfDoctorTurno,
  findConsultsByPayOfDoctorTurnoFrecuencia,
  createPagoMedico,
  showTodayPagoMedicoBySucursalTurno,
  createEgreso,
  findTipoEgresoById,
} from '../../../../services';

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
  const [citas, setCitas] = useState([]);
  const [esteticas, setEsteticas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [turno, setTurno] = useState('m');
  const [pagoMedico, setPagoMedico] = useState();

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

  const loadConsultas = async () => {
    const date = new Date();
    const response = await findConsultsByPayOfDoctorTurno(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, atendidoId, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setConsultas(response.data);
    }
  }

  const loadConsultasPrimeraVez = async () => {
    const date = new Date();
    const response = await findConsultsByPayOfDoctorTurnoFrecuencia(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, atendidoId, turno, primeraVezFrecuenciaId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setConsultasPrimeraVez(response.data);
    }
  }

  const loadConsultasReconsulta = async () => {
    const date = new Date();
    const response = await findConsultsByPayOfDoctorTurnoFrecuencia(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, atendidoId, turno, reconsultaFrecuenciaId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setConsultasReconsultas(response.data);
    }
  }

  const loadCirugias = async () => {
    const date = new Date();
    const response = await findCirugiasByPayOfDoctorTurno(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCirugias(response.data);
    }
  }

  const loadCitas = async () => {
    const date = new Date();
    const response = await findDatesByPayOfDoctorTurno(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, atendidoId, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCitas(response.data);
    }
  }

  const loadEsteticas = async () => {
    const date = new Date();
    const response = await findEsteticasByPayOfDoctorTurno(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEsteticas(response.data);
    }
  }

  const findPagoToday = async () => {
    const response = await showTodayPagoMedicoBySucursalTurno(medico._id, sucursal._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const pagoMedico = response.data;
      setPagoMedico(pagoMedico);
      if (pagoMedico) {
        setConsultas(pagoMedico.consultas);
      } else {
        await loadConsultas();
      }
      await loadCirugias();
      await loadCitas();
      await loadEsteticas();
      await loadConsultasPrimeraVez();
      await loadConsultasReconsulta();
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
    citas.forEach(cita => {
      let comisionMedico = 0;
      cita.areas.forEach(area => {
        console.log("FSFSDFSDF", sucursal._id !== manuelAcunaSucursalId, manuelAcunaSucursalId ? area.comision_realizado : area.comision_realizado_ma);

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
    });

    // TOTAL DE LAS ESTETICAS
    esteticas.map(estetica => {
      const pagoMedico = Number(estetica.precio) * Number(medico.porcentaje_estetica) / 100;
      total += Number(pagoMedico);
    });

    const date = new Date();
    const pagoMedico = {
      fecha_pago: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      medico: medico,
      consultas: consultas,
      cirugias: cirugias,
      tratamientos: citas,
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

      const create_date = new Date();
      create_date.setHours(create_date.getHours() - 5);

      const egreso = {
        create_date: create_date,
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
    handleObtenerInformacion();
  };

  const handleObtenerInformacion = async () => {
    await findPagoToday();
  };

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
  };

  useEffect(() => {
    setIsLoading(true);
    handleObtenerInformacion();
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
            //consultas={consultas}
            consultasPrimeraVez={consultasPrimeraVez}
            consultasReconsultas={consultasReconsultas}
            cirugias={cirugias}
            citas={citas}
            esteticas={esteticas}
            turno={turno}
            pagoMedico={pagoMedico}
            onClickImprimir={handleClickImprimir}
            onCambioTurno={() => handleCambioTurno()}
            onObtenerInformacion={() => handleObtenerInformacion()}
            onClickPagar={() => handleClickPagar()}
            show={show} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalImprimirPagoMedico;