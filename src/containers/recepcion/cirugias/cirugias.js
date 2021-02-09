import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
require('moment/locale/es.js');

const localizer = momentLocalizer(moment);

export const CirugiasContainer = (props) => {

    const { events } = props;

    const messages = {
        allDay: 'Todo el dia',
        previous: '<',
        next: '>',
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Dia',
        agenda: 'Agenda',
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
    };

    const textColor = "#FFFFFF";

    const eventPropGetter = (event, start, end, isSelected) => {

        let newStyle = {
            backgroundColor: event.dermatologo.color,
            color: textColor,
            borderRadius: "5px",
        };
    
        return {
            className: "",
            style: newStyle
        };
    }

    return (
        <div style={{ height: '950pt'}}>
            <Calendar
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultDate={moment().toDate()}
                localizer={localizer}
                messages={messages}
                eventPropGetter={eventPropGetter} />
        </div>
    );
}
