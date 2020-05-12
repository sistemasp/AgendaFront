import React, { useState, useEffect } from 'react';
import { getAllServices, findTreatmentByServicio, getAllSchedules, findScheduleByDateAndSucursalAndService, updateDate, findEmployeesByRolId } from "../../services";
import * as Yup from "yup";
import ModalFormCita from './ModalFormCita';
import { Formik } from 'formik';

const validationSchema = Yup.object({
  fecha: Yup.string("Ingresa los nombres")
        .required("Los nombres del pacientes son requeridos"),
  hora: Yup.string("Ingresa los apellidos")
        .required("Los nombres del pacientes son requeridos"),
  paciente: Yup.string("Ingresa la fecha de nacimiento")
        .required("Los nombres del pacientes son requeridos"),
  servicio: Yup.string("Ingresa la direccion")
        .required("Los nombres del pacientes son requeridos"),
  tratamiento: Yup.string("Ingresa el telefono")
        .required("Los nombres del pacientes son requeridos"),
  numero_sesion: Yup.string("Ingresa los nombres")
        .required("Los nombres del pacientes son requeridos"),
  recepcionista: Yup.string("Ingresa los apellidos")
        .required("Los nombres del pacientes son requeridos"),
  confirmo: Yup.string("Ingresa la fecha de nacimiento")
        .required("Los nombres del pacientes son requeridos"),
  quien_confirma: Yup.string("Ingresa la direccion")
        .required("Los nombres del pacientes son requeridos"),
  asistio: Yup.string("Ingresa el telefono")
        .required("Los nombres del pacientes son requeridos"),
  precio: Yup.string("Ingresa el telefono")
        .required("Los nombres del pacientes son requeridos"),
});

