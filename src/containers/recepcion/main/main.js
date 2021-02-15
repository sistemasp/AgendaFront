import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import MenuPatient from '../menu_pacientes/index';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import People from '@material-ui/icons/People';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AirlineSeatReclineNormalIcon from '@material-ui/icons/AirlineSeatReclineNormal';
import { Button, Grid } from '@material-ui/core';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import ModalPassword from '../../../components/modales/modal_password';
import Dermatologos from '../menu_dermatologos';
import Consultorios from '../consultorios';
import Corte from '../menu_corte';
import ListaEspera from '../lista_espera';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuReports from '../menu_reportes';
import Description from '@material-ui/icons/Description';
import MenuRazonSocial from '../menu_razon_social';
import {
	createCorte,
	showCorteTodayBySucursalAndTurno
} from '../../../services/corte';
import myStyles from '../../../css';

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box>{children}</Box>}
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

export const MainContainer = props => {

	const {
		pacienteAgendado,
		setPacienteAgendado,
		onChangeTab,
		value,
		empleado,
		sucursal,
		onClickLogout,
		onClickCambioPassword,
		openModalPassword,
		onClose,
		setMessage,
		setSeverity,
		setOpenAlert,
		history,
	} = props;

	const classes = myStyles();
	const theme = useTheme();
	const [openDrawer, setOpenDrawer] = useState(false);

	const handleDrawerOpen = () => {
		setOpenDrawer(true);
	};

	const handleDrawerClose = () => {
		setOpenDrawer(false);
	};

	const generateCorteMatutino = async () => {
		const create_date = new Date();
		const newCorte = {
			recepcionista: empleado._id,
			create_date: create_date,
			hora_apertura: create_date,
			turno: 'm',
			sucursal: sucursal,
		}
		const response = await createCorte(newCorte);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setMessage("CORTE MATUTINO ABIERTO.");
			setOpenAlert(true);
		}
	}

	useEffect(() => {
		const findCorte = async () => {
			const response = await showCorteTodayBySucursalAndTurno(sucursal._id, 'm');
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				const corte = response.data;
				if (!corte) {
					generateCorteMatutino();
				}
			}
		}

		findCorte();
	}, []);

	return (
		<div className={classes.root}>
			{
				openModalPassword ?
					<ModalPassword
						open={openModalPassword}
						onClose={onClose}
						empleado={empleado}
						onClickLogout={onClickLogout}
						onClickCambioPassword={onClickCambioPassword}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setOpenAlert={setOpenAlert} /> : ''
			}
			<CssBaseline />
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: openDrawer,
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: openDrawer,
						})}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						{`SUCURSAL: ${sucursal.nombre} - ${empleado.numero_empleado} : ${empleado.nombre ? empleado.nombre : ''} ( ${empleado.rol ? empleado.rol.nombre : ''} )`}
					</Typography>
					<Button
						color="default"
						variant="contained"
						onClick={onClickCambioPassword}>CAMBIAR CONTRASEÑA</Button>
					<Button
						color="secondary"
						variant="contained"
						onClick={onClickLogout}>CERRAR SESION</Button>
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={openDrawer}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					<ListItem button key={'PACIENTES'} onClick={(e) => onChangeTab(e, 0, handleDrawerClose)}>
						<ListItemIcon> <AccessibilityNewIcon /> </ListItemIcon>
						<ListItemText primary={'PACIENTES'} />
					</ListItem>
					<ListItem button key={'DERMATOLÓGOS'} onClick={(e) => onChangeTab(e, 1, handleDrawerClose)}>
						<ListItemIcon> <People /> </ListItemIcon>
						<ListItemText primary={'DERMATOLÓGOS'} />
					</ListItem>
					<ListItem button key={'CONSULTORIOS / CABINAS'} onClick={(e) => onChangeTab(e, 2, handleDrawerClose)}>
						<ListItemIcon> <AirlineSeatReclineNormalIcon /> </ListItemIcon>
						<ListItemText primary={'CONSULTORIOS / CABINAS'} />
					</ListItem>
					<ListItem button key={'CORTE'} onClick={(e) => onChangeTab(e, 3, handleDrawerClose)}>
						<ListItemIcon> <AttachMoneyIcon /> </ListItemIcon>
						<ListItemText primary={'CORTE'} />
					</ListItem>
					<ListItem button key={'LISTA DE ESPERA'} onClick={(e) => onChangeTab(e, 4, handleDrawerClose)}>
						<ListItemIcon> <ListAltIcon /> </ListItemIcon>
						<ListItemText primary={'LISTA DE ESPERA'} />
					</ListItem>
					<ListItem button key={'RAZON SOCIAL'} onClick={(e) => onChangeTab(e, 5, handleDrawerClose)}>
						<ListItemIcon> <Description /> </ListItemIcon>
						<ListItemText primary={'RAZON SOCIAL'} />
					</ListItem>
					<ListItem button key={'REPORTES'} onClick={(e) => onChangeTab(e, 6, handleDrawerClose)}>
						<ListItemIcon> <AssignmentIcon /> </ListItemIcon>
						<ListItemText primary={'REPORTES'} />
					</ListItem>
				</List>
			</Drawer>
			<main
				className={clsx(classes.content, {
					[classes.contentShift]: openDrawer,
				})}
			>
				<div className={classes.drawerHeader} />
				<Fragment className={classes.fragment}>
					<TabPanel value={value} index={0}>
						<MenuPatient
							empleado={empleado}
							sucursal={sucursal}
							history={history} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Dermatologos
							empleado={empleado}
							sucursal={sucursal} />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Consultorios
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={3}>
						<Corte
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={4}>
						<ListaEspera
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={5}>
						<MenuRazonSocial
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={6}>
						<MenuReports
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							sucursal={sucursal._id} />
					</TabPanel>
				</Fragment>
			</main>
		</div>
	);
}