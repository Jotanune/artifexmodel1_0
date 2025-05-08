package tienda.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tienda.AccesoBD;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/limpiarCarrito")
public class LimpiarCarritoServlet extends HttpServlet {
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        
        if (session != null) {
            @SuppressWarnings("unchecked")
            HashMap<Integer, Integer> carrito = (HashMap<Integer, Integer>) session.getAttribute("carrito");
            
            if (carrito != null && !carrito.isEmpty()) {
                AccesoBD bd = AccesoBD.getInstance();
                
                // Restaurar el stock de todos los productos en el carrito
                for (Map.Entry<Integer, Integer> entry : carrito.entrySet()) {
                    bd.actualizarStockTemporal(entry.getKey(), entry.getValue(), false);
                }
                
                session.removeAttribute("carrito");
            }
        }
        
        response.setContentType("application/json");
        response.getWriter().write("{\"success\": true}");
    }
}