import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { ConsultorioContainer } from './consultorios';
import {
	findSurgeryBySucursalId,
	createSurgery,
	breakFreeSurgeryByIdMedico,
	findCabinaBySucursalId,
	createCabina,
	breakFreeCabinaByIdMedico
} from '../../services';
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

	const [openModalConsultorio, setOpenModalConsultorio] = useState(false);
	const [openModalCabina, setOpenModalCabina] = useState(false);
	const [openModalAsignar, setOpenModalAsignar] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [consultorios, setConsultorios] = useState([]);
	const [consultorio, setConsultorio] = useState({});
	const [cabinas, setCabinas] = useState([]);
	const [cabina, setCabina] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		sucursal,
	} = props;

	const columnsConsultorio = [
		{ title: 'Nombre', field: 'nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Paciente', field: 'paciente_nombre' },
	];

	const columnsCabina = [
		{ title: 'Nombre', field: 'nombre' },
		{ title: 'Cosmetologa', field: 'cosmetologa_nombre' },
		{ title: 'Paciente', field: 'paciente_nombre' },
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

	const loadCabinas = async () => {
		const response = await findCabinaBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
			});
			setCabinas(response.data);
		}
	}

	const handleOpenConsultorio = () => {
		setOpenModalConsultorio(true);
	};

	const handleOpenCabina = () => {
		setOpenModalCabina(true);
	};

	const handleClose = () => {
		setConsultorio({});
		setOpenModalConsultorio(false);
		setOpenModalCabina(false);
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

	const handleClickGuardarConsultorio = async (event, data) => {
		setIsLoading(true);
		data.sucursal = sucursal;
		const response = await createSurgery(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setMessage('El consultorio se guardo correctamente');
			loadConsultorios();
		}
		setOpenModalConsultorio(false);
		setIsLoading(false);
	}

	const handleOnClickLiberarCabina = async (event, rowData) => {
		const response = await breakFreeCabinaByIdMedico(rowData._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setOpenAlert(true);
			setMessage('Salio la cosmetologa');
			await loadConsultorios();
		}
	}

	const handleClickGuardarCabina = async (event, data) => {
		setIsLoading(true);
		data.sucursal = sucursal;
		const response = await createCabina(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setMessage('La cabina se guardo correctamente');
			loadCabinas();
		}
		setOpenModalCabina(false);
		setIsLoading(false);
	}

	const actionsConsultorio = [
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

	const actionsCabina = [
		rowData => (
			!rowData.cosmetologa ?
				{
					icon: AirlineSeatReclineExtraIcon,
					tooltip: 'Asignar una cosmetologa',
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

		const loadCabinas = async () => {
			const response = await findCabinaBySucursalId(sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
					item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				});
				setCabinas(response.data);
			}
		}
		setIsLoading(true);
		loadConsultorios();
		loadCabinas();
		setIsLoading(false);
	}, [sucursal]);

	return (
		<Fragment>
			{
				!isLoading ?
					<ConsultorioContainer
						columnsConsultorio={columnsConsultorio}
						columnsCabina={columnsCabina}
						tituloConsultorio='Consultorios'
						tituloCabina='Cabinas'
						actionsConsultorio={actionsConsultorio}
						actionsCabina={actionsCabina}
						options={options}
						openModalConsultorio={openModalConsultorio}
						openModalCabina={openModalCabina}
						openModalAsignar={openModalAsignar}
						consultorio={consultorio}
						consultorios={consultorios}
						cabinas={cabinas}
						cabina={cabina}
						handleOpenConsultorio={handleOpenConsultorio}
						handleOpenCabina={handleOpenCabina}
						handleClose={handleClose}
						handleClickGuardarConsultorio={handleClickGuardarConsultorio}
						handleClickGuardarCabina={handleClickGuardarCabina}
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