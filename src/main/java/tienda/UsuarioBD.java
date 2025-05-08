package tienda;

public class UsuarioBD {
    private int codigo;
    private String usuario;
    private String clave;
    private int activo;
    private int admin;
    private String nombre;
    private String apellidos;
    private String domicilio;
    private String poblacion;
    private String provincia;
    private String cp;
    private String telefono;
    private String email;

    public UsuarioBD() {}

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }
    public int getCodigo() {
        return codigo;
    }
    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
    public String getUsuario() {
        return usuario;
    }
    public void setClave(String clave) {
        this.clave = clave;
    }
    public String getClave() {
        return clave;
    }
    public void setActivo(int activo) {
        this.activo = activo;
    }
    public int getActivo() {
        return activo;
    }
    public void setAdmin(int admin) {
        this.admin = admin;
    }
    public int getAdmin() {
        return admin;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getNombre() {
        return nombre;
    }
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    public String getApellidos() {
        return apellidos;
    }
    public void setDomicilio(String domicilio) {
        this.domicilio = domicilio;
    }
    public String getDomicilio() {
        return domicilio;
    }
    public void setPoblacion(String poblacion) {
        this.poblacion = poblacion;
    }
    public String getPoblacion() {
        return poblacion;
    }
    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }
    public String getProvincia() {
        return provincia;
    }
    public void setCp(String cp) {
        this.cp = cp;
    }
    public String getCp() {
        return cp;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getEmail() {
        return email;
    }
}