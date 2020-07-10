import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;
const urlSepomexGetEstados = 'https://api-sepomex.hckdrk.mx/query/get_estados';
const urlSepomexGetMunicipos = 'https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/';
const urlSepomexGetColonia = 'https://api-sepomex.hckdrk.mx/query/get_colonia_por_municipio/';
const urlSepomexGetAllInfoByCP = 'https://api-sepomex.hckdrk.mx/query/info_cp/';

// PACIENTES

export const getAllPatients = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllPatients', error);
    }
}

export const findPatientByPhoneNumber = async (telefono) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/phonenumber/${telefono}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findPatientByPhoneNumber', error);
    }
}

export const updatePatient = async (pacienteId, paciente) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/${pacienteId}`,
            method: 'PUT',
            data: paciente
        });
        return response;
    } catch (error) {
        console.log('updatePatient', error);
    }
}

export const createPatient = async (paciente) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'POST',
            data: paciente
        });
        return response;
    } catch (error) {
        console.log('createPatient', error);
    }
}

// SERVICIOS

export const getAllServices = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/servicio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllServices', error);
    }
}

// TRATAMIENTOS

export const getAllTreatments = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamiento`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getTreatments', error);
    }
}

export const findTreatmentByServicio = async (servicioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamiento/servicio/${servicioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTreatmentByServicio', error);
    }
}
// HORARIO

export const getAllSchedules = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllSchedules', error);
    }
}

export const findScheduleByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDate', error);
    }
}

export const findScheduleByDateAndSucursalAndService = async (dia, mes, anio, sucursalId, servicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}/${sucursalId}/${servicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDateAndSucursalAndService', error);
    }
}

export const findScheduleInConsultByDateAndSucursal = async (consultaId, dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/consulta/${consultaId}/${dia}/${mes}/${anio}/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleInConsultByDateAndSucursal', error);
    }
}

// CITAS

export const getAllDates = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDates', error);
    }
}

export const getAllDatesBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDatesBySucursal', error);
    }
}

export const showAllDatesBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllDatesBySucursalAsistio', error);
    }
}

export const findDatesByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDate', error);
    }
}

export const findDatesByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDateAndSucursal', error);
    }
}

export const findDatesByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByRangeDateAndSucursal', error);
    }
}

export const findHistoricByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/histotic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricByPaciente', error);
    }
}

export const createDate = async (cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'POST',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('createDate', error);
    }
}

export const updateDate = async (dateId, cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dateId}`,
            method: 'PUT',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('updateDate', error);
    }
}

// RECEPCIONISTAS

export const findRecepcionistByEmployeeNumber = async (employeeNumber) => {
    try {
        const response = await axios({
            url: `${baseUrl}/recepcionista/number/${employeeNumber}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRecepcionistByEmployeeNumber', error);
    }
}

// EMPLEADOS

export const findEmployeeByEmployeeNumber = async (employeeNumber) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/number/${employeeNumber}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeeByEmployeeNumber', error);
    }
}

export const loginEmployee = async (employeeNumber, password) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/login/${employeeNumber}/${password}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('loginEmployee', error);
    }
}

export const findEmployeesByRolId = async (rolId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/rol/${rolId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeesByRolId', error);
    }
}

export const updateEmployee = async (employeeId, employee) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/${employeeId}`,
            method: 'PUT',
            data: employee
        });
        return response;
    } catch (error) {
        console.log('updateEmployee', error);
    }
}

// SUCURSALES

export const showAllOffices = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/sucursal`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllOffices', error);
    }
}

// CONSULTORIOS

export const findSurgeryBySucursalId = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalId', error);
    }
}

export const findSurgeryBySucursalIdAndFree = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/sucursal/${sucursalId}/libre`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalIdAndFree', error);
    }
}

export const createSurgery = async (consultorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio`,
            method: 'POST',
            data: consultorio
        });
        return response;
    } catch (error) {
        console.log('createSurgery', error);
    }
}

