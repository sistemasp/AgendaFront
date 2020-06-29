import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import { Button } from '@material-ui/core';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import ModalPassword from '../../components/modal_password';
import Medicos from '../medicos';
import Consultorios from '../consultorios';
import Corte from '../corte';
import ListaEspera from '../lista_espera';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuReports from '../menu_reportes';

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
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		backgroundColor: "#2BA6C6",
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
	title: {
		flexGrow: 1,
	},
	fragment: {
		width: '100%',
	}
}));

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
	} = props;

	const classes = useStyles();
	const theme = useTheme();
	const [openDrawer, setOpenDrawer] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpenDrawer(true);
	};

	const handleDrawerClose = () => {
		setOpenDrawer(false);
	};

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
						{`Sucuarsal: ${sucursal.nombre} - ${empleado.nombre} ( ${empleado.rol.nombre} )`}
					</Typography>
					<Button
						color="default"
						variant="contained"
						onClick={onClickCambioPassword}>Cambiar Contraseña</Button>
					<Button
						color="secondary"
						variant="contained"
						onClick={onClickLogout}>Cerrar Sesion</Button>
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
					<ListItem button key={'Pacientes'} onClick={(e) => onChangeTab(e, 0)}>
						<ListItemIcon> <AccessibilityNewIcon /> </ListItemIcon>
						<ListItemText primary={'Pacientes'} />
					</ListItem>
					<ListItem button key={'Medicos'} onClick={(e) => onChangeTab(e, 1)}>
						<ListItemIcon> <People /> </ListItemIcon>
						<ListItemText primary={'Medicos'} />
					</ListItem>
					<ListItem button key={'Consultorios'} onClick={(e) => onChangeTab(e, 2)}>
						<ListItemIcon> <AirlineSeatReclineNormalIcon /> </ListItemIcon>
						<ListItemText primary={'Consultorios'} />
					</ListItem>
					<ListItem button key={'Corte'} onClick={(e) => onChangeTab(e, 3)}>
						<ListItemIcon> <AttachMoneyIcon /> </ListItemIcon>
						<ListItemText primary={'Corte'} />
					</ListItem>
					<ListItem button key={'Lista de Espera'} onClick={(e) => onChangeTab(e, 4)}>
						<ListItemIcon> <ListAltIcon /> </ListItemIcon>
						<ListItemText primary={'Lista de Espera'} />
					</ListItem>
					<ListItem button key={'Reportes'} onClick={(e) => onChangeTab(e, 5)}>
						<ListItemIcon> <AssignmentIcon /> </ListItemIcon>
						<ListItemText primary={'Reportes'} />
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
							sucursal={sucursal} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Medicos
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							sucursal={sucursal._id} />
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