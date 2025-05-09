package tienda.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tienda.AccesoBD;
import tienda.StockTemporal;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.util.HashMap;

@WebServlet("/carrito")
public class CarritoServlet extends HttpServlet {
    private Gson gson = new Gson();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        JsonObject jsonResponse = new JsonObject();
        
        String action = request.getParameter("action");
        int codigo = Integer.parseInt(request.getParameter("codigo"));
        AccesoBD bd = AccesoBD.getInstance();
        HttpSession session = request.getSession();
        String sessionId = session.getId();

        @SuppressWarnings("unchecked")
        HashMap<Integer, Integer> carrito = (HashMap<Integer, Integer>) session.getAttribute("carrito");
        if (carrito == null) {
            carrito = new HashMap<>();
            session.setAttribute("carrito", carrito);
        }

        try {
            switch (action) {
                case "add":
                    int cantidad = Integer.parseInt(request.getParameter("cantidad"));
                    int cantidadActual = carrito.getOrDefault(codigo, 0);
                    int cantidadTotal = cantidadActual + cantidad;
                    // Verificar y reservar la cantidad total deseada
                    if (bd.verificarStock(codigo, cantidadTotal, sessionId)) {
                        carrito.put(codigo, cantidadTotal);
                        jsonResponse.addProperty("success", true);
                        jsonResponse.addProperty("message", "Producto añadido al carrito");
                    } else {
                        jsonResponse.addProperty("success", false);
                        jsonResponse.addProperty("message", "No hay suficiente stock disponible");
                    }
                    break;

                case "decrease":
                    if (carrito.containsKey(codigo)) {
                        int cantidadActualDecrease = carrito.get(codigo);
                        if (cantidadActualDecrease > 1) {
                            carrito.put(codigo, cantidadActualDecrease - 1);
                            StockTemporal.getInstance().liberarStock(codigo, sessionId);
                            jsonResponse.addProperty("success", true);
                            jsonResponse.addProperty("message", "Cantidad actualizada");
                        } else {
                            StockTemporal.getInstance().liberarStock(codigo, sessionId);
                            carrito.remove(codigo);
                            jsonResponse.addProperty("success", true);
                            jsonResponse.addProperty("message", "Producto eliminado del carrito");
                        }
                    }
                    break;

                case "remove":
                    if (carrito.containsKey(codigo)) {
                        StockTemporal.getInstance().liberarStock(codigo, sessionId);
                        carrito.remove(codigo);
                        jsonResponse.addProperty("success", true);
                        jsonResponse.addProperty("message", "Producto eliminado del carrito");
                    }
                    break;
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error al procesar la solicitud: " + e.getMessage());
        }

        response.getWriter().write(jsonResponse.toString());
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        HttpSession session = request.getSession();
        @SuppressWarnings("unchecked")
        HashMap<Integer, Integer> carrito = (HashMap<Integer, Integer>) session.getAttribute("carrito");
        
        if (carrito != null) {
            response.getWriter().write(gson.toJson(carrito));
        } else {
            response.getWriter().write("{}");
        }
    }
}