import sqlite3
from datetime import datetime

def crear_base_datos():
    conn = sqlite3.connect('condomanager.db')
    cursor = conn.cursor()

    # Crear tabla de Configuración de cuotas
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS configuracion_cuotas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cuota_base DECIMAL(10,2) NOT NULL,
        tasa_interes DECIMAL(5,2) NOT NULL,
        fecha_actualizacion DATE NOT NULL
    )
    ''')

    # Crear tabla de Copropietarios
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS copropietarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT NOT NULL,
        email TEXT NOT NULL,
        numero_residentes INTEGER NOT NULL
    )
    ''')

    # Crear tabla de Apartamentos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS apartamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT NOT NULL UNIQUE,
        copropietario_id INTEGER NOT NULL,
        cuota_actual DECIMAL(10,2) NOT NULL,
        estado TEXT CHECK(estado IN ('corriente', 'moroso')) NOT NULL,
        deuda_actual DECIMAL(10,2) DEFAULT 0,
        FOREIGN KEY (copropietario_id) REFERENCES copropietarios(id)
    )
    ''')

    # Crear tabla de Proveedores
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS proveedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        nit TEXT UNIQUE NOT NULL,
        telefono TEXT NOT NULL,
        email TEXT,
        direccion TEXT,
        tipo_servicio TEXT NOT NULL
    )
    ''')

    # Crear tabla de Gastos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha DATE NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        descripcion TEXT NOT NULL,
        categoria TEXT NOT NULL,
        proveedor_id INTEGER,
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
    )
    ''')

    # Crear tabla de Pagos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS pagos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha DATE NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        apartamento_id INTEGER NOT NULL,
        concepto TEXT NOT NULL,
        FOREIGN KEY (apartamento_id) REFERENCES apartamentos(id)
    )
    ''')

    # Insertar datos de configuración inicial
    cursor.execute('''
    INSERT INTO configuracion_cuotas (cuota_base, tasa_interes, fecha_actualizacion)
    VALUES (?, ?, ?)
    ''', (150000, 2.5, datetime.now().date()))

    # Insertar copropietarios iniciales
    copropietarios_data = [
        ('Ana Pérez', '3101234567', 'a.perez@email.com', 3),
        ('Carlos Gómez', '3209876543', 'c.gomez@email.com', 2),
        ('Elena Torres', '3005551122', 'e.torres@email.com', 4),
        ('David Reyes', '3157778899', 'd.reyes@email.com', 1),
        ('Felipe Castro', '3114443322', 'f.castro@email.com', 5),
        ('Gloria Ruiz', '3016669988', 'g.ruiz@email.com', 2)
    ]
    cursor.executemany('''
    INSERT INTO copropietarios (nombre, telefono, email, numero_residentes)
    VALUES (?, ?, ?, ?)
    ''', copropietarios_data)

    # Insertar apartamentos iniciales
    apartamentos_data = [
        ('A101', 1, 150000, 'corriente', 0),
        ('A102', 2, 150000, 'moroso', 300000),
        ('B201', 3, 150000, 'corriente', 0),
        ('B202', 4, 150000, 'moroso', 450000),
        ('C301', 5, 150000, 'corriente', 0),
        ('C302', 6, 150000, 'moroso', 150000)
    ]
    cursor.executemany('''
    INSERT INTO apartamentos (numero, copropietario_id, cuota_actual, estado, deuda_actual)
    VALUES (?, ?, ?, ?, ?)
    ''', apartamentos_data)

    # Insertar algunos pagos iniciales
    pagos_data = [
        ('2025-10-25', 150000, 1, 'Cuota A101'),
        ('2025-09-20', 150000, 3, 'Cuota B201'),
        ('2025-08-10', 150000, 5, 'Cuota C301')
    ]
    cursor.executemany('''
    INSERT INTO pagos (fecha, monto, apartamento_id, concepto)
    VALUES (?, ?, ?, ?)
    ''', pagos_data)

    # Insertar algunos gastos iniciales
    gastos_data = [
        ('2025-10-24', 500000, 'Mantenimiento ascensores', 'Mantenimiento', None),
        ('2025-09-15', 350000, 'Factura de agua', 'Servicios', None)
    ]
    cursor.executemany('''
    INSERT INTO gastos (fecha, monto, descripcion, categoria, proveedor_id)
    VALUES (?, ?, ?, ?, ?)
    ''', gastos_data)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    crear_base_datos()  
    print("Base de datos creada exitosamente con datos iniciales.")
