import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Edit3,
  FileText,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  UserRound,
} from 'lucide-react';
import './styles.css';

const initialOptics = [
  {
    id: 'central',
    name: 'Óptica Central',
    address: 'Av. Providencia 1240',
    manager: 'Camila Reyes',
    color: '#0f766e',
  },
  {
    id: 'vista-sur',
    name: 'Vista Sur',
    address: 'Gran Avenida 5880',
    manager: 'Matías Rojas',
    color: '#1d4ed8',
  },
  {
    id: 'lentes-norte',
    name: 'Lentes Norte',
    address: 'Recoleta 842',
    manager: 'Fernanda Silva',
    color: '#be123c',
  },
];

const patientsByOptic = {
  central: {
    '2026-06-04': [
      {
        id: 1,
        name: 'Sofía Morales',
        rut: '18.456.321-9',
        phone: '+56 9 6123 4580',
        email: 'sofia.morales@email.com',
        notes: 'Prefiere controles en la mañana. Historial de miopía leve.',
        time: '09:30',
        reason: 'Control visual',
        status: 'Confirmado',
      },
      {
        id: 2,
        name: 'Tomás Herrera',
        rut: '16.987.654-2',
        phone: '+56 9 7456 1022',
        email: '',
        notes: 'Retira lentes progresivos. Confirmar ajuste de puente.',
        time: '11:00',
        reason: 'Retiro de lentes',
        status: 'Pendiente',
      },
    ],
    '2026-06-12': [
      {
        id: 3,
        name: 'Valentina Díaz',
        rut: '20.123.456-7',
        phone: '+56 9 8123 9077',
        email: 'valentina.diaz@email.com',
        notes: 'Primera evaluación en la sucursal.',
        time: '15:20',
        reason: 'Examen optométrico',
        status: 'Confirmado',
      },
    ],
    '2026-06-23': [
      {
        id: 4,
        name: 'Benjamín Soto',
        rut: '19.222.111-4',
        phone: '+56 9 3321 7788',
        email: '',
        notes: 'Marco comprado en otra sucursal.',
        time: '10:10',
        reason: 'Ajuste de marco',
        status: 'Confirmado',
      },
      {
        id: 5,
        name: 'Isidora Vega',
        rut: '21.555.332-1',
        phone: '+56 9 9044 5588',
        email: 'isidora.vega@email.com',
        notes: 'Consulta por lentes de contacto diarios.',
        time: '17:40',
        reason: 'Consulta lentes de contacto',
        status: 'Pendiente',
      },
    ],
  },
  'vista-sur': {
    '2026-06-06': [
      {
        id: 6,
        name: 'Martina Fuentes',
        rut: '17.345.876-0',
        phone: '+56 9 7234 1199',
        email: 'martina.fuentes@email.com',
        notes: 'Traer receta anterior.',
        time: '10:00',
        reason: 'Control visual',
        status: 'Confirmado',
      },
    ],
    '2026-06-18': [
      {
        id: 7,
        name: 'Agustín Pérez',
        rut: '15.678.432-5',
        phone: '+56 9 6455 1200',
        email: '',
        notes: 'Retiro de lentes de sol ópticos.',
        time: '12:15',
        reason: 'Retiro de lentes',
        status: 'Pendiente',
      },
      {
        id: 8,
        name: 'Emilia Castro',
        rut: '22.345.789-3',
        phone: '+56 9 8554 3399',
        email: 'emilia.castro@email.com',
        notes: 'Paciente nueva. Evaluar fatiga visual por pantalla.',
        time: '16:30',
        reason: 'Examen optométrico',
        status: 'Confirmado',
      },
    ],
  },
  'lentes-norte': {
    '2026-06-10': [
      {
        id: 9,
        name: 'Lucas Araya',
        rut: '18.111.456-8',
        phone: '+56 9 6788 4412',
        email: '',
        notes: 'Solicita ajuste rápido antes del mediodía.',
        time: '09:45',
        reason: 'Ajuste de marco',
        status: 'Confirmado',
      },
    ],
    '2026-06-25': [
      {
        id: 10,
        name: 'Antonia Muñoz',
        rut: '20.456.908-6',
        phone: '+56 9 9921 3401',
        email: 'antonia.munoz@email.com',
        notes: 'Control anual.',
        time: '14:00',
        reason: 'Control visual',
        status: 'Pendiente',
      },
    ],
  },
};

