import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { ConsultorioContainer } from './consultorios';
import { findSurgeryBySucursalId, createSurgery, breakFreeSurgeryByIdMedico } from '../../services';
import AirlineSeatReclineExtraIcon from '@material-ui/icons/AirlineSeatReclineExtra';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';

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

const Consultorios = (props) => {

	const classes = useStyles();

	const [openModal, setOpenModal] = useState(false);
	const [openModalAsignar, setOpenModalAsignar] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [consultorios, setConsultorios] = useState([]);
	const [consultorio, setConsultorio] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		sucursal,
	} = props;

	const columns = [
		{ title: 'Nombre', field: 'nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Paciente', field: 'paciente_nombre' },
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

	const loadConsultorios = async () => {
		const response = await findSurgeryBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
				item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
			});
			setConsultorios(response.data);
		}
	}

	const handleOpen = () => {
		setOpenModal(true);
	};

	const handleClose = () => {
		setConsultorio({});
		setOpenModal(false);
		setOpenModalAsignar(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleOnClickAsignarMedico = (event, rowData) => {
		setConsultorio(rowData);
		setOpenModalAsignar(true);
	}

	const handleOnClickLiberarConsultorio = async (event, rowData) => {
		const response = await breakFreeSurgeryByIdMedico(rowData._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setOpenAlert(true);
			setMessage('Salio el medico');
			await loadConsultorios();
		}
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
		rowData => (
			!rowData.medico ? 
			{
				icon: AirlineSeatReclineExtraIcon,
				tooltip: 'Asignar un medico',
				onClick: handleOnClickAsignarMedico
			} : 
			(!rowData.paciente ? {
				icon: DirectionsWalkIcon,
				tooltip: 'Liberar consultorio',
				onClick: handleOnClickLiberarConsultorio
			} : '')
		)
	];

	useEffect(() => {
		const loadConsultorios = async () => {
			const response = await findSurgeryBySucursalId(sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
					item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
				});
				setConsultorios(response.data);
			}
		}
		setIsLoading(true);
		loadConsultorios();
		setIsLoading(false);
	}, [sucursal]);

	return (
		<Fragment>
			{
				!isLoading ?
					<ConsultorioContainer
						columns={columns}
						titulo='Consultorios'
						actions={actions}
						options={options}
						openModal={openModal}
						openModalAsignar={openModalAsignar}
						consultorio={consultorio}
						consultorios={consultorios}
						handleOpen={handleOpen}
						handleClose={handleClose}
						handleClickGuardar={handleClickGuardar}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						loadConsultorios={loadConsultorios} /> :
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

export default Consultorios;