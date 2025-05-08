INSERT INTO estados (descripcion) VALUES 
('Pendiente'),
('Enviado'),
('Entregado'),
('Cancelado');

-- Crear tabla de historial de estados si no existe
CREATE TABLE IF NOT EXISTS historial_estados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_pedido INT NOT NULL,
    estado INT NOT NULL,
    fecha_cambio TIMESTAMP NOT NULL,
    FOREIGN KEY (codigo_pedido) REFERENCES pedidos(codigo),
    FOREIGN KEY (estado) REFERENCES estados(codigo)
);

-- Asegurarnos de que tenemos los estados correctos
INSERT IGNORE INTO estados (codigo, descripcion) VALUES 
(1, 'Pendiente'),
(2, 'Enviado'),
(3, 'Entregado'),
(4, 'Cancelado');