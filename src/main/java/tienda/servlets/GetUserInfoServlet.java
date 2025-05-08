package tienda.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tienda.UsuarioBD;

@WebServlet("/getUserInfo")
public class GetUserInfoServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        HttpSession session = request.getSession(false);
        
        if (session != null && session.getAttribute("usuario") != null) {
            UsuarioBD usuario = (UsuarioBD) session.getAttribute("usuario");
            String jsonResponse = String.format(
                "{\"loggedIn\": true, \"usuario\": \"%s\"}", 
                usuario.getUsuario()
            );
            response.getWriter().write(jsonResponse);
        } else {
            response.getWriter().write("{\"loggedIn\": false}");
        }
    }
}