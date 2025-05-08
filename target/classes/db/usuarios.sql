CREATE TABLE IF NOT EXISTS usuarios (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    activo INT DEFAULT 1,
    admin INT DEFAULT 0,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    domicilio VARCHAR(200),
    poblacion VARCHAR(100),
    provincia VARCHAR(100),
    cp VARCHAR(5),
    telefono VARCHAR(9),
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX idx_usuario ON usuarios(usuario);
CREATE INDEX idx_email ON usuarios(email);