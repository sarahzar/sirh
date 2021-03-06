package tn.esprit.esponline.persistence.entities;



import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String nom;
    private String type;
    @JsonIgnore
    @ManyToOne
    private Condidat condidat;

    public Document() {
    }

    public Document(String nom, String type, Condidat condidat) {
        this.nom = nom;
        this.type = type;
        this.condidat = condidat;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Condidat getCondidat() {
        return condidat;
    }

    public void setCondidat(Condidat condidat) {
        this.condidat = condidat;
    }
}
