package tienda.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tienda.UsuarioBD;
import com.google.gson.JsonObject;

@WebServlet("/check-session")
public class CheckSessionServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        JsonObject jsonResponse = new JsonObject();
        HttpSession session = request.getSession(false);
        
        if (session != null && session.getAttribute("usuario") != null) {
            UsuarioBD usuario = (UsuarioBD) session.getAttribute("usuario");
            jsonResponse.addProperty("authenticated", true);
            jsonResponse.addProperty("nombre", usuario.getNombre());
            jsonResponse.addProperty("admin", usuario.getAdmin() == 1);
        } else {
            jsonResponse.addProperty("authenticated", false);
        }
        
        response.getWriter().write(jsonResponse.toString());
    }
}