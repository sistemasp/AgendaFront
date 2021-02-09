import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { DermatologosContainer } from './dermatologos';
import { findEmployeesByRolId } from '../../../services';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import PaymentIcon from '@material-ui/icons/Payment';
import { addZero } from '../../../utils/utils';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	}
}));

const Dermatologos = (props) => {

	const classes = useStyles();

	const {
		sucursal,
		empleado,
	} = props;

	const [openPagoDermatologo, setOpenPagoDermatologo] = useState(false);
	const [openPagoPatologo, setOpenPagoPatologo] = useState(false);
	const [openHistoric, setOpenHistoric] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [dermatologos, setDermatologos] = useState([]);
	const [patologos, setPatologos] = useState([]);
	const [dermatologo, setDermatologo] = useState({});
	const [patologo, setPatologo] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const columnsDermatologos = [
		{ title: 'NOMBRE', field: 'nombre' },
		{ title: 'CÉDULA PROFESIONAL', field: 'cedula' },
		{ title: 'FECHA INGRESO', field: 'fecha_ingreso_show' },
		{ title: 'FECHA BAJA', field: 'fecha_baja_show' },
	];

	const columnsPatologos = [
		{ title: 'NOMBRE', field: 'nombre' },
		{ title: 'CÉDULA PROFESIONAL', field: 'cedula' },
		{ title: 'FECHA INGRESO', field: 'fecha_ingreso_show' },
		{ title: 'FECHA BAJA', field: 'fecha_baja_show' },
	];

	const optionsDermatologos = {
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';'
	}

	const optionsPatologos = {
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';'
	}

	const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
	const patologoRolId = process.env.REACT_APP_PATOLOGO_ROL_ID;

	const handleClose = () => {
		setDermatologo({});
		setPatologo({});
		setOpenPagoDermatologo(false);
		setOpenPagoPatologo(false);
		setOpenHistoric(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	/*
	const handleClickHistorico = (event, rowData) => {
		setDermatologo(rowData);
		setOpenHistoric(true);
	}*/

	const handleClickGenerarPagoDermatologo = (event, rowData) => {
		setDermatologo(rowData);
		setOpenPagoDermatologo(true);
	}

	const handleClickGenerarPagoPatologo = (event, rowData) => {
		setPatologo(rowData);
		setOpenPagoPatologo(true);
	}


	const actionsDermatologo = [
		{
			icon: PaymentIcon,
			tooltip: 'GENERAR PAGO',
			onClick: handleClickGenerarPagoDermatologo
		},
		/*{
			icon: HistoryIcon,
			tooltip: 'Historial de pagos',
			onClick: handleClickHistorico
		}*/
	];

	const actionsPatologos = [
		{
			icon: PaymentIcon,
			tooltip: 'GENERAR PAGO',
			onClick: handleClickGenerarPagoPatologo
		},
		/*{
			icon: HistoryIcon,
			tooltip: 'Historial de pagos',
			onClick: handleClickHistorico
		}*/
	];

	const loadDermatologos = async () => {
		const response = await findEmployeesByRolId(dermatologoRolId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				const fecha_ingreso = new Date(item.fecha_ingreso);
				const fecha_ingreso_show = `${addZero(fecha_ingreso.getDate())}/${addZero(Number(fecha_ingreso.getMonth() + 1))}/${fecha_ingreso.getFullYear()}`;
				const fecha_baja = new Date(item.fecha_baja);
				const fecha_baja_show = `${addZero(fecha_baja.getDate())}/${addZero(Number(fecha_baja.getMonth() + 1))}/${fecha_baja.getFullYear()}`;
				item.fecha_ingreso_show = fecha_ingreso_show;
				item.fecha_baja_show = item.fecha_baja ? fecha_baja_show : 'VIGENTE';
			});
			setDermatologos(response.data);
		}
		setIsLoading(false);
	}

	const loadPatologos = async () => {
		const response = await findEmployeesByRolId(patologoRolId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				const fecha_ingreso = new Date(item.fecha_ingreso);
				const fecha_ingreso_show = `${addZero(fecha_ingreso.getDate())}/${addZero(Number(fecha_ingreso.getMonth() + 1))}/${fecha_ingreso.getFullYear()}`;
				const fecha_baja = new Date(item.fecha_baja);
				const fecha_baja_show = `${addZero(fecha_baja.getDate())}/${addZero(Number(fecha_baja.getMonth() + 1))}/${fecha_baja.getFullYear()}`;
				item.fecha_ingreso_show = fecha_ingreso_show;
				item.fecha_baja_show = item.fecha_baja ? fecha_baja_show : 'VIGENTE';
			});
			setPatologos(response.data);
		}
		setIsLoading(false);
	}

	useEffect(() => {
		loadDermatologos();
		loadPatologos();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<DermatologosContainer
						dermatologos={dermatologos}
						patologos={patologos}
						columnsDermatologos={columnsDermatologos}
						tituloDermatologos='DERMATÓLOGOS'
						tituloPatologos='PATÓLOGOS'
						actionsDermatologo={actionsDermatologo}
						optionsDermatologos={optionsDermatologos}
						openPagoDermatologo={openPagoDermatologo}
						columnsPatologos={columnsPatologos}
						actionsPatologos={actionsPatologos}
						optionsPatologos={optionsPatologos}
						openHistoric={openHistoric}
						dermatologo={dermatologo}
						sucursal={sucursal}
						empleado={empleado}
						openPagoPatologo={openPagoPatologo}
						patologo={patologo}
						handleClose={handleClose} /> :
					<Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default Dermatologos;