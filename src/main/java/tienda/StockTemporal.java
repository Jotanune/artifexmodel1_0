package tienda;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class StockTemporal {
    private static StockTemporal instance;
    private final Map<Integer, Map<String, Integer>> stockReservado; // producto -> (sesión -> cantidad)

    private StockTemporal() {
        stockReservado = new ConcurrentHashMap<>();
    }

    public static synchronized StockTemporal getInstance() {
        if (instance == null) {
            instance = new StockTemporal();
        }
        return instance;
    }

    public synchronized boolean reservarStock(int codigoProducto, String sessionId, int cantidad, int stockDisponible) {
        Map<String, Integer> reservasPorSesion = stockReservado.computeIfAbsent(codigoProducto, k -> new ConcurrentHashMap<>());
        
        // Calcular el total reservado por otros usuarios
        int totalReservado = reservasPorSesion.entrySet().stream()
            .filter(e -> !e.getKey().equals(sessionId))
            .mapToInt(Map.Entry::getValue)
            .sum();

        // Calcular cuánto tiene reservado esta sesión
        int reservadoSesion = reservasPorSesion.getOrDefault(sessionId, 0);

        // Verificar si hay suficiente stock disponible
        if (stockDisponible >= (totalReservado + cantidad)) {
            reservasPorSesion.put(sessionId, cantidad);
            return true;
        }
        return false;
    }

    public synchronized void liberarStock(int codigoProducto, String sessionId) {
        Map<String, Integer> reservasPorSesion = stockReservado.get(codigoProducto);
        if (reservasPorSesion != null) {
            reservasPorSesion.remove(sessionId);
            if (reservasPorSesion.isEmpty()) {
                stockReservado.remove(codigoProducto);
            }
        }
    }

    public synchronized int getStockReservado(int codigoProducto, String sessionId) {
        Map<String, Integer> reservasPorSesion = stockReservado.get(codigoProducto);
        if (reservasPorSesion == null) {
            return 0;
        }
        return reservasPorSesion.entrySet().stream()
            .filter(e -> !e.getKey().equals(sessionId))
            .mapToInt(Map.Entry::getValue)
            .sum();
    }
}