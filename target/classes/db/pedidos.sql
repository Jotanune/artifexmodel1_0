CREATE TABLE IF NOT EXISTS pedidos (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    codigo_usuario INT NOT NULL,
    fecha DATETIME NOT NULL,
    FOREIGN KEY (codigo_usuario) REFERENCES usuarios(codigo)
);

CREATE TABLE IF NOT EXISTS lineas_pedido (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    codigo_pedido INT NOT NULL,
    codigo_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (codigo_pedido) REFERENCES pedidos(codigo),
    FOREIGN KEY (codigo_producto) REFERENCES productos(codigo)
);