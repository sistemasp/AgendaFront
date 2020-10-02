import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { CorteContainer } from './corte';
import { findEmployeesByRolId, findSurgeryBySucursalId, createSurgery } from '../../services';
import HistoryIcon from '@material-ui/icons/History';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Edit from '@material-ui/icons/Edit';

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

const Corte = (props) => {

	const classes = useStyles();

	const [openModal, setOpenModal] = useState(false);
	const [openHistoric, setOpenHistoric] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [medicos, setMedicos] = useState([]);
	const [consultorios, setConsultorios] = useState([]);
	const [consultorio, setConsultorio] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		onClickAgendar,
		sucursal,
	} = props;

	const columns = [
		{ title: 'Concepto', field: 'nombre' },
		{ title: 'Cantidad', field: 'nombre_medico' },
	];

	const options = {
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

	const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;

	const loadConsultorios = async () => {
		const response = await findSurgeryBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setConsultorios(response.data);
		}
	}

	const handleOpen = () => {
		setOpenModal(true);
	};

	const handleClose = () => {
		setConsultorio({});
		setOpenModal(false);
		setOpenHistoric(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleOnClickEditar = (event, rowData) => {
		setConsultorio(rowData);
		setOpenModal(true);
	}

	const handleClickHistorico = (event, rowData) => {
		setConsultorio(rowData);
		setOpenHistoric(true);
	}

	const handleClickGuardar = async (event, data) => {
		setIsLoading(true);
		data.sucursal = sucursal;
		const response = await createSurgery(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setMessage('El consultorio se guardo correctamente');
			loadConsultorios();
		}
		setOpenModal(false);
		setIsLoading(false);
	}

	const actions = [
		{
			icon: Edit,
			tooltip: 'Generar Pago',
			onClick: onClickAgendar
		},
		{
			icon: HistoryIcon,
			tooltip: 'Historial de pagos',
			onClick: handleClickHistorico
		}
	];

	useEffect(() => {
		const loadConsultorios = async () => {
			const response = await findSurgeryBySucursalId(sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setConsultorios(response.data);
			}
		}

		const loadMedicos = async () => {
			const response = await findEmployeesByRolId(medicoRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setMedicos(response.data);
			}
			setIsLoading(false);
		}
		loadConsultorios();
		loadMedicos();
	}, [sucursal]);

	return (
		<Fragment>
			{
				!isLoading ?
					<CorteContainer
						columns={columns}
						tituloIngreso='Ingreso'
						tituloEgreso='Egreso'
						actions={actions}
						options={options}
						openModal={openModal}
						openHistoric={openHistoric}
						consultorio={consultorio}
						consultorios={consultorios}
						handleOpen={handleOpen}
						handleClose={handleClose}
						handleClickGuardar={handleClickGuardar} /> :
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

export default Corte;