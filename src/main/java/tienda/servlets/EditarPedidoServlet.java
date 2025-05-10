package tienda.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tienda.AccesoBD;
import tienda.UsuarioBD;
import com.google.gson.JsonObject;

@WebServlet("/editarPedido")
public class EditarPedidoServlet extends HttpServlet {
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
            BufferedReader reader = request.getReader();
            Gson gson = new Gson();
            Map<String, Object> body = gson.fromJson(reader, new TypeToken<Map<String, Object>>(){}.getType());
            int codigoPedido = ((Double) body.get("codigoPedido")).intValue();
            List<Map<String, Object>> productosCancelar = (List<Map<String, Object>>) body.get("productosCancelar");
            // Convertir a lista de Map<String, Integer>
            List<Map<String, Integer>> productos = new java.util.ArrayList<>();
            for (Map<String, Object> prod : productosCancelar) {
                int codigo = ((Double) prod.get("codigo")).intValue();
                int cantidad = ((Double) prod.get("cantidad")).intValue();
                Map<String, Integer> map = new java.util.HashMap<>();
                map.put("codigo", codigo);
                map.put("cantidad", cantidad);
                productos.add(map);
            }
            AccesoBD bd = AccesoBD.getInstance();
            boolean editado = bd.editarPedidoProductos(codigoPedido, usuario.getCodigo(), productos);
            if (editado) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Pedido editado correctamente");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "No se pudo editar el pedido");
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error al editar el pedido: " + e.getMessage());
        }
        response.getWriter().write(jsonResponse.toString());
    }
}
