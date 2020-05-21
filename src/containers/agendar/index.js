import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AgendarContainer } from "./agendar";
import { getAllServices, findTreatmentByServicio, findScheduleByDateAndSucursalAndService, findDatesByDateAndSucursal, createDate, findEmployeesByRolId } from "../../services";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from "yup";
import { toFormatterCurrency, addZero } from "../../utils/utils";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
    backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    },
}));

const validationSchema = Yup.object({
    servicio: Yup.string("Ingresa los nombres")
          .required("El servicio es requerido."),
    tratamiento: Yup.string("Ingresa los apellidos")
          .required("El tratamiento es requerido"),
    fecha: Yup.string("Ingresa la fecha de nacimiento")
          .required("Los nombres del pacientes son requeridos"),
    hora: Yup.string("Ingresa la direccion")
          .required("Los nombres del pacientes son requeridos")
});

const Agendar = (props) => {

    const classes = useStyles();

    const {
        paciente,
        empleado,
        setPacienteAgendado,
        sucursal,
    } = props;

    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [servicios, setServicios] = useState([]);
    const [tratamientos, setTratamientos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [disableDate, setDisableDate] = useState(true);
    const [values, setValues] = useState({
        servicio: '',
        tratamientos: [],
        fecha_show: '',
        fecha: '',
        hora: '',
        paciente: `${paciente._id}`,
        precio: '',
        tipo_cita: '',
        citado: ''
    });
    const [citas, setCitas] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [cita, setCita] = useState();

    const date = new Date();
    const dia = addZero(date.getDate());
    const mes = addZero(date.getMonth() + 1);
    const anio = date.getFullYear();

    const [filterDate, setFilterDate] = useState({
        fecha_show: date,
        fecha: `${dia}/${mes}/${anio}`,
    }); 

    const columns = [
        { title: 'Hora', field: 'hora' },
        { title: 'Paciente', field: 'paciente_nombre' },
        { title: 'Telefono', field: 'paciente.telefono' },
        { title: 'Servicio', field: 'servicio' },
        { title: 'Tratamientos', field: 'show_tratamientos' },
        { title: 'Numero Sesion', field: 'numero_sesion' },
        { title: 'Quien agenda', field: 'quien_agenda.nombre' },
        { title: 'Tipo Cita', field: 'tipo_cita' },
        { title: 'Quien confirma', field: 'quien_confirma.nombre' },
        { title: 'Promovendedor', field: 'promovendedor_nombre' },
        { title: 'Dermatologo', field: 'dermatologo_nombre' },
        { title: 'Cosmetologa', field: 'cosmetologa_nombre' },
        { title: 'Estado', field: 'asistio' },
        { title: 'Precio', field: 'precio_moneda' },
        { title: 'Tiempo (minutos)', field: 'tiempo' },
        { title: 'Observaciones', field: 'observaciones' },
    ];

    const doctorRolId = process.env.REACT_APP_DOCTOR_ROL_ID;

    const options = {
        rowStyle: rowData => {
            const {asistio} = rowData;
            if (asistio === 'NO ASISTIO') {
                return { color: '#B7B4A1' };
            } else if (asistio === 'CANCELO') {
                return { color: '#FF0000', fontWeight: 'bold' };
            } else if (asistio === 'REAGENDO') {
                return { color: '#FBD014' };
            }
        },
        headerStyle: {
            backgroundColor: '#2BA6C6',
            color: '#FFF',
            fontWeight: 'bolder',
            fontSize: '18px'
        }
    }

    useEffect(() => {
        const loadServicios = async() => {
            const response = await getAllServices();
            if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
                setServicios(response.data);
            }
        }

        const loadCitas = async() => {
            const response = await findDatesByDateAndSucursal(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal);
            
            if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
                await response.data.forEach( item => {
                    item.precio_moneda = toFormatterCurrency(item.precio);
                    item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
                    item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
                    item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
                    item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
                    item.show_tratamientos = item.tratamientos.map(tratamiento => {
                        return `${tratamiento.nombre}, `;
                    });
                });
                setCitas(response.data);
            }
        }

        const loadDoctores = async() => {
            const response = await findEmployeesByRolId(doctorRolId);
            if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
                setDoctores(response.data);
            }
        }

        setIsLoading(true);
        loadCitas();
        loadServicios();
        loadDoctores();
        setIsLoading(false);
    }, [sucursal]);

    const loadTratamientos = async(servicio) => {
        const response = await findTreatmentByServicio(servicio);
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setTratamientos(response.data);
        }
    }

    const loadHorarios = async(date) => {
        const dia = date ? date.getDate() : values.fecha_show.getDate();
        const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
        const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
        const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, values.servicio);
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setHorarios(response.data);
        }
    }

    const loadHorariosByServicio = async(date, servicio) => {
        const dia = date ? date.getDate() : values.fecha_show.getDate();
        const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
        const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
        const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, servicio);
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setHorarios(response.data);
        }
    }

    const handleChangeServicio = async(e) => {
        setIsLoading(true);
        
        setValues({
            ...values,
            servicio: e.target.value,
            fecha_show: '',
            fecha: '',
            hora: '',
            precio: '',
        });
        loadTratamientos(e.target.value);
        setIsLoading(false);
    };

    const handleChangeTratamientos = async(items) => {
        setIsLoading(true);
        setValues({
            ...values,
            fecha_show: '',
            fecha: '',
            hora: '',
            precio: '',
            tratamientos: items
        });
        setDisableDate(false);
        setIsLoading(false);
    }

    const handleChangeFecha = async (date) => {
        setIsLoading(true);
        const fecha =  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        await setValues({
            ...values,
            fecha_show: date,
            fecha: fecha
        });
        await loadHorarios(date);
        setIsLoading(false);
    };

    const handleChangeHora = e => {
        setIsLoading(true);
        setValues({...values, hora: e.target.value});
        setIsLoading(false);
    };

    const handleChangeFilterDate = async(date) => {
        setIsLoading(true);
        const dia = addZero(date.getDate());
        const mes = addZero(date.getMonth() + 1);
        const anio = date.getFullYear();
        setFilterDate({
            fecha_show: date,
            fecha: `${dia}/${mes}/${anio}`   
        });
        await loadCitas(date);
        setIsLoading(false);
    };

    const loadCitas = async(filterDate) => {
        const response = await findDatesByDateAndSucursal(filterDate.getDate(), (filterDate.getMonth() + 1), filterDate.getFullYear(), sucursal);
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
            response.data.forEach( item => {
                item.precio_moneda = toFormatterCurrency(item.precio);
                item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
                item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
                item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR'; 
                item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO'; 
                item.show_tratamientos = item.tratamientos.map(tratamiento => {
                    return `${tratamiento.nombre}, `;
                });
            });
            setCitas(response.data);
        }
    }

    const getTimeToTratamiento = (tratamientos) => {
        tratamientos.sort( (a, b) => {
            if (a.tiempo < b.tiempo) return 1;
            if (a.tiempo > b.tiempo) return -1;
            return 0;
        });
        let tiempo = 0;
        tratamientos.forEach((item, index) => {
            tiempo += Number(index === 0 ? item.tiempo : (item.tiempo - (item.servicio !== 'APARATOLOGÍA' ? 20 : 0) ));
        });
        return tiempo;
    }

    const handleClickAgendar = async(data) => {
        setIsLoading(true);
        data.tipo_cita = 'CITADO';
        data.quien_agenda = empleado._id;
        data.sucursal = sucursal;
        data.numero_sesion = 1;
        data.asistio = 'PENDIENTE';
        data.tiempo = getTimeToTratamiento(data.tratamientos);
        const response = await createDate(data);
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED ) {
            setOpenAlert(true);
            setMessage('La Cita se agendo correctamente');
            setValues({
                servicio: '',
                tratamiento: '',
                fecha_show: '',
                fecha: '',
                hora: '',
                paciente: {},
                precio: '',
                tipo_cita: '',
                citado: '',
            });
            setDisableDate(true);
            setPacienteAgendado({});
            loadCitas(new Date());
        }

        setIsLoading(false);
    };

    const handleChangePrecio = (e) => {
        setValues({...values, precio: e.target.value});
    }

    const handleChangeDoctors = (e) => {
        setValues({...values, dermatologo: e.target.value});
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };    

    const handleCloseModal = () => {
        setOpenModal(false);
        setTratamientos([]);
    };

    const handleOnClickEditarCita = async(event, rowData) => {
        setIsLoading(true);
        setCita(rowData);
        // await loadTratamientos(rowData.servicio);
        const splitDate = (rowData.fecha).split('/');
        await loadHorariosByServicio(new Date(splitDate[2], (splitDate[1] - 1), splitDate[0]), rowData.servicio);
        setOpenModal(true);
        setIsLoading(false);
    }

    const actions = [
        //new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
        {
            icon: EditIcon,
            tooltip: 'Editar cita',
            onClick: handleOnClickEditarCita
        } //: ''
    ];

    return (
        <Fragment>
            { 
            !isLoading ? 
            <Formik
                enableReinitialize
                initialValues={values}
                validationSchema={validationSchema} >
                {
                    props => <AgendarContainer 
                    servicios={servicios}
                    tratamientos={tratamientos}
                    horarios={horarios}
                    onChangeServicio={(e) => handleChangeServicio(e)}
                    onChangeTratamientos={(e) => handleChangeTratamientos(e)}
                    onChangeFecha={(e) => handleChangeFecha(e)}
                    onChangeFilterDate={(e) => handleChangeFilterDate(e)}
                    onChangeHora={(e) => handleChangeHora(e)} 
                    filterDate={filterDate.fecha_show}
                    paciente={paciente}
                    disableDate={disableDate}
                    onClickAgendar={handleClickAgendar}
                    onChangePrecio={(e) => handleChangePrecio(e)}
                    titulo={ `CITAS (${filterDate.fecha})`}
                    columns={columns}
                    options={options}
                    citas={citas}
                    actions={actions}
                    cita={cita}
                    openModal={openModal}
                    empleado={empleado}
                    onClickCancel={handleCloseModal}
                    loadCitas={loadCitas}
                    doctores={doctores}
                    onChangeDoctors={(e) => handleChangeDoctors(e)}
                    {...props} />
                }
            </Formik> : 
            <Backdrop className={classes.backdrop} open={isLoading} >
                <CircularProgress color="inherit" />
            </Backdrop>
            }
            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success">
                    {message}
                </Alert>
            </Snackbar>            
        </Fragment>
    );
}

export default Agendar;