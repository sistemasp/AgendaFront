import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import { Button } from '@material-ui/core';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FaceIcon from '@material-ui/icons/Face';
import ModalPassword from '../../../components/modales/modal_password';
import myStyles from '../../../css';
import InicioDermatologos from '../inicio';

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

export const MainDermatologosContainer = props => {

	const {
		onChangeTab,
		value,
		dermatologo,
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

	console.log("KAOZ", dermatologo);

	const classes = myStyles();
	const theme = useTheme();
	const [openDrawer, setOpenDrawer] = useState(false);

	const handleDrawerOpen = () => {
		setOpenDrawer(true);
	};

	const handleDrawerClose = () => {
		setOpenDrawer(false);
	};

	useEffect(() => {

	}, []);

	return (
		<div className={classes.root}>
			{
				openModalPassword ?
					<ModalPassword
						open={openModalPassword}
						onClose={onClose}
						empleado={dermatologo}
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
						{`SUCURSAL: ${sucursal.nombre} - ${dermatologo.numero_empleado} : ${dermatologo.nombre ? dermatologo.nombre : ''} ( ${dermatologo.rol ? dermatologo.rol.nombre : ''} )`}
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
					<ListItem button key={'INICIO'} onClick={(e) => onChangeTab(e, 0, handleDrawerClose)}>
						<ListItemIcon> <FaceIcon /> </ListItemIcon>
						<ListItemText primary={'INICIO'} />
					</ListItem>
				</List>
				<List>
					<ListItem button key={'RECETAS'} onClick={(e) => onChangeTab(e, 1, handleDrawerClose)}>
						<ListItemIcon> <FolderOpenIcon /> </ListItemIcon>
						<ListItemText primary={'RECETAS'} />
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
						<InicioDermatologos
							dermatologo={dermatologo}
							sucursal={sucursal} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<InicioDermatologos
							dermatologo={dermatologo}
							sucursal={sucursal} />
					</TabPanel>
				</Fragment>

			</main>
		</div>
	);
}