const operationsByOptic = {
  central: {
    '2026-06-04': {
      city: 'Loncoche',
      notes: 'Operativo en sede municipal.',
    },
    '2026-06-05': {
      city: 'Temuco',
      notes: '',
    },
    '2026-06-06': {
      city: 'Villarrica',
      notes: 'Coordinar llegada con recepción.',
    },
  },
  'vista-sur': {},
  'lentes-norte': {},
};

const emptyPatient = {
  name: '',
  rut: '',
  phone: '',
  email: '',
  notes: '',
  time: '18:00',
  reason: 'Evaluación visual',
  status: 'Pendiente',
};

const monthNames = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const days = Array.from({ length: mondayOffset }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function App() {
  const [screen, setScreen] = useState('optics');
  const [formMode, setFormMode] = useState('add');
  const [opticsList, setOpticsList] = useState(initialOptics);
  const [opticForm, setOpticForm] = useState(null);
  const [opticToDelete, setOpticToDelete] = useState(null);
  const [selectedOptic, setSelectedOptic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [patientsData, setPatientsData] = useState(patientsByOptic);
  const [operationsData, setOperationsData] = useState(operationsByOptic);
  const [operationForm, setOperationForm] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date(2026, 5, 1)));

  const selectedPatients = selectedOptic && selectedDate ? patientsData[selectedOptic.id]?.[selectedDate] ?? [] : [];
  const selectedPatient = selectedPatients.find((patient) => patient.id === selectedPatientId);

  const openAddOptic = () => {
    setOpticForm({ mode: 'add', optic: null });
  };

  const openEditOptic = (optic) => {
    setOpticForm({ mode: 'edit', optic });
  };

  const saveOptic = (name) => {
    const cleanName = name.trim();

    if (!cleanName) return;

    if (opticForm.mode === 'add') {
      const nextOptic = {
        id: `optic-${Date.now()}`,
        name: cleanName,
        address: 'Sin dirección registrada',
        manager: 'Sin encargado',
        color: pickOpticColor(opticsList.length),
      };

      setOpticsList((items) => [...items, nextOptic]);
      setPatientsData((data) => ({ ...data, [nextOptic.id]: {} }));
      setOperationsData((data) => ({ ...data, [nextOptic.id]: {} }));
      setOpticForm(null);
      return;
    }

    setOpticsList((items) =>
      items.map((optic) => (optic.id === opticForm.optic.id ? { ...optic, name: cleanName } : optic)),
    );
    setSelectedOptic((optic) => (optic?.id === opticForm.optic.id ? { ...optic, name: cleanName } : optic));
    setOpticForm(null);
  };

  const deleteOptic = () => {
    setOpticsList((items) => items.filter((optic) => optic.id !== opticToDelete.id));
    setPatientsData((data) => {
      const nextData = { ...data };
      delete nextData[opticToDelete.id];
      return nextData;
    });
    setOperationsData((data) => {
      const nextData = { ...data };
      delete nextData[opticToDelete.id];
      return nextData;
    });
    setOpticToDelete(null);
  };

  const openCalendar = (optic) => {
    setSelectedOptic(optic);
    setSelectedDate(null);
    setSelectedPatientId(null);
    setScreen('calendar');
  };

  const moveMonth = (offset) => {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  };

  const goToToday = () => {
    setVisibleMonth(startOfMonth(new Date(2026, 5, 4)));
  };

  const openDay = (dateKey) => {
    setSelectedDate(dateKey);
    setSelectedPatientId(null);
    setScreen('patients');
  };

  const openOperationForm = () => {
    setOperationForm({
      optic: selectedOptic,
      dateKey: selectedDate,
      operation: operationsData[selectedOptic.id]?.[selectedDate] ?? { city: '', notes: '' },
    });
  };

  const saveOperation = ({ city, notes }) => {
    const cleanCity = city.trim();
    const cleanNotes = notes.trim();

    setOperationsData((data) => {
      const opticOperations = data[operationForm.optic.id] ?? {};
      const nextOperations = { ...opticOperations };

      if (cleanCity || cleanNotes) {
        nextOperations[operationForm.dateKey] = {
          city: cleanCity,
          notes: cleanNotes,
        };
      } else {
        delete nextOperations[operationForm.dateKey];
      }

      return {
        ...data,
        [operationForm.optic.id]: nextOperations,
      };
    });
    setOperationForm(null);
  };

  const openPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setShowDeleteConfirm(false);
    setScreen('detail');
  };

  const openAddPatient = () => {
    setFormMode('add');
    setSelectedPatientId(null);
    setScreen('form');
  };

  const openEditPatient = () => {
    setShowDeleteConfirm(false);
    setFormMode('edit');
    setScreen('form');
  };

  const savePatient = (formValues) => {
    if (formMode === 'add') {
      const patient = {
        ...formValues,
        id: Date.now(),
      };

      setPatientsData((data) => {
        const opticPatients = data[selectedOptic.id] ?? {};
        const dayPatients = opticPatients[selectedDate] ?? [];

        return {
          ...data,
          [selectedOptic.id]: {
            ...opticPatients,
            [selectedDate]: [...dayPatients, patient],
          },
        };
      });

      setSelectedPatientId(patient.id);
      setScreen('detail');
      return;
    }

    setPatientsData((data) => {
      const opticPatients = data[selectedOptic.id] ?? {};
      const dayPatients = opticPatients[selectedDate] ?? [];

      return {
        ...data,
        [selectedOptic.id]: {
          ...opticPatients,
          [selectedDate]: dayPatients.map((patient) =>
            patient.id === selectedPatientId ? { ...patient, ...formValues } : patient,
          ),
        },
      };
    });
    setScreen('detail');
  };

  const deletePatient = () => {
    setPatientsData((data) => {
      const opticPatients = data[selectedOptic.id] ?? {};
      const dayPatients = opticPatients[selectedDate] ?? [];

      return {
        ...data,
        [selectedOptic.id]: {
          ...opticPatients,
          [selectedDate]: dayPatients.filter((patient) => patient.id !== selectedPatientId),
        },
      };
    });

    setSelectedPatientId(null);
    setShowDeleteConfirm(false);
    setScreen('patients');
  };

  return (
    <main className="app-shell">
      {screen === 'optics' && (
        <OpticsScreen
          optics={opticsList}
          patientsData={patientsData}
          onAdd={openAddOptic}
          onEdit={openEditOptic}
          onDelete={setOpticToDelete}
          onSelect={openCalendar}
        />
      )}
      {screen === 'calendar' && selectedOptic && (
        <CalendarScreen
          optic={selectedOptic}
          monthDate={visibleMonth}
          patients={patientsData[selectedOptic.id] ?? {}}
          operations={operationsData[selectedOptic.id] ?? {}}
          onBack={() => setScreen('optics')}
          onPrevMonth={() => moveMonth(-1)}
          onNextMonth={() => moveMonth(1)}
          onToday={goToToday}
          onSelectDay={openDay}
        />
      )}
      {screen === 'patients' && selectedOptic && selectedDate && (
        <PatientsScreen
          optic={selectedOptic}
          dateKey={selectedDate}
          patients={selectedPatients}
          operation={operationsData[selectedOptic.id]?.[selectedDate]}
          onBack={() => setScreen('calendar')}
          onAdd={openAddPatient}
          onEditOperation={openOperationForm}
          onSelect={openPatient}
        />
      )}
      {screen === 'detail' && selectedOptic && selectedDate && selectedPatient && (
        <PatientDetailScreen
          optic={selectedOptic}
          dateKey={selectedDate}
          patient={selectedPatient}
          onBack={() => setScreen('patients')}
          onEdit={openEditPatient}
          onDelete={() => setShowDeleteConfirm(true)}
        />
      )}
      {screen === 'form' && selectedOptic && selectedDate && (
        <PatientFormScreen
          mode={formMode}
          optic={selectedOptic}
          dateKey={selectedDate}
          initialPatient={formMode === 'edit' && selectedPatient ? selectedPatient : emptyPatient}
          onBack={() => setScreen(formMode === 'edit' ? 'detail' : 'patients')}
          onSave={savePatient}
        />
      )}
      {showDeleteConfirm && selectedPatient && (
        <ConfirmDelete
          patientName={selectedPatient.name}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={deletePatient}
        />
      )}
      {opticForm && (
        <OpticFormDialog
          mode={opticForm.mode}
          optic={opticForm.optic}
          onCancel={() => setOpticForm(null)}
          onSave={saveOptic}
        />
      )}
      {opticToDelete && (
        <ConfirmOpticDelete
          optic={opticToDelete}
          recordCount={countOpticRecords(patientsData[opticToDelete.id])}
          onCancel={() => setOpticToDelete(null)}
          onConfirm={deleteOptic}
        />
      )}
      {operationForm && (
        <OperationFormDialog
          operation={operationForm.operation}
          dateKey={operationForm.dateKey}
          onCancel={() => setOperationForm(null)}
          onSave={saveOperation}
        />
      )}
    </main>
  );
}

