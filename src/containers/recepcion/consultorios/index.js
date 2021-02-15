import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { ConsultorioContainer } from './consultorios';
import {
	findCabinaBySucursalId,
	createCabina,
	breakFreeCabinaByIdDermatologo,
	createSalaCirugia,
	findSalaCirugiaBySucursalId,
	updateEmployee
} from '../../../services';
import AirlineSeatReclineExtraIcon from '@material-ui/icons/AirlineSeatReclineExtra';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import { 
	breakFreeSurgeryByIdDermatologo,
	createSurgery,
	findSurgeryBySucursalId
} from "../../../services/consultorios";

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
	const [openModalSalaCirugia, setOpenModalSalaCirugia] = useState(false);
	const [openModalAsignar, setOpenModalAsignar] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [consultorios, setConsultorios] = useState([]);
	const [consultorio, setConsultorio] = useState({});
	const [cabinas, setCabinas] = useState([]);
	const [cabina, setCabina] = useState({});
	const [salaCirugias, setSalaCirugias] = useState([]);
	const [salaCirugia, setSalaCirugia] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		sucursal,
	} = props;

	const columnsConsultorio = [
		{ title: 'NOMBRE', field: 'nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
	];

	const columnsCabina = [
		{ title: 'NOMBRE', field: 'nombre' },
		{ title: 'COSMETOLOGA', field: 'cosmetologa_nombre' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
	];

	const columnsSalaCirugia = [
		{ title: 'NOMBRE', field: 'nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
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
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN DERMATÓLOGO';
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

	const loadSalaCirugia = async () => {
		const response = await findSalaCirugiaBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN ASIGNAR';
			});
			setSalaCirugias(response.data);
		}
	}

	const handleOpenConsultorio = () => {
		setOpenModalConsultorio(true);
	};

	const handleOpenCabina = () => {
		setOpenModalCabina(true);
	};

	const handleOpenSalaCirugia = () => {
		setOpenModalSalaCirugia(true);
	};

	const handleClose = () => {
		setConsultorio({});
		setOpenModalConsultorio(false);
		setOpenModalCabina(false);
		setOpenModalAsignar(false);
		setOpenModalSalaCirugia(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleOnClickAsignarDermatologo = (event, rowData) => {
		setConsultorio(rowData);
		setOpenModalAsignar(true);
	}

	const handleOnClickLiberarConsultorio = async (event, rowData) => {
		rowData.dermatologo.disponible = true;
    	await updateEmployee(rowData.dermatologo._id, rowData.dermatologo);
		const response = await breakFreeSurgeryByIdDermatologo(rowData._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setOpenAlert(true);
			setMessage('SALIO EL DERMATÓLOGO');
			await loadConsultorios();
		}
	}

	const handleClickGuardarConsultorio = async (event, data) => {
		setIsLoading(true);
		data.sucursal = sucursal;
		const response = await createSurgery(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setMessage('EL CONSULTOTIO SE GUARDO CORRECTAMENTE');
			loadConsultorios();
		}
		setOpenModalConsultorio(false);
		setIsLoading(false);
	}

	const handleOnClickLiberarCabina = async (event, rowData) => {
		const response = await breakFreeCabinaByIdDermatologo(rowData._id);
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

	const handleClickGuardarSalaCirugia = async (event, data) => {
		setIsLoading(true);
		data.sucursal = sucursal;
		const response = await createSalaCirugia(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setMessage('La sala de cirugia se guardo correctamente');
			loadSalaCirugia();
		}
		setOpenModalSalaCirugia(false);
		setIsLoading(false);
	}

	const actionsConsultorio = [
		rowData => (
			!rowData.dermatologo ?
				{
					icon: AirlineSeatReclineExtraIcon,
					tooltip: 'Asignar un dermatologo',
					onClick: handleOnClickAsignarDermatologo
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
					onClick: handleOnClickAsignarDermatologo
				} :
				(!rowData.paciente ? {
					icon: DirectionsWalkIcon,
					tooltip: 'Liberar consultorio',
					onClick: handleOnClickLiberarConsultorio
				} : '')
		)
	];

	const actionsSalaCirugia = [
		rowData => (
			!rowData.dermatologo ?
				{
					icon: AirlineSeatReclineExtraIcon,
					tooltip: 'Asignar un dermatologo',
					onClick: handleOnClickAsignarDermatologo
				} :
				(!rowData.paciente ? {
					icon: DirectionsWalkIcon,
					tooltip: 'Liberar sala de cirugia',
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
					item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN DERMATÓLOGO';
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

		const loadSalaCirugia = async () => {
			const response = await findSalaCirugiaBySucursalId(sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
					item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN ASIGNAR';
				});
				setSalaCirugias(response.data);
			}
		}

		setIsLoading(true);
		loadConsultorios();
		loadCabinas();
		loadSalaCirugia();
		setIsLoading(false);
	}, [sucursal]);

	return (
		<Fragment>
			{
				!isLoading ?
					<ConsultorioContainer
						columnsConsultorio={columnsConsultorio}
						columnsCabina={columnsCabina}
						columnsSalaCirugia={columnsSalaCirugia}
						tituloConsultorio='Consultorios'
						tituloCabina='Cabinas'
						tituloSalaCirugia='Sala Cirugias'
						actionsConsultorio={actionsConsultorio}
						actionsSalaCirugia={actionsSalaCirugia}
						actionsCabina={actionsCabina}
						options={options}
						openModalConsultorio={openModalConsultorio}
						openModalCabina={openModalCabina}
						openModalSalaCirugia={openModalSalaCirugia}
						openModalAsignar={openModalAsignar}
						consultorio={consultorio}
						consultorios={consultorios}
						cabinas={cabinas}
						cabina={cabina}
						salaCirugias={salaCirugias}
						salaCirugia={salaCirugia}
						handleOpenConsultorio={handleOpenConsultorio}
						handleOpenCabina={handleOpenCabina}
						handleOpenSalaCirugia={handleOpenSalaCirugia}
						handleClose={handleClose}
						handleClickGuardarConsultorio={handleClickGuardarConsultorio}
						handleClickGuardarCabina={handleClickGuardarCabina}
						handleClickGuardarSalaCirugia={handleClickGuardarSalaCirugia}
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