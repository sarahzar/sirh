package tn.esprit.esponline.api.DTO;

public class UserDto {

    private long id;
    private String login;
    private String mail;
    private String role;
    private String password;

    public UserDto() {
    }

    public UserDto(long id, String login, String mail, String role) {
        this.id = id;
        this.login = login;
        this.mail = mail;
        this.role = role;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
