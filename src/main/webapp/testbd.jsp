<%@ page language="java" contentType="text/html; charset=UTF-8" import="tienda.*" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Página de comprobación</title>
</head>
<body>
    <%
    out.println("<b>Iniciando prueba de conexión...</b><br>");
    try {
        out.println("Llamando a AccesoBD.getInstance()...<br>");
        AccesoBD con = AccesoBD.getInstance();
        out.println("Instancia obtenida.<br>");
        out.println("Llamando a comprobarAcceso()...<br>");
        boolean res = con.comprobarAcceso();
        out.println("¿Conexión exitosa?: " + res + "<br>");
    } catch (Throwable e) {
        out.println("<b>Excepción capturada:</b><br><pre>");
        e.printStackTrace(new java.io.PrintWriter(out));
        out.println("</pre>");
    }
    out.println("<b>Fin de la prueba.</b>");
    %>
    <h1></h1>
</body>
</html>