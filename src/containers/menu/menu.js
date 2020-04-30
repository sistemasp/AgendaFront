import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Pacientes from '../pacientes/index';
import Citas from '../citas/index';
import Agendar from '../agendar/index';
import { Button, Toolbar } from '@material-ui/core';
import Reportes from '../reportes/index';


function TabPanel(props) {
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
}));

export const MenuContainer = props => {
    const classes = useStyles();

    const {
        pacienteAgendado,
        setPacienteAgendado,
        onChangeTab,
        value,
        onClickAgendar,
        empleado,
        sucursal,
        onClickLogout
    } = props;

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>

                    <Typography variant="h6" className={classes.title}>
                        {`Sucuarsal: ${sucursal.nombre} - ${empleado.nombre} ( ${empleado.rol.nombre} )`}
                    </Typography>
                    <Button 
                        color="secondary"
                        variant="contained"
                        onClick={onClickLogout}> Cerrar Sesion</Button>
                </Toolbar>
            </AppBar>
            <AppBar position="static">
                <Tabs value={value} onChange={onChangeTab} aria-label="simple tabs">
                    <Tab label="Pacientes" {...a11yProps(0)} />
                    <Tab label="Agendar cita" {...a11yProps(1)} />
                    <Tab label="Citas" {...a11yProps(2)} />
                    <Tab label="Reportes" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Pacientes 
                    onClickAgendar={onClickAgendar}
                    onChangeTab={onChangeTab} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Agendar 
                    paciente={pacienteAgendado}
                    setPacienteAgendado={setPacienteAgendado}
                    empleado={empleado}
                    sucursal={sucursal._id} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Citas 
                    sucursal={sucursal._id}/>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Reportes 
                    sucursal={sucursal._id}/>
            </TabPanel>
        </div>
    );
}
