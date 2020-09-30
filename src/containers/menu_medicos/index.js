import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { MedicosContainer } from './medicos';
import { findEmployeesByRolId } from '../../services';
import EditIcon from '@material-ui/icons/Edit';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import HistoryIcon from '@material-ui/icons/History';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import PaymentIcon from '@material-ui/icons/Payment';
import { addZero } from "../../utils/utils";

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

const Medicos = (props) => {

	const classes = useStyles();

	const {
		sucursal
	} = props;

	const [openPagoMedico, setOpenPagoMedico] = useState(false);
	const [openHistoric, setOpenHistoric] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [medicos, setMedicos] = useState([]);
	const [medico, setMedico] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const columns = [
		{ title: 'Nombre', field: 'nombre' },
		{ title: 'Cedula Profesional', field: 'cedula' },
		{ title: 'Fecha Ingreso', field: 'fecha_ingreso_show' },
		{ title: 'Fecha Baja', field: 'fecha_baja_show' },
	];

	const options = {
		headerStyle: {
			backgroundColor: '#2BA6C6',
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';'
	}

	const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;

	const handleOpen = () => {
		setOpenPagoMedico(true);
	};

	const handleClose = () => {
		setMedico({});
		setOpenPagoMedico(false);
		setOpenHistoric(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	/*
	const handleClickHistorico = (event, rowData) => {
		setMedico(rowData);
		setOpenHistoric(true);
	}*/

	const handleClickGenerarPago = (event, rowData) => {
		setMedico(rowData);
		setOpenPagoMedico(true);
	}

	const actions = [
		{
			icon: PaymentIcon,
			tooltip: 'Generar Pago',
			onClick: handleClickGenerarPago
		},
		/*{
			icon: HistoryIcon,
			tooltip: 'Historial de pagos',
			onClick: handleClickHistorico
		}*/
	];

	useEffect(() => {
		const loadMedicos = async () => {
			const response = await findEmployeesByRolId(medicoRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					const fecha_ingreso = new Date(item.fecha_ingreso);
					const fecha_ingreso_show = `${addZero(fecha_ingreso.getDate())}/${addZero(Number(fecha_ingreso.getMonth() + 1))}/${fecha_ingreso.getFullYear()}`;
					const fecha_baja = new Date(item.fecha_baja);
					const fecha_baja_show = `${addZero(fecha_baja.getDate())}/${addZero(Number(fecha_baja.getMonth() + 1))}/${fecha_baja.getFullYear()}`;
					item.fecha_ingreso_show = fecha_ingreso_show;
					item.fecha_baja_show = item.fecha_baja ? fecha_baja_show : 'VIGENTE';
				});
				setMedicos(response.data);
			}
			setIsLoading(false);
		}
		loadMedicos();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<MedicosContainer
						medicos={medicos}
						columns={columns}
						titulo='Medicos'
						actions={actions}
						options={options}
						openPagoMedico={openPagoMedico}
						openHistoric={openHistoric}
						medico={medico}
						sucursal={sucursal}
						handleOpen={handleOpen}
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

export default Medicos;