package tienda.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tienda.AccesoBD;
import tienda.ProductoBD;
import com.google.gson.JsonObject;

@WebServlet("/obtenerProducto")
public class ObtenerProductoServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        JsonObject jsonResponse = new JsonObject();
        
        try {
            int codigo = Integer.parseInt(request.getParameter("codigo"));
            AccesoBD bd = AccesoBD.getInstance();
            ProductoBD producto = bd.obtenerProductoPorCodigo(codigo);
            
            if (producto != null) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("codigo", producto.getCodigo());
                jsonResponse.addProperty("descripcion", producto.getDescripcion());
                jsonResponse.addProperty("precio", producto.getPrecio());
                jsonResponse.addProperty("stock", producto.getStock());
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Producto no encontrado");
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error al obtener el producto: " + e.getMessage());
        }
        
        response.getWriter().write(jsonResponse.toString());
    }
}