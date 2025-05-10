package tienda.servlets;

import java.io.IOException;
import java.security.MessageDigest;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tienda.AccesoBD;
import tienda.UsuarioBD;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String usuario = request.getParameter("usuario");
        String email = request.getParameter("email");
        
        AccesoBD db = AccesoBD.getInstance();
        String duplicado = null;
        
        if (usuario != null && !usuario.isEmpty()) {
            duplicado = db.verificarUsuarioExistente(usuario, "");
        } else if (email != null && !email.isEmpty()) {
            duplicado = db.verificarUsuarioExistente("", email);
        }
        
        String json = "{\"error\": " + (duplicado != null ? "\"" + duplicado + "\"" : "null") + "}";
        response.getWriter().write(json);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String accion = request.getParameter("accion");
        AccesoBD db = AccesoBD.getInstance();
        
        // Verificación de usuario o email duplicado
        if ("verificar".equals(accion)) {
            String usuario = request.getParameter("usuario");
            String email = request.getParameter("email");
            
            String duplicado = null;
            if (usuario != null) {
                duplicado = db.verificarUsuarioExistente(usuario, "");
            } else if (email != null) {
                duplicado = db.verificarUsuarioExistente("", email);
            }
            
            String json = "{\"error\": \"" + (duplicado != null ? duplicado : "") + "\"}";
            response.getWriter().write(json);
            return;
        }
        
        // Proceso de registro
        if ("registrar".equals(accion)) {
            UsuarioBD usuario = new UsuarioBD();
            String username = request.getParameter("usuario");
            String email = request.getParameter("email");
            String clave = request.getParameter("clave");
            if (clave != null && clave.length() > 40) {
                String json = "{\"error\": \"clave_larga\"}";
                response.getWriter().write(json);
                return;
            }
            
            // Hashear la contraseña con SHA-1
            String claveHash = clave;
            if (clave != null) {
                try {
                    MessageDigest md = MessageDigest.getInstance("SHA-1");
                    byte[] hashBytes = md.digest(clave.getBytes("UTF-8"));
                    StringBuilder sb = new StringBuilder();
                    for (byte b : hashBytes) {
                        sb.append(String.format("%02x", b));
                    }
                    claveHash = sb.toString();
                } catch (Exception ex) {
                    response.getWriter().write("{\"error\": \"hash\"}");
                    return;
                }
            }
            
            // Verificación final antes de registrar
            String duplicado = db.verificarUsuarioExistente(username, email);
            if (duplicado != null) {
                String json = "{\"error\": \"" + duplicado + "\"}";
                response.getWriter().write(json);
                return;
            }
            
            // Configurar usuario con los datos del formulario
            usuario.setUsuario(username);
            usuario.setClave(claveHash);
            usuario.setNombre(request.getParameter("nombre"));
            usuario.setApellidos(request.getParameter("apellidos"));            usuario.setEmail(email);
            // Establecer valores por defecto para los campos eliminados
            usuario.setDomicilio("");
            usuario.setPoblacion("");
            usuario.setProvincia("");
            usuario.setCp("");
            usuario.setTelefono("");
            usuario.setActivo(1);
            usuario.setAdmin(0);

            boolean registroExitoso = db.registrarUsuario(usuario);
            String json = registroExitoso ? 
                "{\"success\": true}" : 
                "{\"error\": \"registro\"}";
            response.getWriter().write(json);
        }
    }
}