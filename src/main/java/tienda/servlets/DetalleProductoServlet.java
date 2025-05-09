package tienda.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tienda.AccesoBD;
import tienda.ProductoBD;

@WebServlet("/detalle-producto")
public class DetalleProductoServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String codigoStr = request.getParameter("codigo");
        if (codigoStr != null && !codigoStr.trim().isEmpty()) {
            try {
                int codigo = Integer.parseInt(codigoStr);
                AccesoBD bd = AccesoBD.getInstance();
                ProductoBD producto = bd.obtenerProductoPorCodigo(codigo);
                
                if (producto != null) {
                    request.setAttribute("producto", producto);
                    request.getRequestDispatcher("/detalle-producto.jsp").forward(request, response);
                    return;
                }
            } catch (NumberFormatException e) {
                // Si el código no es un número válido
            }
        }
        
        // Si algo falla, redirigir a la página de productos
        response.sendRedirect("productos.jsp");
    }
}
