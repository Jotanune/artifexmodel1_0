package tienda.servlets;

import java.io.IOException;
import java.security.MessageDigest;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tienda.AccesoBD;
import tienda.UsuarioBD;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String usuario = request.getParameter("usuario");
        String clave = request.getParameter("clave");
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
                response.sendRedirect("login.jsp?error=true");
                return;
            }
        }
        AccesoBD db = AccesoBD.getInstance();
        UsuarioBD usuarioBD = db.autenticarUsuario(usuario, claveHash);
        
        if (usuarioBD != null) {
            HttpSession session = request.getSession();
            session.setAttribute("usuario", usuarioBD);
            
            if (usuarioBD.getAdmin() == 1) {
                response.sendRedirect("admin/index.html");
            } else {
                response.sendRedirect("my-account.jsp");
            }
        } else {
            response.sendRedirect("login.jsp?error=true");
        }
    }
}