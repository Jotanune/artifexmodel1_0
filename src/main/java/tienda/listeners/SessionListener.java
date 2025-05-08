package tienda.listeners;

import jakarta.servlet.http.HttpSessionListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSession;
import tienda.AccesoBD;
import java.util.HashMap;
import java.util.Map;

@WebListener
public class SessionListener implements HttpSessionListener {
    
    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        @SuppressWarnings("unchecked")
        HashMap<Integer, Integer> carrito = (HashMap<Integer, Integer>) session.getAttribute("carrito");
        
        if (carrito != null && !carrito.isEmpty()) {
            AccesoBD bd = AccesoBD.getInstance();
            
            // Restaurar el stock de todos los productos en el carrito
            for (Map.Entry<Integer, Integer> entry : carrito.entrySet()) {
                bd.actualizarStockTemporal(entry.getKey(), entry.getValue(), false);
            }
        }
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        // No necesitamos hacer nada cuando se crea una sesión
    }
}