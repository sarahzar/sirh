package tn.esprit.esponline.persistence.repositories.nomenclatures;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.esponline.persistence.entities.Poste;


public interface PosteRepository extends JpaRepository<Poste,Long> {

    public Poste findById(int id);
}
