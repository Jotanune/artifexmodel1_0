package tienda.servlets;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tienda.AccesoBD;
import tienda.UsuarioBD;
import com.google.gson.Gson;

@WebServlet("/obtenerPedidos")
public class ObtenerPedidosServlet extends HttpServlet {
    private Gson gson = new Gson();

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        
        HttpSession session = request.getSession();
        UsuarioBD usuario = (UsuarioBD) session.getAttribute("usuario");
        
        if (usuario == null) {
            response.getWriter().write("[]");
            return;
        }

        AccesoBD bd = AccesoBD.getInstance();
        List<Map<String, Object>> pedidos = bd.obtenerPedidosUsuario(usuario.getCodigo());
        
        response.getWriter().write(gson.toJson(pedidos));
    }
}