function Header({ title, subtitle, onBack, action }) {
  return (
    <header className="topbar">
      <div className="topbar-row">
        {onBack && (
          <button className="icon-button" onClick={onBack} aria-label="Volver">
            <ArrowLeft size={21} />
          </button>
        )}
        <div className="title-block">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
    </header>
  );
}

function OpticsScreen({ optics, patientsData, onAdd, onEdit, onDelete, onSelect }) {
  return (
    <>
      <Header
        title="Ópticas"
        subtitle="Selecciona una sucursal para revisar su agenda"
        action={
          <button className="icon-button accent" onClick={onAdd} aria-label="Agregar óptica">
            <Plus size={22} />
          </button>
        }
      />
      <section className="search-strip">
        <Search size={18} />
        <span>Buscar óptica o comuna</span>
      </section>
      <button className="primary-button full-width add-optic-button" onClick={onAdd}>
        <Plus size={18} />
        + Agregar óptica
      </button>
      <section className="cards-grid">
        {optics.map((optic) => (
          <article className="optic-card" key={optic.id}>
            <span className="optic-mark" style={{ background: optic.color }} />
            <div className="optic-card-body">
              <button className="optic-open" onClick={() => onSelect(optic)}>
                <span className="optic-content">
                  <strong>{optic.name}</strong>
                  <span>
                    <MapPin size={15} />
                    {optic.address}
                  </span>
                  <span>
                    <UserRound size={15} />
                    Encargada: {optic.manager}
                  </span>
                </span>
                <span className="card-meta">
                  <CalendarDays size={17} />
                  {countOpticRecords(patientsData[optic.id])} registros
                </span>
              </button>
              <div className="optic-actions" aria-label={`Administrar ${optic.name}`}>
                <button className="mini-action-button" onClick={() => onEdit(optic)} aria-label={`Editar ${optic.name}`}>
                  <Edit3 size={16} />
                </button>
                <button
                  className="mini-action-button danger"
                  onClick={() => onDelete(optic)}
                  aria-label={`Eliminar ${optic.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function CalendarScreen({ optic, monthDate, patients, operations, onBack, onPrevMonth, onNextMonth, onToday, onSelectDay }) {
  const days = useMemo(() => buildMonthDays(monthDate.getFullYear(), monthDate.getMonth()), [monthDate]);
  const todayKey = '2026-06-04';
  const monthLabel = `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
  const monthRecords = useMemo(
    () => getMonthRecords(monthDate, patients, operations),
    [monthDate, patients, operations],
  );

  return (
    <>
      <Header
        title={optic.name}
        subtitle={monthLabel}
        onBack={onBack}
      />
      <section className="calendar-navigation" aria-label="Navegación del calendario">
        <button className="secondary-button month-button" onClick={onPrevMonth} aria-label="Mes anterior">
          Mes anterior
        </button>
        <button className="secondary-button today-button" onClick={onToday}>
          Hoy
        </button>
        <button className="secondary-button month-button" onClick={onNextMonth} aria-label="Mes siguiente">
          Mes siguiente
        </button>
      </section>
      <section className="calendar-panel">
        <div className="weekday-grid">
          {weekDays.map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((date, index) => {
            if (!date) return <span className="empty-day" key={`empty-${index}`} />;

            const dateKey = formatDateKey(date);
            const appointments = patients[dateKey] ?? [];
            const operation = operations[dateKey];
            const isToday = dateKey === todayKey;

            return (
              <button
                key={dateKey}
                className={`day-cell ${appointments.length ? 'has-patients' : ''} ${operation ? 'has-operation' : ''} ${
                  isToday ? 'is-today' : ''
                }`}
                onClick={() => onSelectDay(dateKey)}
              >
                <span>{date.getDate()}</span>
                {operation && <em aria-label={`Operativo en ${operation.city}`} />}
                {appointments.length > 0 && <small>{appointments.length}</small>}
              </button>
            );
          })}
        </div>
      </section>
      <section className="agenda-summary">
        <h2>Agenda de {monthLabel}</h2>
        {monthRecords.length === 0 ? (
          <div className="month-empty">Sin pacientes ni operativos registrados este mes.</div>
        ) : (
          monthRecords.map(({ dateKey, patientsCount, operation }) => (
            <button key={dateKey} onClick={() => onSelectDay(dateKey)}>
              <span>
                {formatReadableDate(dateKey)}
                {operation?.city && <small>{operation.city}</small>}
              </span>
              <strong>{patientsCount ? `${patientsCount} pacientes` : 'Operativo'}</strong>
            </button>
          ))
        )}
      </section>
    </>
  );
}

function PatientsScreen({ optic, dateKey, patients, operation, onBack, onAdd, onEditOperation, onSelect }) {
  return (
    <>
      <Header
        title="Pacientes del día"
        subtitle={`${optic.name} · ${formatReadableDate(dateKey)}`}
        onBack={onBack}
        action={
          <button className="icon-button accent" onClick={onAdd} aria-label="Agregar paciente">
            <Plus size={22} />
          </button>
        }
      />
      <section className="operation-summary">
        <div>
          <span>Lugar del operativo</span>
          <strong>{operation?.city || 'Sin lugar registrado'}</strong>
          {operation?.notes && <p>{operation.notes}</p>}
        </div>
        <button className="icon-button quiet" onClick={onEditOperation} aria-label="Editar lugar del operativo">
          <Edit3 size={18} />
        </button>
      </section>
      <section className="patient-list">
        {patients.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={32} />
            <h2>Sin pacientes agendados</h2>
            <p>Agrega una ficha para este día.</p>
            <button className="primary-button" onClick={onAdd}>
              <Plus size={18} />
              Agregar paciente
            </button>
          </div>
        ) : (
          patients.map((patient) => (
            <button className="patient-card patient-card-button" key={patient.id} onClick={() => onSelect(patient.id)}>
              <div className="avatar">{patient.name.charAt(0)}</div>
              <div>
                <h2>{patient.name}</h2>
                <p>{patient.reason}</p>
                <span>
                  <Clock size={15} />
                  {patient.time}
                </span>
              </div>
              <strong className={patient.status === 'Confirmado' ? 'confirmed' : 'pending'}>{patient.status}</strong>
            </button>
          ))
        )}
      </section>
      {patients.length > 0 && (
        <button className="floating-add" onClick={onAdd}>
          <Plus size={20} />
          Agregar paciente
        </button>
      )}
    </>
  );
}

function PatientDetailScreen({ optic, dateKey, patient, onBack, onEdit, onDelete }) {
  return (
    <>
      <Header
        title="Ficha paciente"
        subtitle={`${optic.name} · ${formatReadableDate(dateKey)}`}
        onBack={onBack}
        action={
          <button className="icon-button accent" onClick={onEdit} aria-label="Editar paciente">
            <Edit3 size={20} />
          </button>
        }
      />
      <section className="detail-card">
        <div className="detail-identity">
          <div className="avatar large">{patient.name.charAt(0)}</div>
          <div>
            <h2>{patient.name}</h2>
            <p>{patient.reason}</p>
            <strong className={patient.status === 'Confirmado' ? 'confirmed' : 'pending'}>{patient.status}</strong>
          </div>
        </div>
        <div className="detail-grid">
          <DetailItem icon={<IdCard size={18} />} label="RUT" value={patient.rut} />
          <DetailItem icon={<Phone size={18} />} label="Teléfono" value={patient.phone} />
          <DetailItem icon={<Mail size={18} />} label="Correo electrónico" value={patient.email || 'Sin correo'} />
          <DetailItem icon={<Clock size={18} />} label="Hora" value={patient.time} />
          <DetailItem icon={<FileText size={18} />} label="Notas" value={patient.notes || 'Sin notas'} wide />
        </div>
      </section>
      <section className="detail-actions">
        <button className="secondary-button" onClick={onEdit}>
          <Edit3 size={18} />
          Editar
        </button>
        <button className="danger-button" onClick={onDelete}>
          <Trash2 size={18} />
          Eliminar paciente
        </button>
      </section>
    </>
  );
}

function DetailItem({ icon, label, value, wide = false }) {
  return (
    <article className={wide ? 'detail-item wide' : 'detail-item'}>
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function ConfirmDelete({ patientName, onCancel, onConfirm }) {
  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <section className="confirm-panel">
        <h2 id="confirm-title">Eliminar paciente</h2>
        <p>¿Seguro que quieres eliminar la ficha de {patientName}? Esta acción no se puede deshacer.</p>
        <div className="confirm-actions">
          <button className="secondary-button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="danger-button" onClick={onConfirm}>
            <Trash2 size={18} />
            Eliminar
          </button>
        </div>
      </section>
    </div>
  );
}

function OpticFormDialog({ mode, optic, onCancel, onSave }) {
  const [name, setName] = useState(optic?.name ?? '');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(name);
  };

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="optic-form-title">
      <form className="confirm-panel optic-dialog" onSubmit={handleSubmit}>
        <h2 id="optic-form-title">{mode === 'add' ? 'Agregar óptica' : 'Editar óptica'}</h2>
        <label>
          Nombre de la óptica
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej: Óptica Las Condes"
            required
          />
        </label>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="primary-button" type="submit">
            <Save size={18} />
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmOpticDelete({ optic, recordCount, onCancel, onConfirm }) {
  const hasRecords = recordCount > 0;

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="optic-delete-title">
      <section className="confirm-panel">
        <h2 id="optic-delete-title">Eliminar óptica</h2>
        <p>
          ¿Seguro que quieres eliminar {optic.name}?
          {hasRecords
            ? ` Tiene ${recordCount} pacientes o registros asociados y también se quitarán de esta sesión.`
            : ' No tiene pacientes asociados.'}
        </p>
        <div className="confirm-actions">
          <button className="secondary-button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="danger-button" onClick={onConfirm}>
            <Trash2 size={18} />
            Eliminar
          </button>
        </div>
      </section>
    </div>
  );
}

function OperationFormDialog({ operation, dateKey, onCancel, onSave }) {
  const [values, setValues] = useState({
    city: operation?.city ?? '',
    notes: operation?.notes ?? '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(values);
  };

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="operation-form-title">
      <form className="confirm-panel optic-dialog" onSubmit={handleSubmit}>
        <h2 id="operation-form-title">Lugar del operativo</h2>
        <p className="dialog-date">{formatReadableDate(dateKey)}</p>
        <label>
          Ciudad o localidad
          <input
            autoFocus
            name="city"
            value={values.city}
            onChange={handleChange}
            placeholder="Ej: Loncoche"
          />
        </label>
        <label>
          Observaciones <span>opcional</span>
          <textarea
            name="notes"
            value={values.notes}
            onChange={handleChange}
            placeholder="Indicaciones del lugar, contacto o punto de encuentro"
            rows="4"
          />
        </label>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="primary-button" type="submit">
            <Save size={18} />
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

function PatientFormScreen({ mode, optic, dateKey, initialPatient, onBack, onSave }) {
  const [formValues, setFormValues] = useState({
    ...emptyPatient,
    ...initialPatient,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...formValues,
      name: formValues.name.trim(),
      rut: formValues.rut.trim(),
      phone: formValues.phone.trim(),
      email: formValues.email.trim(),
      notes: formValues.notes.trim(),
    });
  };

  return (
    <>
      <Header
        title={mode === 'add' ? 'Nuevo paciente' : 'Editar ficha'}
        subtitle={`${optic.name} · ${formatReadableDate(dateKey)}`}
        onBack={onBack}
      />
      <form className="patient-form" onSubmit={handleSubmit}>
        <label>
          Nombre completo
          <input name="name" value={formValues.name} onChange={handleChange} placeholder="Ej: Natalia López" required />
        </label>
        <label>
          RUT
          <input name="rut" value={formValues.rut} onChange={handleChange} placeholder="12.345.678-9" required />
        </label>
        <label>
          Teléfono
          <input
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            placeholder="+56 9 1234 5678"
            required
          />
        </label>
        <label>
          Correo electrónico <span>opcional</span>
          <input
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="paciente@email.com"
          />
        </label>
        <label>
          Motivo de atención
          <input name="reason" value={formValues.reason} onChange={handleChange} required />
        </label>
        <label>
          Hora
          <input name="time" type="time" value={formValues.time} onChange={handleChange} required />
        </label>
        <label>
          Estado
          <select name="status" value={formValues.status} onChange={handleChange}>
            <option>Confirmado</option>
            <option>Pendiente</option>
          </select>
        </label>
        <label>
          Notas
          <textarea
            name="notes"
            value={formValues.notes}
            onChange={handleChange}
            placeholder="Indicaciones, preferencias o antecedentes relevantes"
            rows="5"
          />
        </label>
        <button className="primary-button full-width" type="submit">
          <Save size={18} />
          Guardar cambios
        </button>
      </form>
    </>
  );
}

function formatReadableDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return `${day} de ${monthNames[month - 1]} de ${year}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthRecords(monthDate, patients, operations) {
  const monthPrefix = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
  const dateKeys = new Set([
    ...Object.keys(patients).filter((dateKey) => dateKey.startsWith(monthPrefix)),
    ...Object.keys(operations).filter((dateKey) => dateKey.startsWith(monthPrefix)),
  ]);

  return Array.from(dateKeys)
    .sort()
    .map((dateKey) => ({
      dateKey,
      patientsCount: patients[dateKey]?.length ?? 0,
      operation: operations[dateKey],
    }));
}

function countOpticRecords(opticPatients = {}) {
  return Object.values(opticPatients).reduce((total, patients) => total + patients.length, 0);
}

function pickOpticColor(index) {
  const colors = ['#0f766e', '#1d4ed8', '#be123c', '#7c3aed', '#047857', '#b45309'];
  return colors[index % colors.length];
}

createRoot(document.getElementById('root')).render(<App />);
