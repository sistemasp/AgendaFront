import React, { useState, Fragment } from "react";
import { MainContainer } from "./main";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { MainLecturaContainer } from "./main_lectura";

const Alert = (props) => {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuMain = (props) => {

	const [pacienteAgendado, setPacienteAgendado] = useState({});
	const [value, setValue] = useState(0);
	const [openModalPassword, setOpenModalPassword] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		empleado,
		sucursal,
	} = props.location.state;

	const { permisos } = empleado.rol;

	const {
		history,
	} = props;

	const handleChangeTab = (event, newValue, close) => {
		setValue(newValue);
		close();
	};

	const handleAgendar = (event, rowData) => {
		setPacienteAgendado(rowData);
		setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_CONSULTA));
	}

	const handleLogout = () => {
		history.push('/', { empleado: {}, sucursal: {} });
	}

	const handleClickCambioPassword = () => {
		setOpenModalPassword(true);
	}

	const handleOpen = () => {
		setOpenModalPassword(true);
	}

	const handleClose = () => {
		setOpenModalPassword(false);
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	return (
		<Fragment>
			{
				permisos.includes('ALL') ?
					<MainContainer
						pacienteAgendado={pacienteAgendado}
						setPacienteAgendado={setPacienteAgendado}
						onChangeTab={handleChangeTab}
						onClickAgendar={handleAgendar}
						empleado={empleado}
						sucursal={sucursal}
						openModalPassword={openModalPassword}
						onClickLogout={handleLogout}
						onClickCambioPassword={handleClickCambioPassword}
						onOpen={handleOpen}
						onClose={handleClose}
						value={value}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setOpenAlert={setOpenAlert}
						history={history} />

					: (permisos.includes('VER_CITAS')
					?	<MainLecturaContainer
							pacienteAgendado={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							onChangeTab={handleChangeTab}
							onClickAgendar={handleAgendar}
							empleado={empleado}
							sucursal={sucursal}
							openModalPassword={openModalPassword}
							onClickLogout={handleLogout}
							onClickCambioPassword={handleClickCambioPassword}
							onOpen={handleOpen}
							onClose={handleClose}
							value={value}
							setMessage={setMessage}
							setSeverity={setSeverity}
							setOpenAlert={setOpenAlert} />
						: '')
			}

			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default MenuMain;