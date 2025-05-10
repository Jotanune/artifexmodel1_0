package tienda;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class AccesoBD {
    private static AccesoBD instanciaUnica = null;
    private Connection conexionBD = null;

    public static AccesoBD getInstance() {
        System.out.println("Entrando en getInstance()");
        if (instanciaUnica == null) {
            System.out.println("instanciaUnica es null, creando nueva instancia...");
            instanciaUnica = new AccesoBD();
        }
        return instanciaUnica;
    }

    private AccesoBD() {
        System.out.println("Constructor AccesoBD()");
        abrirConexionBD();
    }

    public void abrirConexionBD() {
        System.out.println("Entrando en abrirConexionBD()");
        if (conexionBD == null) {
            String JDBC_DRIVER = "org.mariadb.jdbc.Driver";
            String DB_URL = "jdbc:mariadb://localhost:3306/daw";
            String USER = "root";
            String PASS = "root";
            try {
                System.out.println("Cargando driver: " + JDBC_DRIVER);
                Class.forName(JDBC_DRIVER);
                System.out.println("Conectando a la base de datos: " + DB_URL);
                conexionBD = DriverManager.getConnection(DB_URL, USER, PASS);
                System.out.println("Conexión establecida correctamente.");
            } catch (Exception e) {
                System.err.println("No se ha podido conectar a la base de datos");
                System.err.println(e.getMessage());
                e.printStackTrace();
                // Lanza la excepción para que el JSP la capture y la muestre
                throw new RuntimeException("Error en abrirConexionBD: " + e.getMessage(), e);
            }
        } else {
            System.out.println("Ya existe una conexión activa.");
        }
    }

    public boolean comprobarAcceso() {
        System.out.println("Entrando en comprobarAcceso()");
        abrirConexionBD();
        boolean resultado = (conexionBD != null);
        System.out.println("¿Conexión es null?: " + !resultado);
        return resultado;
    }
    public List<ProductoBD> obtenerProductosBD(int categoria) {
        abrirConexionBD();
        ArrayList<ProductoBD> productos = new ArrayList<>();

        try {
            String query;
            PreparedStatement s;
            
            if (categoria == 0) {
                // Si la categoría es 0, seleccionar todos los productos
                query = "SELECT codigo,descripcion,precio,existencias,imagen,categoria FROM productos";
                s = conexionBD.prepareStatement(query);
            } else {
                // Si se especifica una categoría, filtrar por ella
                query = "SELECT codigo,descripcion,precio,existencias,imagen,categoria FROM productos WHERE categoria=?";
                s = conexionBD.prepareStatement(query);
                s.setInt(1,categoria);
            }

            ResultSet resultado = s.executeQuery();
            while(resultado.next()){
                ProductoBD producto = new ProductoBD();
                producto.setCodigo(resultado.getInt("codigo"));
                producto.setDescripcion(resultado.getString("descripcion"));
                producto.setPrecio(resultado.getFloat("precio"));
                producto.setStock(resultado.getInt("existencias"));
                producto.setImagen(resultado.getString("imagen"));
                producto.setCategoria(resultado.getInt("categoria"));
                productos.add(producto);
            }
        } catch(Exception e) {
            System.err.println("Error ejecutando la consulta a la base de datos");
            System.err.println(e.getMessage());
        }
        return productos;
    }

    public ProductoBD obtenerProductoPorCodigo(int codigo) {
        abrirConexionBD();
        ProductoBD producto = null;

        try {
            String query = "SELECT codigo,descripcion,precio,existencias,imagen,categoria FROM productos WHERE codigo=?";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setInt(1, codigo);
            ResultSet resultado = s.executeQuery();
            
            if (resultado.next()) {
                producto = new ProductoBD();
                producto.setCodigo(resultado.getInt("codigo"));
                producto.setDescripcion(resultado.getString("descripcion"));
                producto.setPrecio(resultado.getFloat("precio"));
                producto.setStock(resultado.getInt("existencias"));
                producto.setImagen(resultado.getString("imagen"));
                producto.setCategoria(resultado.getInt("categoria"));
            }
        } catch(Exception e) {
            System.err.println("Error ejecutando la consulta a la base de datos");
            System.err.println(e.getMessage());
        }
        
        return producto;
    }

    public boolean registrarUsuario(UsuarioBD usuario) {
        abrirConexionBD();
        try {
            String query = "INSERT INTO usuarios (usuario, clave, activo, admin, nombre, apellidos, domicilio, poblacion, provincia, cp, telefono, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setString(1, usuario.getUsuario());
            s.setString(2, usuario.getClave());
            s.setInt(3, 1); // Usuario activo por defecto
            s.setInt(4, 0); // No admin por defecto
            s.setString(5, usuario.getNombre());
            s.setString(6, usuario.getApellidos());
            s.setString(7, usuario.getDomicilio());
            s.setString(8, usuario.getPoblacion());
            s.setString(9, usuario.getProvincia());
            s.setString(10, usuario.getCp());
            s.setString(11, usuario.getTelefono());
            s.setString(12, usuario.getEmail());
            
            int filasAfectadas = s.executeUpdate();
            return filasAfectadas > 0;
        } catch(Exception e) {
            System.err.println("Error al registrar usuario");
            System.err.println(e.getMessage());
            return false;
        }
    }

    public UsuarioBD autenticarUsuario(String usuario, String clave) {
        abrirConexionBD();
        try {
            String query = "SELECT * FROM usuarios WHERE usuario = ? AND clave = ? AND activo = 1";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setString(1, usuario);
            s.setString(2, clave);
            
            ResultSet resultado = s.executeQuery();
            if (resultado.next()) {
                UsuarioBD usuarioBD = new UsuarioBD();
                usuarioBD.setCodigo(resultado.getInt("codigo"));
                usuarioBD.setUsuario(resultado.getString("usuario"));
                usuarioBD.setActivo(resultado.getInt("activo"));
                usuarioBD.setAdmin(resultado.getInt("admin"));
                usuarioBD.setNombre(resultado.getString("nombre"));
                usuarioBD.setApellidos(resultado.getString("apellidos"));
                usuarioBD.setDomicilio(resultado.getString("domicilio"));
                usuarioBD.setPoblacion(resultado.getString("poblacion"));
                usuarioBD.setProvincia(resultado.getString("provincia"));
                usuarioBD.setCp(resultado.getString("cp"));
                usuarioBD.setTelefono(resultado.getString("telefono"));
                usuarioBD.setEmail(resultado.getString("email"));
                return usuarioBD;
            }
            return null;
        } catch(Exception e) {
            System.err.println("Error al autenticar usuario");
            System.err.println(e.getMessage());
            return null;
        }
    }

    public boolean verificarContraseña(int codigoUsuario, String claveActual) {
        abrirConexionBD();
        try {
            // Hashear la clave actual con SHA-1
            String claveHash = claveActual;
            if (claveActual != null) {
                try {
                    java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-1");
                    byte[] hashBytes = md.digest(claveActual.getBytes("UTF-8"));
                    StringBuilder sb = new StringBuilder();
                    for (byte b : hashBytes) {
                        sb.append(String.format("%02x", b));
                    }
                    claveHash = sb.toString();
                } catch (Exception ex) {
                    return false;
                }
            }
            String query = "SELECT COUNT(*) FROM usuarios WHERE codigo = ? AND clave = ?";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setInt(1, codigoUsuario);
            s.setString(2, claveHash);
            ResultSet resultado = s.executeQuery();
            if (resultado.next()) {
                return resultado.getInt(1) > 0;
            }
            return false;
        } catch(Exception e) {
            System.err.println("Error al verificar contraseña");
            System.err.println(e.getMessage());
            return false;
        }
    }

    public boolean actualizarUsuario(UsuarioBD usuario, String nuevaClave) {
        abrirConexionBD();
        try {
            String query;
            PreparedStatement s;
            String nuevaClaveHash = nuevaClave;
            if (nuevaClave != null && !nuevaClave.isEmpty()) {
                // Hashear la nueva clave con SHA-1
                try {
                    java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-1");
                    byte[] hashBytes = md.digest(nuevaClave.getBytes("UTF-8"));
                    StringBuilder sb = new StringBuilder();
                    for (byte b : hashBytes) {
                        sb.append(String.format("%02x", b));
                    }
                    nuevaClaveHash = sb.toString();
                } catch (Exception ex) {
                    return false;
                }
                query = "UPDATE usuarios SET nombre=?, apellidos=?, domicilio=?, poblacion=?, provincia=?, cp=?, telefono=?, clave=? WHERE codigo=?";
                s = conexionBD.prepareStatement(query);
                s.setString(8, nuevaClaveHash);
                s.setInt(9, usuario.getCodigo());
            } else {
                query = "UPDATE usuarios SET nombre=?, apellidos=?, domicilio=?, poblacion=?, provincia=?, cp=?, telefono=? WHERE codigo=?";
                s = conexionBD.prepareStatement(query);
                s.setInt(8, usuario.getCodigo());
            }
            s.setString(1, usuario.getNombre());
            s.setString(2, usuario.getApellidos());
            s.setString(3, usuario.getDomicilio());
            s.setString(4, usuario.getPoblacion());
            s.setString(5, usuario.getProvincia());
            s.setString(6, usuario.getCp());
            s.setString(7, usuario.getTelefono());
            int filasAfectadas = s.executeUpdate();
            return filasAfectadas > 0;
        } catch(Exception e) {
            System.err.println("Error al actualizar usuario");
            System.err.println(e.getMessage());
            return false;
        }
    }

    public boolean verificarStock(int codigo, int cantidad, String sessionId) {
        try {
            String query = "SELECT existencias FROM productos WHERE codigo = ?";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setInt(1, codigo);
            ResultSet resultado = s.executeQuery();
            
            if (resultado.next()) {
                int stockDisponible = resultado.getInt("existencias");
                // Usar el sistema de stock temporal
                return StockTemporal.getInstance().reservarStock(codigo, sessionId, cantidad, stockDisponible);
            }
            return false;
        } catch(Exception e) {
            System.err.println("Error al verificar stock");
            System.err.println(e.getMessage());
            return false;
        }
    }

    public boolean actualizarStockTemporal(int codigo, int cantidad, boolean restar) {
        try {
            String query = "UPDATE productos SET existencias = existencias " + (restar ? "-" : "+") + " ? WHERE codigo = ?";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setInt(1, cantidad);
            s.setInt(2, codigo);
            
            int filasAfectadas = s.executeUpdate();
            return filasAfectadas > 0;
        } catch(Exception e) {
            System.err.println("Error al actualizar stock temporal");
            System.err.println(e.getMessage());
            return false;
        }
    }

    public boolean procesarCompra(int codigoUsuario, HashMap<Integer, Integer> carrito, String sessionId) {
        try {
            conexionBD.setAutoCommit(false);
            
            // Crear el pedido
            String insertPedido = "INSERT INTO pedidos (persona, fecha, estado) VALUES (?, NOW(), 1)";
            PreparedStatement sPedido = conexionBD.prepareStatement(insertPedido, Statement.RETURN_GENERATED_KEYS);
            sPedido.setInt(1, codigoUsuario);
            sPedido.executeUpdate();
            
            ResultSet rs = sPedido.getGeneratedKeys();
            if (!rs.next()) {
                conexionBD.rollback();
                return false;
            }
            int codigoPedido = rs.getInt(1);
            
            float importeTotal = 0;
            
            // Verificar y actualizar el stock de cada producto
            for (Map.Entry<Integer, Integer> item : carrito.entrySet()) {
                int codigoProducto = item.getKey();
                int cantidad = item.getValue();
                
                // Verificar stock actual
                String queryStock = "SELECT existencias, precio FROM productos WHERE codigo = ? FOR UPDATE";
                PreparedStatement sStock = conexionBD.prepareStatement(queryStock);
                sStock.setInt(1, codigoProducto);
                ResultSet rsStock = sStock.executeQuery();
                
                if (!rsStock.next() || rsStock.getInt("existencias") < cantidad) {
                    conexionBD.rollback();
                    return false;
                }
                
                float precioUnitario = rsStock.getFloat("precio");
                importeTotal += precioUnitario * cantidad;
                
                // Actualizar stock
                String updateStock = "UPDATE productos SET existencias = existencias - ? WHERE codigo = ?";
                PreparedStatement sUpdateStock = conexionBD.prepareStatement(updateStock);
                sUpdateStock.setInt(1, cantidad);
                sUpdateStock.setInt(2, codigoProducto);
                sUpdateStock.executeUpdate();
                
                // Insertar detalle de pedido
                String insertDetalle = "INSERT INTO detalle (codigo_pedido, codigo_producto, unidades, precio_unitario) VALUES (?, ?, ?, ?)";
                PreparedStatement sDetalle = conexionBD.prepareStatement(insertDetalle);
                sDetalle.setInt(1, codigoPedido);
                sDetalle.setInt(2, codigoProducto);
                sDetalle.setInt(3, cantidad);
                sDetalle.setFloat(4, precioUnitario);
                sDetalle.executeUpdate();
                
                // Liberar el stock temporal
                StockTemporal.getInstance().liberarStock(codigoProducto, sessionId);
            }
            
            // Actualizar el importe total del pedido
            String updateImporte = "UPDATE pedidos SET importe = ? WHERE codigo = ?";
            PreparedStatement sImporte = conexionBD.prepareStatement(updateImporte);
            sImporte.setFloat(1, importeTotal);
            sImporte.setInt(2, codigoPedido);
            sImporte.executeUpdate();
            
            conexionBD.commit();
            conexionBD.setAutoCommit(true);
            return true;
            
        } catch (Exception e) {
            try {
                conexionBD.rollback();
                conexionBD.setAutoCommit(true);
            } catch (SQLException se) {
                System.err.println("Error en rollback: " + se.getMessage());
            }
            System.err.println("Error procesando la compra: " + e.getMessage());
            return false;
        }
    }

    public List<Map<String, Object>> obtenerPedidosUsuario(int codigoUsuario) {
        List<Map<String, Object>> pedidos = new ArrayList<>();
        try {
            abrirConexionBD();        String sql = "SELECT p.codigo, p.fecha, p.importe, e.descripcion as estado, " +
                    "d.codigo_producto, d.unidades, d.precio_unitario, " +
                    "pr.descripcion as descripcion " +
                    "FROM pedidos p " +
                    "JOIN detalle d ON p.codigo = d.codigo_pedido " +
                    "JOIN productos pr ON d.codigo_producto = pr.codigo " +
                    "JOIN estados e ON p.estado = e.codigo " +
                    "WHERE p.persona = ? " +
                    "ORDER BY p.fecha DESC, p.codigo DESC";
            
            PreparedStatement stmt = conexionBD.prepareStatement(sql);
            stmt.setInt(1, codigoUsuario);
            ResultSet rs = stmt.executeQuery();

            Map<Integer, Map<String, Object>> pedidosMap = new HashMap<>();
            
            while (rs.next()) {
                int codigoPedido = rs.getInt("codigo");
                
                if (!pedidosMap.containsKey(codigoPedido)) {
                    Map<String, Object> pedido = new HashMap<>();
                    pedido.put("codigo", codigoPedido);
                    pedido.put("fecha", rs.getTimestamp("fecha"));
                    pedido.put("importe", rs.getDouble("importe"));
                    pedido.put("estado", rs.getString("estado"));
                    pedido.put("productos", new ArrayList<Map<String, Object>>());
                    pedidosMap.put(codigoPedido, pedido);
                }
                
                Map<String, Object> producto = new HashMap<>();            producto.put("codigo", rs.getInt("codigo_producto")); // Código del producto
            producto.put("descripcion", rs.getString("descripcion")); // Descripción del producto
            producto.put("precio", rs.getDouble("precio_unitario")); // Precio unitario del detalle
            producto.put("unidades", rs.getInt("unidades")); // Unidades del detalle
                
                ((List<Map<String, Object>>) pedidosMap.get(codigoPedido).get("productos")).add(producto);
            }
            
            pedidos.addAll(pedidosMap.values());
            
        } catch (Exception e) {
            System.err.println("Error al obtener pedidos del usuario: " + e.getMessage());
        }
        return pedidos;
    }    public boolean cancelarPedido(int codigoPedido, int codigoUsuario) {
        try {
            abrirConexionBD();
            conexionBD.setAutoCommit(false);
            
            // Verificar que el pedido pertenece al usuario y está pendiente
            String checkPedido = "SELECT p.estado FROM pedidos p JOIN estados e ON p.estado = e.codigo WHERE p.codigo = ? AND p.persona = ? AND e.descripcion = 'pendiente'";
            PreparedStatement checkStmt = conexionBD.prepareStatement(checkPedido);
            checkStmt.setInt(1, codigoPedido);
            checkStmt.setInt(2, codigoUsuario);
            ResultSet rs = checkStmt.executeQuery();
            
            if (!rs.next()) {
                conexionBD.rollback();
                return false;
            }
              // Obtener los productos y cantidades del pedido
            String selectProductos = "SELECT codigo_producto, unidades FROM detalle WHERE codigo_pedido = ?";
            PreparedStatement selectStmt = conexionBD.prepareStatement(selectProductos);
            selectStmt.setInt(1, codigoPedido);
            ResultSet prodRs = selectStmt.executeQuery();
            
            // Devolver el stock para cada producto
            while (prodRs.next()) {
                int codigoProducto = prodRs.getInt("codigo_producto");
                int unidades = prodRs.getInt("unidades");
                
                String updateStock = "UPDATE productos SET existencias = existencias + ? WHERE codigo = ?";
                PreparedStatement updateStmt = conexionBD.prepareStatement(updateStock);
                updateStmt.setInt(1, unidades);
                updateStmt.setInt(2, codigoProducto);
                updateStmt.executeUpdate();
            }
            
            // Cancelar el pedido
            String updatePedido = "UPDATE pedidos SET estado = (SELECT codigo FROM estados WHERE descripcion = 'cancelado') WHERE codigo = ?";
            PreparedStatement updateStmt = conexionBD.prepareStatement(updatePedido);
            updateStmt.setInt(1, codigoPedido);
            updateStmt.executeUpdate();
            
            conexionBD.commit();
            return true;
        } catch (Exception e) {
            System.err.println("Error al cancelar el pedido: " + e.getMessage());
            try {
                conexionBD.rollback();
            } catch (SQLException se) {
                System.err.println("Error al hacer rollback: " + se.getMessage());
            }
            return false;
        } finally {
            try {
                conexionBD.setAutoCommit(true);
            } catch (SQLException se) {
                System.err.println("Error al restaurar autocommit: " + se.getMessage());
            }
        }
    }

    public void actualizarEstadosPedidos() {
        try {
            // Cambiar de pendiente (1) a enviado (2) después de 5 minutos
            String updatePendientes = "UPDATE pedidos SET estado = 2 " +
                                   "WHERE estado = 1 " +
                                   "AND TIMESTAMPDIFF(MINUTE, fecha, NOW()) >= 5";
            PreparedStatement sPendientes = conexionBD.prepareStatement(updatePendientes);
            sPendientes.executeUpdate();

            // Cambiar de enviado (2) a entregado (3) después de 5 minutos más (10 minutos desde la creación)
            String updateEnviados = "UPDATE pedidos SET estado = 3 " +
                                  "WHERE estado = 2 " +
                                  "AND TIMESTAMPDIFF(MINUTE, fecha, NOW()) >= 10";
            PreparedStatement sEnviados = conexionBD.prepareStatement(updateEnviados);
            sEnviados.executeUpdate();

        } catch (Exception e) {
            System.err.println("Error actualizando estados de pedidos: " + e.getMessage());
        }
    }

    public String verificarUsuarioExistente(String usuario, String email) {
        abrirConexionBD();
        try {
            String query = "SELECT usuario, email FROM usuarios WHERE usuario = ? OR email = ?";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setString(1, usuario);
            s.setString(2, email);
            
            ResultSet resultado = s.executeQuery();
            if (resultado.next()) {
                if (resultado.getString("usuario").equals(usuario)) {
                    return "usuario";
                } else {
                    return "email";
                }
            }
            return null;
        } catch(Exception e) {
            System.err.println("Error al verificar usuario existente");
            System.err.println(e.getMessage());
            return null;
        }
    }

    public List<ProductoBD> obtenerProductosPaginados(int categoria, int pagina, int productosPorPagina) {
        abrirConexionBD();
        ArrayList<ProductoBD> productos = new ArrayList<>();
        int offset = (pagina - 1) * productosPorPagina;

        try {
            String query;
            PreparedStatement s;
            
            if (categoria == 0) {
                query = "SELECT codigo,descripcion,precio,existencias,imagen,categoria FROM productos LIMIT ? OFFSET ?";
                s = conexionBD.prepareStatement(query);
                s.setInt(1, productosPorPagina);
                s.setInt(2, offset);
            } else {
                query = "SELECT codigo,descripcion,precio,existencias,imagen,categoria FROM productos WHERE categoria=? LIMIT ? OFFSET ?";
                s = conexionBD.prepareStatement(query);
                s.setInt(1, categoria);
                s.setInt(2, productosPorPagina);
                s.setInt(3, offset);
            }

            ResultSet resultado = s.executeQuery();
            while(resultado.next()){
                ProductoBD producto = new ProductoBD();
                producto.setCodigo(resultado.getInt("codigo"));
                producto.setDescripcion(resultado.getString("descripcion"));
                producto.setPrecio(resultado.getFloat("precio"));
                producto.setStock(resultado.getInt("existencias"));
                producto.setImagen(resultado.getString("imagen"));
                producto.setCategoria(resultado.getInt("categoria"));
                productos.add(producto);
            }
        } catch(Exception e) {
            System.err.println("Error ejecutando la consulta a la base de datos");
            System.err.println(e.getMessage());
        }
        return productos;
    }

    public int obtenerTotalProductos(int categoria) {
        abrirConexionBD();
        int total = 0;
        
        try {
            String query;
            PreparedStatement s;
            
            if (categoria == 0) {
                query = "SELECT COUNT(*) as total FROM productos";
                s = conexionBD.prepareStatement(query);
            } else {
                query = "SELECT COUNT(*) as total FROM productos WHERE categoria=?";
                s = conexionBD.prepareStatement(query);
                s.setInt(1, categoria);
            }

            ResultSet resultado = s.executeQuery();
            if (resultado.next()) {
                total = resultado.getInt("total");
            }
        } catch(Exception e) {
            System.err.println("Error obteniendo el total de productos");
            System.err.println(e.getMessage());
        }
        return total;
    }

    public List<Map<String, Object>> obtenerCategorias() {
        abrirConexionBD();
        List<Map<String, Object>> categorias = new ArrayList<>();
        
        try {
            String query = "SELECT codigo, descripcion FROM categorias ORDER BY codigo";
            PreparedStatement s = conexionBD.prepareStatement(query);
            ResultSet resultado = s.executeQuery();
            
            while (resultado.next()) {
                Map<String, Object> categoria = new HashMap<>();
                categoria.put("codigo", resultado.getInt("codigo"));
                categoria.put("descripcion", resultado.getString("descripcion"));
                categorias.add(categoria);
            }
        } catch(Exception e) {
            System.err.println("Error obteniendo las categorías");
            System.err.println(e.getMessage());
        }
        return categorias;
    }

    public List<ProductoBD> buscarProductos(String termino) {
        abrirConexionBD();
        ArrayList<ProductoBD> productos = new ArrayList<>();

        try {
            String query = "SELECT codigo, descripcion, precio, existencias, imagen, categoria FROM productos WHERE LOWER(descripcion) LIKE ?";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setString(1, "%" + termino.toLowerCase() + "%");
            
            ResultSet resultado = s.executeQuery();
            while(resultado.next()) {
                ProductoBD producto = new ProductoBD();
                producto.setCodigo(resultado.getInt("codigo"));
                producto.setDescripcion(resultado.getString("descripcion"));
                producto.setPrecio(resultado.getFloat("precio"));
                producto.setStock(resultado.getInt("existencias"));
                producto.setImagen(resultado.getString("imagen"));
                producto.setCategoria(resultado.getInt("categoria"));
                productos.add(producto);
            }
        } catch(Exception e) {
            System.err.println("Error ejecutando la búsqueda de productos");
            System.err.println(e.getMessage());
        }
        return productos;
    }

    /**
     * Edita un pedido pendiente cancelando productos individuales y devolviendo stock.
     * Si el pedido queda vacío, lo cancela.
     */
    public boolean editarPedidoProductos(int codigoPedido, int codigoUsuario, List<Map<String, Integer>> productosCancelar) {
    abrirConexionBD();
    boolean todoOk = false;
    
    try {
        conexionBD.setAutoCommit(false);
        
        // Verificar que el pedido pertenece al usuario y está pendiente
        String checkPedido = "SELECT p.estado FROM pedidos p JOIN estados e ON p.estado = e.codigo WHERE p.codigo = ? AND p.persona = ? AND e.descripcion = 'pendiente'";
        PreparedStatement checkStmt = conexionBD.prepareStatement(checkPedido);
        checkStmt.setInt(1, codigoPedido);
        checkStmt.setInt(2, codigoUsuario);
        ResultSet rs = checkStmt.executeQuery();
            
            if (!rs.next()) {
                System.err.println("El pedido no existe, no pertenece al usuario o no está pendiente");
                conexionBD.rollback();
                return false;
            }
            
            // Por cada producto a cancelar
            for (Map<String, Integer> producto : productosCancelar) {
                int codigoProducto = producto.get("codigo");
                int cantidadCancelar = producto.get("cantidad");
                      if (cantidadCancelar > 0) {
                // Verificar que la cantidad a cancelar es válida
                String checkCantidad = "SELECT unidades FROM detalle WHERE codigo_pedido = ? AND codigo_producto = ? AND unidades >= ?";
                PreparedStatement checkCantidadStmt = conexionBD.prepareStatement(checkCantidad);
                checkCantidadStmt.setInt(1, codigoPedido);
                checkCantidadStmt.setInt(2, codigoProducto);
                checkCantidadStmt.setInt(3, cantidadCancelar);
                ResultSet rsCantidad = checkCantidadStmt.executeQuery();
                
                if (!rsCantidad.next()) {
                    System.err.println("Cantidad a cancelar inválida para el producto " + codigoProducto);
                    conexionBD.rollback();
                    return false;
                }
                
                // Actualizar la cantidad en detalle
                String updatePedidoProd = "UPDATE detalle SET unidades = unidades - ? " +
                                        "WHERE codigo_pedido = ? AND codigo_producto = ?";
                PreparedStatement updatePedidoStmt = conexionBD.prepareStatement(updatePedidoProd);
                updatePedidoStmt.setInt(1, cantidadCancelar);
                updatePedidoStmt.setInt(2, codigoPedido);
                updatePedidoStmt.setInt(3, codigoProducto);
                updatePedidoStmt.executeUpdate();
                    
                    // Devolver el stock al producto
                    String updateStock = "UPDATE productos SET existencias = existencias + ? WHERE codigo = ?";
                    PreparedStatement updateStockStmt = conexionBD.prepareStatement(updateStock);
                    updateStockStmt.setInt(1, cantidadCancelar);
                    updateStockStmt.setInt(2, codigoProducto);
                    updateStockStmt.executeUpdate();
                          // Actualizar el importe total del pedido
                String updateImporte = "UPDATE pedidos p " +
                                     "SET importe = (SELECT SUM(d.unidades * d.precio_unitario) " +
                                     "               FROM detalle d " +
                                     "               WHERE d.codigo_pedido = ?) " +
                                     "WHERE p.codigo = ?";
                PreparedStatement updateImporteStmt = conexionBD.prepareStatement(updateImporte);
                updateImporteStmt.setInt(1, codigoPedido);
                updateImporteStmt.setInt(2, codigoPedido);
                updateImporteStmt.executeUpdate();
                }
            }
                  // Verificar si quedan productos en el pedido
        String checkProductos = "SELECT COUNT(*) as total FROM detalle WHERE codigo_pedido = ? AND unidades > 0";
        PreparedStatement checkProdStmt = conexionBD.prepareStatement(checkProductos);
        checkProdStmt.setInt(1, codigoPedido);
        ResultSet rsProd = checkProdStmt.executeQuery();
        
        if (rsProd.next() && rsProd.getInt("total") == 0) {
            // Si no quedan productos, cancelar el pedido (asumiendo que el estado 'cancelado' tiene código 3)
            String cancelarPedido = "UPDATE pedidos SET estado = (SELECT codigo FROM estados WHERE descripcion = 'cancelado') WHERE codigo = ?";
            PreparedStatement cancelarStmt = conexionBD.prepareStatement(cancelarPedido);
            cancelarStmt.setInt(1, codigoPedido);
            cancelarStmt.executeUpdate();
            }
            
            conexionBD.commit();
            todoOk = true;
        } catch (Exception e) {
            System.err.println("Error al editar el pedido: " + e.getMessage());
            try {
                conexionBD.rollback();
            } catch (SQLException se) {
                System.err.println("Error al hacer rollback: " + se.getMessage());
            }
        } finally {
            try {
                conexionBD.setAutoCommit(true);
            } catch (SQLException se) {
                System.err.println("Error al restaurar autocommit: " + se.getMessage());
            }
        }
        return todoOk;
    }
}