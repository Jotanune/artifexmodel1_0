package tienda.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tienda.AccesoBD;
import tienda.UsuarioBD;
import com.google.gson.JsonObject;

@WebServlet("/actualizarUsuario")
public class ActualizarUsuarioServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        JsonObject jsonResponse = new JsonObject();
        
        HttpSession session = request.getSession();
        UsuarioBD usuario = (UsuarioBD) session.getAttribute("usuario");
        
        if (usuario == null) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "No hay sesión de usuario");
            response.getWriter().write(jsonResponse.toString());
            return;
        }

        String accion = request.getParameter("accion");
        AccesoBD bd = AccesoBD.getInstance();

        if ("verificarClave".equals(accion)) {
            String claveActual = request.getParameter("claveActual");
            boolean esCorrecta = bd.verificarContraseña(usuario.getCodigo(), claveActual);
            jsonResponse.addProperty("success", esCorrecta);
            jsonResponse.addProperty("message", esCorrecta ? "Contraseña correcta" : "Contraseña incorrecta");
        } 
        else if ("actualizar".equals(accion)) {
            String nuevaClave = request.getParameter("nuevaClave");
            
            // Preservar los datos existentes si no se proporcionan nuevos valores
            String nombre = request.getParameter("nombre");
            if (nombre != null && !nombre.trim().isEmpty()) {
                usuario.setNombre(nombre);
            }
            
            String apellidos = request.getParameter("apellidos");
            if (apellidos != null && !apellidos.trim().isEmpty()) {
                usuario.setApellidos(apellidos);
            }
            
            String telefono = request.getParameter("telefono");
            usuario.setTelefono(telefono != null && !telefono.trim().isEmpty() ? telefono : usuario.getTelefono());
            
            String domicilio = request.getParameter("domicilio");
            usuario.setDomicilio(domicilio != null && !domicilio.trim().isEmpty() ? domicilio : usuario.getDomicilio());
            
            String poblacion = request.getParameter("poblacion");
            usuario.setPoblacion(poblacion != null && !poblacion.trim().isEmpty() ? poblacion : usuario.getPoblacion());
            
            String provincia = request.getParameter("provincia");
            usuario.setProvincia(provincia != null && !provincia.trim().isEmpty() ? provincia : usuario.getProvincia());
            
            String cp = request.getParameter("cp");
            usuario.setCp(cp != null && !cp.trim().isEmpty() ? cp : usuario.getCp());
            
            boolean actualizado = bd.actualizarUsuario(usuario, nuevaClave);
            
            if (actualizado) {
                session.setAttribute("usuario", usuario);
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Datos actualizados correctamente");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Error al actualizar los datos");
            }
        }
        
        response.getWriter().write(jsonResponse.toString());
    }
}