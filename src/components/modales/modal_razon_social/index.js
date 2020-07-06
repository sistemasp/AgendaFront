import React, { useState, useEffect, Fragment } from 'react';
import ModalFormRazonSocial from './ModalFormRazonSocial';
import { sepomexGetEstados, sepomexGetMunicipos, sepomexGetColonia, sepomexGetAllInfoByCP } from '../../../services';
import { Formik } from 'formik';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ModalRazonSocial = (props) => {
  const {
    open,
    onClose,
    razonSocial,
    onClickGuardar,
    onClickGuardarAgendar
  } = props;

  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [colonias, setColonias] = useState([]);

  const [values, setValues] = useState({
    _id: razonSocial._id,
    rfc: razonSocial.rfc,
    nombre_completo: razonSocial.nombre_completo,
    domicilio: razonSocial.domicilio,
    numero: razonSocial.numero,
    colonia: razonSocial.colonia,
    ciudad: razonSocial.ciudad,
    municipio: razonSocial.municipio,
    estado: razonSocial.estado,
    codigo_postal: razonSocial.codigo_postal,
    telefono: razonSocial.telefono,
    email: razonSocial.email
  });

  const dataComplete = !values.rfc || !values.nombre_completo || !values.domicilio
    || !values.numero || !values.colonia || !values.ciudad || !values.municipio || !values.estado
    || !values.codigo_postal || !values.telefono || !values.email;

  useEffect(() => {
    const loadEstados = async () => {
      const response = await sepomexGetEstados();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setEstados(response.data.response.estado);
      }
    }
    loadEstados();
  }, []);

  const loadMunicipios = async (estado) => {
    const response = await sepomexGetMunicipos(estado);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setMunicipios(response.data.response.municipios);
    }
  }

  const loadColonias = async (municipio) => {
    const response = await sepomexGetColonia(municipio);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setColonias(response.data.response.colonia);
    }
  }

  const handleClickBuscar = async () => {
    const response = await sepomexGetAllInfoByCP(values.codigo_postal);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const res = response.data.response;
      setEstados([res.estado]);
      setMunicipios([res.municipio]);
      setColonias(res.asentamiento);
      setValues({
        ...values,
        estado: res.estado,
        municipio: res.municipio,
        ciudad: res.ciudad,
      });
    } else {
      setOpenAlert(true);
      setSeverity('warning');
      console.log('RESPONSe', response);
      setMessage(response.descripcion.response.data.error_message);
    }
  }



  const handleChangeEstado = async (event) => {
    setValues({ ...values, estado: event.target.value });
    await loadMunicipios(event.target.value);
  }

  const handleChangeMunicipio = async (event) => {
    setValues({ ...values, municipio: event.target.value });
    await loadColonias(event.target.value);
  }

  const handleChangeColonia = (event) => {
    setValues({ ...values, colonia: event.target.value });
  }

  const handleChangeCP = (event) => {
    setValues({ ...values, codigo_postal: event.target.value });
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <Fragment>
      <Formik
        enableReinitialize
        initialValues={values} >
        {
          props => <ModalFormRazonSocial
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClickCancel={onClose}
            razonSocial={razonSocial}
            onClickGuardar={onClickGuardar}
            onClickGuardarAgendar={onClickGuardarAgendar}
            dataComplete={dataComplete}
            estados={estados}
            municipios={municipios}
            ciudades={ciudades}
            colonias={colonias}
            onChangeEstado={(e) => handleChangeEstado(e)}
            onChangeMunicipio={(e) => handleChangeMunicipio(e)}
            onChangeColonia={(e) => handleChangeColonia(e)}
            onClickBuscar={handleClickBuscar}
            onChangeCP={(e) => handleChangeCP(e)}
            {...props} />
        }
      </Formik>
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Fragment>

  );
}

export default ModalRazonSocial;