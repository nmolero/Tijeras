// Este es para mostrar las el registro de las tablas
export const tables = {
    'CAUSE': "CRUD-CAUSE-TABLE",
    'SUB-CAUSE': "CRUD-SUB-CAUSE-TABLE",
    'W-SCHEME': 'CRUD-WORK-SCHEME-TABLE',
    'W-SCHEDULE': 'CRUD-WORK-SCHEDULE-TABLE',
    'M-EVCLS-WS': 'CRUD-WORK-SCHEME-MACHINE-EVENT-CLASS'
};

// Este objeto es para los tipos de entradas o inputs para saber si está ingresado o ingresar el valor
export const inputTypes = {
    'INPUT_TEXT': 'INPUT-TEXT',
    'DROPDOWN': 'DROPDOWN',
    'CHECKBOX': 'CHECKBOX',
    'CALENDAR': 'CALENDAR',
    'CASCADE': 'CASCADE',
    'TEXT_AREA': 'TEXT-AREA'
}

// Este es para las acciones que quiero que realice, como createRequire, eliminar, etc
export const actions = {
    'ADD': 'ADD',
    'DELETE_S': 'DELETE-SINGLE',
    'DELETE_M': 'DELETE-MULTIPLE',
    'UPDATE': 'UPDETE',
    'READ': 'READ'
}

// La función que hará era el evento
export const eventType = {
    'CLICK': 'CLICK'
}