const ModalCita = (props) => {

  const {
    open,
    onClose,
    cita,
    empleado,
    loadCitas,
  } = props;

  const splitDate = (cita.fecha).split('/');

  const [servicios, setServicios] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [promovendedores, setPromovendedores] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [values, setValues] = useState({
    fecha: cita.fecha,
    fecha_show: new Date(splitDate[2], (splitDate[1] - 1), splitDate[0]),
    hora: cita.hora,
    paciente: cita.paciente,
    paciente_nombre: `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
    telefono: cita.paciente.telefono,
    servicio: cita.servicio,
    tratamientos: cita.tratamientos,
    numero_sesion: cita.numero_sesion,
    quien_agenda: cita.quien_agenda,
    tipo_cita: cita.tipo_cita,
    confirmo: cita.confirmo,
    quien_confirma: cita.quien_confirma,
    promovendedor: cita.promovendedora,
    cosmetologa: cita.cosmetologa,
    asistio: cita.asistio,
    precio: cita.precio,
    motivos: cita.motivos,
  });

  const valuesTipoCita = [
    { "nombre": "CITADO" },
    { "nombre": "SIN CITA" },
    { "nombre": "DERIVADO" },
    { "nombre": "FACEBOOK" },
    { "nombre": "INSTAGRAM" },
  ];

  const valuesStatus = [
    { "nombre": "ASISTIO" },
    { "nombre": "NO ASISTIO" },
    { "nombre": "CANCELO" },
    { "nombre": "REAGENDO" },
    { "nombre": "PENDIENTE" },
  ];

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;

  useEffect(() => {
    const loadServicios = async() => {
        const response = await getAllServices();
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
            setServicios(response.data);
        }
    }
    const loadTratamientos = async() => {
      const response = await findTreatmentByServicio(cita.servicio);
      if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
          setTratamientos(response.data);
      }
    }
    const loadHorariosByServicio = async() => {
      const splitDate = (cita.fecha).split('/');
      const response = await findScheduleByDateAndSucursalAndService(splitDate[0], splitDate[1], splitDate[2], cita.sucursal._id, cita.servicio);
      if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        response.data.push({hora: values.hora});
        setHorarios(response.data);
      }
    }

    const loadPromovendedores = async() => {
      const response = await findEmployeesByRolId(promovendedorRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setPromovendedores(response.data);
      }
    }

    const loadCosmetologas = async() => {
      const response = await findEmployeesByRolId(cosmetologaRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setCosmetologas(response.data);
      }
    }

    loadServicios();
    loadTratamientos();
    loadHorariosByServicio();
    loadPromovendedores();
    loadCosmetologas();
  }, [cita, promovendedorRolId, cosmetologaRolId]);

  const loadTratamientos = async(servicio) => {
    const response = await findTreatmentByServicio(servicio);
    if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTratamientos(response.data);
    }
  }

  const loadHorarios = async() => {
      const response = await getAllSchedules();
      if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
          setHorarios(response.data);
      }
  }

  const handleChangeServicio = e => {
      setValues({
          ...values,
          servicio: e.target.value,
          tratamiento: '',
          fecha_show: new Date(),
          fecha: '',
          hora: '',
          precio: '',
      });
      loadTratamientos(e.target.value);
  };

  const handleChangeTratamientos = (items) => {
    setValues({...values, tratamientos: items});
  }

  const handleChangeFecha = date => {
      loadHorarios();
      setValues({
          ...values,
          fecha_show: date,
          fecha: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      });
  };

  const handleChangeHora = e => {
      setValues({...values, hora: e.target.value});
  };

  const handleChangeTipoCita = e => {
      setValues({...values, tipo_cita: e.target.value});
  }

  const handleChangePromovendedor = e => {
    setValues({...values, promovendedor: e.target.value});
  }

  const handleChangeCosmetologa = e => {
    setValues({...values, cosmetologa: e.target.value});
  }

  const handleChangeAsistio = e => {
    setValues({...values, asistio: e.target.value});
  }

  const getTimeToTratamiento = (tratamientos) => {
    tratamientos.sort( (a, b) => {
        if (a.tiempo < b.tiempo) return 1;
        if (a.tiempo > b.tiempo) return -1;
        return 0;
    });
    let tiempo = 0;
    tratamientos.forEach((item, index) => {
        tiempo += Number(index === 0 ? item.tiempo : (item.tiempo - 20));
    });
    return tiempo;
  }

  const handleOnClickActualizarCita = async(event, rowData) => {
    rowData.quien_confirma = empleado._id;
    rowData.tiempo = getTimeToTratamiento(rowData.tratamientos);
    await updateDate(cita._id, rowData);
    onClose();
    await loadCitas(rowData.fecha_show);
  }

  const handleChangeSesion = e => {
    setValues({...values, numero_sesion: e.target.value});
  };

  const handleChangePrecio = e => {
    setValues({...values, precio: e.target.value});
  };

  const handleChangeMotivos = e => {
    setValues({...values, motivos: e.target.value});
  }

  return (
    <Formik
      enableReinitialize
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormCita
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClickCancel={onClose}
        cita={cita}
        onClickActualizarCita={handleOnClickActualizarCita}
        onChangeServicio={(e) => handleChangeServicio(e)}
        onChangeTratamientos={(e) => handleChangeTratamientos(e)}
        onChangeFecha={(e) => handleChangeFecha(e)}
        onChangeHora={(e) => handleChangeHora(e)}
        onChangeTipoCita={(e) => handleChangeTipoCita(e)}
        onChangeAsistio={(e) => handleChangeAsistio(e)}
        onChangePromovendedor={(e) => handleChangePromovendedor(e)}
        onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
        servicios={servicios}
        tratamientos={tratamientos}
        horarios={horarios}
        promovendedores={promovendedores}
        cosmetologas={cosmetologas}
        valuesTipoCita={valuesTipoCita}
        valuesStatus={valuesStatus}
        onChangeSesion={handleChangeSesion}
        onChangePrecio={handleChangePrecio}
        onChangeMotivos={handleChangeMotivos}
        {...props} />
      }
    </Formik>
  );
}

export default ModalCita;