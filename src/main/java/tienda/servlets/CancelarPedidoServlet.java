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

@WebServlet("/cancelarPedido")
public class CancelarPedidoServlet extends HttpServlet {
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        JsonObject jsonResponse = new JsonObject();
        
        HttpSession session = request.getSession();
        UsuarioBD usuario = (UsuarioBD) session.getAttribute("usuario");
        
        if (usuario == null) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Usuario no autenticado");
            response.getWriter().write(jsonResponse.toString());
            return;
        }

        try {
            int codigoPedido = Integer.parseInt(request.getParameter("codigoPedido"));
            AccesoBD bd = AccesoBD.getInstance();
            boolean cancelado = bd.cancelarPedido(codigoPedido, usuario.getCodigo());
            
            if (cancelado) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Pedido cancelado correctamente");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "No se pudo cancelar el pedido");
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error al cancelar el pedido: " + e.getMessage());
        }
        
        response.getWriter().write(jsonResponse.toString());
    }
}