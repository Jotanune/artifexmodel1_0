package tienda.listeners;

import jakarta.servlet.ServletContextListener;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.annotation.WebListener;
import tienda.AccesoBD;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@WebListener
public class ActualizarPedidosListener implements ServletContextListener {
    private ScheduledExecutorService scheduler;

    @Override
    public void contextInitialized(ServletContextEvent event) {
        scheduler = Executors.newSingleThreadScheduledExecutor();
        
        // Programar la tarea para que se ejecute cada 5 segundos
        scheduler.scheduleAtFixedRate(() -> {
            try {
                AccesoBD bd = AccesoBD.getInstance();
                bd.actualizarEstadosPedidos();
            } catch (Exception e) {
                System.err.println("Error actualizando estados de pedidos: " + e.getMessage());
            }
        }, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        if (scheduler != null) {
            scheduler.shutdownNow();
        }
    }
}