export const updateSurgery = async (surgeryId, surgery) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/${surgeryId}`,
            method: 'PUT',
            data: surgery
        });
        return response;
    } catch (error) {
        console.log('updateSurgery', error);
    }
}

export const breakFreeSurgeryById = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/liberar/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSurgeryById', error);
    }
}

// CONSULTAS

export const getAllConsults = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllConsults', error);
    }
}

export const getAllConsultsBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllConsultsBySucursal', error);
    }
}

export const showAllConsultsBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllConsultsBySucursalAsistio', error);
    }
}

export const findConsultsByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByDate', error);
    }
}

export const findConsultsByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByDateAndSucursal', error);
    }
}

export const findConsultsByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByRangeDateAndSucursal', error);
    }
}

export const findHistoricConsultByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/histotic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricConsultByPaciente', error);
    }
}

export const findHistoricConsultByMedico = async (medicoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/histotic/medico/${medicoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricConsultByMedico', error);
    }
}

export const createConsult = async (consulta) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta`,
            method: 'POST',
            data: consulta
        });
        return response;
    } catch (error) {
        console.log('createConsult', error);
    }
}

export const updateConsult = async (dateId, consulta) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dateId}`,
            method: 'PUT',
            data: consulta
        });
        return response;
    } catch (error) {
        console.log('updateConsult', error);
    }
}

export const waitingList = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingList', error);
    }
}

// TIPO CITAS

export const showAllTipoCitas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipocita`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoCitas', error);
    }
}

// STATUS

export const showAllStatus = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/status`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllStatus', error);
    }
}

// BANCOS

export const showAllBanco = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/banco`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllBanco', error);
    }
}

// METODO PAGO

export const showAllMetodoPago = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/metodopago`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMetodoPago', error);
    }
}

// TIPO TARJETA

export const showAllTipoTarjeta = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipotarjeta`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoTarjeta', error);
    }
}

// PAGOS

export const createPago = async (pago) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago`,
            method: 'POST',
            data: pago
        });
        return response;
    } catch (error) {
        console.log('createPago', error);
    }
}

export const findPaysByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findPaysByRangeDateAndSucursal', error);
    }
}

export const findPagoByIds = async (pagosIds) => {
    console.log('PAGOS IDS', pagosIds);
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/${pagosIds}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagoByIds', error);
    }
}

export const findPagosByCita = async (idCita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/cita/${idCita}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagosByCita', error);
    }
}

export const updatePago = async (pagoId, pago) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/${pagoId}`,
            method: 'PUT',
            data: pago
        });
        return response;
    } catch (error) {
        console.log('updatePago', error);
    }
}

// RAZON SOCIAL

export const showAllRazonSocials = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllRazonSocials', error);
    }
}

export const updateRazonSocial = async (razonSocialId, razonSocial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial/${razonSocialId}`,
            method: 'PUT',
            data: razonSocial
        });
        return response;
    } catch (error) {
        console.log('updateRazonSocial', error);
    }
}

export const createRazonSocial = async (razonSocial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial`,
            method: 'POST',
            data: razonSocial
        });
        return response;
    } catch (error) {
        console.log('createRazonSocial', error);
    }
}

// SEPOMEX

export const sepomexGetEstados = async () => {
    try {
        const response = await axios({
            url: urlSepomexGetEstados,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetEstados', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetMunicipos = async (estado) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetMunicipos}${estado}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetMunicipos', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetColonia = async (municipio) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetColonia}${municipio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetColonia', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetAllInfoByCP = async (cp) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetAllInfoByCP}${cp}?type=simplified`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetAllInfoByCP', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

// USO CFDI

export const showAllUsoCfdis = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/usocfdi`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllUsoCfdis', error);
    }
}

// FACTURAS 

export const createFactura = async (factura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura`,
            method: 'POST',
            data: factura
        });
        return response;
    } catch (error) {
        console.log('createFactura', error);
    }
}

export const findFacturasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacturasByRangeDateAndSucursal', error);
    }
}