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
import com.google.gson.JsonParser;
import java.io.BufferedReader;
import java.util.HashMap;

@WebServlet("/compra")
public class CompraServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        JsonObject jsonResponse = new JsonObject();
        
        HttpSession session = request.getSession();
        UsuarioBD usuario = (UsuarioBD) session.getAttribute("usuario");
        String sessionId = session.getId();
        
        if (usuario == null) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Debes iniciar sesión para realizar la compra");
            response.getWriter().write(jsonResponse.toString());
            return;
        }

        @SuppressWarnings("unchecked")
        HashMap<Integer, Integer> carrito = (HashMap<Integer, Integer>) session.getAttribute("carrito");
        if (carrito == null || carrito.isEmpty()) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "El carrito está vacío");
            response.getWriter().write(jsonResponse.toString());
            return;
        }

        try {
            // Leer el cuerpo JSON de la petición
            BufferedReader reader = request.getReader();
            JsonObject jsonRequest = JsonParser.parseReader(reader).getAsJsonObject();
            JsonObject datosEnvio = jsonRequest.getAsJsonObject("datosEnvio");

            // Actualizar los datos de envío del usuario
            usuario.setDomicilio(datosEnvio.get("domicilio").getAsString());
            usuario.setPoblacion(datosEnvio.get("poblacion").getAsString());
            usuario.setProvincia(datosEnvio.get("provincia").getAsString());
            usuario.setCp(datosEnvio.get("cp").getAsString());

            AccesoBD bd = AccesoBD.getInstance();
            // Actualizar los datos del usuario primero
            boolean actualizacionExitosa = bd.actualizarUsuario(usuario, null);
            
            if (!actualizacionExitosa) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Error al actualizar los datos de envío");
                response.getWriter().write(jsonResponse.toString());
                return;
            }

            // Procesar la compra
            boolean compraExitosa = bd.procesarCompra(usuario.getCodigo(), carrito, sessionId);
            
            if (compraExitosa) {
                session.removeAttribute("carrito"); // Vaciar el carrito después de la compra
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "¡Compra realizada con éxito!");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Error al procesar la compra. El stock puede haber cambiado.");
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error al procesar la compra: " + e.getMessage());
        }

        response.getWriter().write(jsonResponse.toString());
    }
}