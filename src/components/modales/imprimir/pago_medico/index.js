import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero, generateFolioCita } from '../../../../utils/utils';
import ModalFormImprimirPagoMedico from './ModalFormImprimirPagoMedico';
import { findConsultsByPayOfDoctorTurno, findCirugiasByPayOfDoctorTurno } from '../../../../services';

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
  } = props;

  const [show, setShow] = useState(true);
  const [consultas, setConsultas] = useState([]);
  const [cirugias, setCirugias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [turno, setTurno] = useState('m');

  const atendidoId = process.env.REACT_APP_ATENDIDO_STATUS_ID;

  useEffect(() => {
    const loadConsultas = async () => {
      const date = new Date();
      const response = await findConsultsByPayOfDoctorTurno(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, atendidoId, turno);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setConsultas(response.data);
      }
    }

    const loadCirugias = async () => {
      const date = new Date();
      const response = await findCirugiasByPayOfDoctorTurno(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, turno);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setCirugias(response.data);
      }
      setIsLoading(false);
    }

    setIsLoading(true);
    loadConsultas();
    loadCirugias();

  }, [sucursal, medico, atendidoId, turno]);

  const loadConsultas = async () => {
    const date = new Date();
    const response = await findConsultsByPayOfDoctorTurno(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, atendidoId, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setConsultas(response.data);
    }
  }

  const loadCirugias = async () => {
    const date = new Date();
    const response = await findCirugiasByPayOfDoctorTurno(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCirugias(response.data);
    }
    setIsLoading(false);
  }

  const handleClickImprimir = (e) => {

    setShow(false);
    setTimeout(() => {
      window.print();
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
    // setTimeout(() => {
      loadConsultas();
      loadCirugias();
    //}, 15);

  };

  return (
    <Fragment>
      <ModalFormImprimirPagoMedico
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={onClose}
        medico={medico}
        sucursal={sucursal}
        consultas={consultas}
        cirugias={cirugias}
        turno={turno}
        onClickImprimir={handleClickImprimir}
        onCambioTurno={handleCambioTurno}
        show={show} />
    </Fragment>

  );
}

export default ModalImprimirPagoMedico;