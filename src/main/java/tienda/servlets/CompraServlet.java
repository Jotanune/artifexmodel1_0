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
import tienda.StockTemporal;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.util.HashMap;

@WebServlet("/compra")
public class CompraServlet extends HttpServlet {
    private Gson gson = new Gson();

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

        HashMap<Integer, Integer> carrito = (HashMap<Integer, Integer>) session.getAttribute("carrito");
        if (carrito == null || carrito.isEmpty()) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "El carrito está vacío");
            response.getWriter().write(jsonResponse.toString());
            return;
        }

        try {
            AccesoBD bd = AccesoBD.getInstance();
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