import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero, generateFolioCita } from '../../../../utils/utils';
import ModalFormImprimirPagoMedico from './ModalFormImprimirPagoMedico';
import { findConsultsByPayOfDoctor } from '../../../../services';

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
  const [isLoading, setIsLoading] = useState(true);

  const atendidoId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
  
  useEffect(() => {
		const loadConsultas = async () => {
      const date = new Date();
			const response = await findConsultsByPayOfDoctor(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id, medico._id, atendidoId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        await response.data.forEach(item => {
					item.folio = generateFolioCita(item);
				});
				setConsultas(response.data);
			}
			setIsLoading(false);
		}

		setIsLoading(true);
		loadConsultas();
		
	}, [sucursal, medico, atendidoId]);

  const handleClickImprimir = (e) => {

    setShow(false);
    setTimeout(() => { 
      window.print(); 
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

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
        onClickImprimir={handleClickImprimir}
        show={show} />
    </Fragment>

  );
}

export default ModalImprimirPagoMedico;