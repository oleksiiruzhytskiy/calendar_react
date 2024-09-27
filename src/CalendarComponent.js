// CalendarComponent.js
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './calendarStyles.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);  
  const [modalOpen, setModalOpen] = useState(false);  
  const [formData, setFormData] = useState({ title: '', color: '#4a90e2', start: null, end: null });

  const openModal = (event = null) => {
    if (event) {
      setFormData({
        title: event.title,
        color: event.color,
        start: event.start,
        end: event.end,
      });
      setSelectedEvent(event);
    } else {
      setFormData({ title: '', color: '#4a90e2', start: null, end: null });
      setSelectedEvent(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSelect = ({ start, end }) => {
    openModal();
    setFormData({ ...formData, start, end });
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      setEvents(events.map((evt) => (evt === selectedEvent ? { ...formData } : evt)));
    } else {
      setEvents([...events, { ...formData }]);
    }
    closeModal();
  };

  const handleEventDelete = (event) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить это событие?');
    if (confirmDelete) {
      setEvents(events.filter((evt) => evt !== event));
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '5px',
        color: 'white',
        padding: '5px',
        cursor: 'pointer',
      },
    };
  };

  const handleSelectEvent = (event) => {
    openModal(event); 
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-container">
        <button className="add-event-button" onClick={() => alert('Добавить событие')}>
          Добавить событие
        </button>

        <Calendar
          localizer={localizer}
          events={events}
          selectable
          defaultView="month"
          views={['month', 'week', 'day']}
          style={{ height: 600 }}
          onSelectSlot={handleSelect}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />

        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>{selectedEvent ? 'Редактировать событие' : 'Добавить событие'}</h3>

              <label>Название события:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength="30"
                placeholder="Введите название (макс. 30 символов)"
              />

              <label>Цвет события:</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />

              <div className="modal-actions">
                <button className="save-button" onClick={handleSaveEvent}>
                  Сохранить
                </button>
                <button className="cancel-button" onClick={closeModal}>
                  Отмена
                </button>
                {selectedEvent && (
                  <button
                    className="delete-button"
                    onClick={() => {
                      handleEventDelete(selectedEvent);
                      closeModal();
                    }}
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default CalendarComponent;
