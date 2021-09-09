import React, { Component } from "react";
import { connect, Provider } from "react-redux";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import Leftside from "../../../Layout/Leftside"
import Header from "../../../Layout/Header"
import { Link, Redirect } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from "@material-ui/core/styles";
import ValidationService from "../../../services/Validation/ValidationService"
import { userActions } from "../../../_actions";
import { condidatActions } from "../../../_actions/Shared/condidat.actions";
import { validerEtapeActions } from "../../../_actions/Shared/valider.etape.actions";
import ParcourLecture from "./ParcourLecture";


export const parcourFields = {
  diplome: 'diplome',
  etablissement: 'etablissement',
  spetialite: 'spetialite',
  mention: 'mention',
  pays: 'pays',
  annee: 'annee',
}
const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(-1),
    right: theme.spacing(-1),
    "&:focus": {
      outline: "none"
    }
  }
});
class Parcour extends Component {
  constructor(props) {

    super(props);
    ValidationService.validator.autoForceUpdate = this;
    this.state = {
      loading: false,
      domaineId: -1,
      specialiteId: -1,
      etablissementId: -1,
      diplomeId: -1,
      mention: -1,
      paysId: -1,
      anneeObtention: "",
      items: [{annee:"",mention:-1,diplome:{id:-1,libelle:""},etablissement:{id:-1,libelle:""},specialite:{id:-1,libelle:""},pays:{id:-1,libelle:""}}],
      // index:0,     
      retour: false,
      condidat: null,
      changePath: false,
      touched: {},
      message: ""
    };
  }
  componentDidMount() {

    const { condidatReducer } = this.props

    if (condidatReducer) {
      this.setState({
        condidat: condidatReducer,
      });
      if (condidatReducer.parcourScolaire && condidatReducer.parcourScolaire.length > 0) {
        this.setState({
          items: condidatReducer.parcourScolaire
        });
      }
    }
  }

  componentWillUnmount() {

    if(this.props.condidatReducer && !this.props.condidatReducer.aConfirmer){

    let elements = [...this.state.items]
    elements = this.initListeParcours(elements)
    
    if (localStorage.getItem('persist:root')) {
      this.props.condidatReducer.parcourScolaire = [...this.state.items]
      this.props.setCondidat(this.props.condidatReducer)
      if(elements.length > 0){
        this.props.validerParcours(true)
      }else{
        this.props.validerParcour(false)
      }
    }

  }
  
  }

  validerEtapeParcour = () => {
    ValidationService.validator.purgeFields();
    this.addMessages();
    this.markUsTouched()

    if (!ValidationService.validator.allValid()) {
      ValidationService.validator.showMessages()
      return false
    } else {
      return true;
    }

  }
  onChangeSpecialite = (e, index) => {

    let touchedElement = { ...this.state.touched }
    touchedElement['spetialite' + index] = true;

    let elements = this.state.items;
    let id =e.target.value;
    let specialite = this.props.specialites.filter(elem => elem.id == id).shift()

    elements[index].specialite = specialite;
    this.setState({
      items: elements,
      touched: touchedElement
    });

    ValidationService.validator.showMessageFor(parcourFields.spetialite + index)
  }
  onChangeEtablissement = (e, index) => {

    let touchedElement = { ...this.state.touched }
    touchedElement['etablissement' + index] = true;

    let elements = this.state.items;
    let id =e.target.value;
    let etablissement = this.props.etablissements.filter(elem => elem.id == id).shift()

    elements[index].etablissement = etablissement;
    
    this.setState({
      items: elements,
      touched: touchedElement
    });
    ValidationService.validator.showMessageFor(parcourFields.etablissement + index)
  }

  onChangeAnneeObtention = (e, index) => {

    let touchedElement = { ...this.state.touched }
    touchedElement['annee' + index] = true;

    let elements = this.state.items;
    elements[index].annee = e.target.value;

    this.setState({
      items: elements,
      touched: touchedElement
    });
    ValidationService.validator.showMessageFor(parcourFields.annee + index)

  }

  onChangeDiplome = (e, index) => {

    let touchedElement = { ...this.state.touched }
    touchedElement['diplome' + index] = true;

    let elements = this.state.items;
    let id =e.target.value;
    let diplome = this.props.diplomes.filter(elem => elem.id == id).shift()

    elements[index].diplome = diplome;

    this.setState({
      items: elements,
      touched: touchedElement
    });
    ValidationService.validator.showMessageFor(parcourFields.diplome + index)
  }

  onChangeMention = (e, index) => {

    let touchedElement = { ...this.state.touched }
    touchedElement['mention' + index] = true;

    let elements = this.state.items;
    elements[index].mention = e.target.value;
    
    this.setState({
      items: elements,
      touched: touchedElement
    });
    ValidationService.validator.showMessageFor(parcourFields.mention + index)
  }

  onChangePays = (e, index) => {

    let touchedElement = { ...this.state.touched }
    touchedElement['pays' + index] = true;

    let elements = this.state.items;
    let id =e.target.value;
    let pays = this.props.pays.filter(elem => elem.id == id).shift()

    elements[index].pays= pays;
    this.setState({
      items: elements,
      touched: touchedElement
    });
    ValidationService.validator.showMessageFor(parcourFields.pays + index)
  }

  goBack = (e) => {
    e.preventDefault();
    this.setState({
      retour: true,
    });
  }

  updateTabElements = (e) => {
    e.preventDefault();
    let elements = this.state.items;
    elements.push({annee:"",mention:-1,diplome:{id:-1,libelle:""},etablissement:{id:-1,libelle:""},specialite:{id:-1,libelle:""},pays:{id:-1,libelle:""}});
    this.setState({
      items: elements
    });
    this.markUsUntouched()
  }

  deleteTabElement = (e, index) => {
    //declaration variables copies du state
    const parcours = this.state.items.slice()
    const touchedcp = { ...this.state.touched }
    const replacedTouched = []

    //spprimer l'élément sélectionner
    parcours.splice(index, 1)
    //mettre à jour la variable du state touched après la suppression d'un élément
    this.state.items.forEach((elem, i) => {
      if (i < index) {
        this.updateTouched(replacedTouched, i, i, touchedcp);
      }
      else if (i > 0 && i < (this.state.items.length - 1) && (i == index || i > index)) {
        this.updateTouched(replacedTouched, i, (i + 1), touchedcp);
      }
    })
    //mise à jour du state
    this.setState({
      items: parcours,
      touched: replacedTouched
    })


  }

  initListeParcours(liste) {

    const defaultElem = {annee:"",mention:"",diplome:{id:-1,libelle:""},etablissement:{id:-1,libelle:"",telephone:-1,mail:""},specialite:{id:-1,libelle:""},pays:{id:-1,libelle:""}};
    const firstElem = this.state.items[0];

    if (JSON.stringify(defaultElem) === JSON.stringify(firstElem)) {
      liste = [];
    }
    return liste;
  }
  handleSubmitCondidat = (e) => {
    e.preventDefault();
    if(this.props.condidatReducer && !this.props.condidatReducer.aConfirmer){
    ValidationService.validator.purgeFields();
    this.addMessages();
    console.log("validation",ValidationService.validator)
    if (ValidationService.validator.allValid()) {
    
      let condidatToSave = this.state.condidat
      condidatToSave.parcourScolaire = this.state.items
      this.setState({
        loading: true,
        changePath: true,
        condidat: condidatToSave
      })
    }
    else {

      this.markUsTouched();
      ValidationService.validator.showMessages();
    }
  }else{
    this.setState({
      loading: true,
      changePath: true,
    })
  }
  }


  updateTouched(replacedTouched, index1, index2, touchedcp) {
    replacedTouched[parcourFields.annee + index1] = touchedcp[parcourFields.annee + index2];
    replacedTouched[parcourFields.diplome + index1] = touchedcp[parcourFields.diplome + index2];
    replacedTouched[parcourFields.etablissement + index1] = touchedcp[parcourFields.etablissement + index2];
    replacedTouched[parcourFields.spetialite + index1] = touchedcp[parcourFields.spetialite + index2];
    replacedTouched[parcourFields.mention + index1] = touchedcp[parcourFields.mention + index2];
    replacedTouched[parcourFields.pays + index1] = touchedcp[parcourFields.pays + index2];
  }

  addMessages() {
    this.state.items.forEach((elem, i) => {
      ValidationService.validator.message(parcourFields.annee + i, elem.annee, 'required|afterCurrentYear');
      ValidationService.validator.message(parcourFields.diplome + i, elem.diplome.id, 'requiredSelect');
      ValidationService.validator.message(parcourFields.etablissement + i, elem.etablissement.id, 'requiredSelect');
      ValidationService.validator.message(parcourFields.spetialite + i, elem.specialite.id, 'requiredSelect');
      ValidationService.validator.message(parcourFields.mention + i, elem.mention, 'requiredSelect');
      ValidationService.validator.message(parcourFields.pays + i, elem.pays.id, 'requiredSelect');
    });
  }

  markUsTouched() {
    this.state.items.forEach((item, i) => {
      this.state.touched[parcourFields.annee + i] = true;
      this.state.touched[parcourFields.diplome + i] = true;
      this.state.touched[parcourFields.etablissement + i] = true;
      this.state.touched[parcourFields.spetialite + i] = true;
      this.state.touched[parcourFields.mention + i] = true;
      this.state.touched[parcourFields.pays + i] = true;
    });
  }

  markUsUntouched() {
    let touchedCopy = { ...this.state.touched }
    let indice = this.state.items.length - 1;
    touchedCopy[parcourFields.annee + indice] = false
    touchedCopy[parcourFields.diplome + indice] = false
    touchedCopy[parcourFields.etablissement + indice] = false
    touchedCopy[parcourFields.spetialite + indice] = false
    touchedCopy[parcourFields.mention + indice] = false
    touchedCopy[parcourFields.pays + indice] = false
    this.setState({
      touched: touchedCopy
    })
  }

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    const { diplomes } = this.props;
    const { etablissements } = this.props;
    const { specialites } = this.props;
    const { pays } = this.props;
    const { items } = this.state;
    const changePath = this.state.changePath;
   
 
    if (this.state.retour) {
   
      return <Redirect to={{
        pathname: '/profile',
      }} />;
    }
    if (changePath) {
      return <Redirect to={{
        pathname: '/expEnseignant',
      }} />;
    }




    return (

      <div id="wrapper">
        <Leftside 
        validerEtapeParcour={this.validerEtapeParcour}
        ></Leftside>
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Header />



            <div className="container-fluid pl-5">
              <Form
                onSubmit={this.handleSubmitCondidat}
                ref={(c) => {
                  this.form = c;
                }}
              >
                { /* Page Heading */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4 ">
                  <h1 className="h3 mb-0 text-gray-800">Parcours académique (tous les diplômes y compris le BAC)</h1>
                  <div className="form-group m-0">
                    <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-1" onClick={this.goBack}>
                      <i className="fas fa-angle-double-left fa-sm text-white-50"></i>Précédent
                    </button>

                    <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                      className="fas fa-angle-double-right fa-sm text-white-50"
                      disabled={loading}></i>
                      {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      Suivant </button>

                  </div>



                </div>

                { /* Content Row */}
                <div className="row">
                {(this.props.condidatReducer && !this.props.condidatReducer.aConfirmer &&
                  <div className="col-lg-12 mb-4 ">
                
                    <table className="table table-striped"  >
                      <thead>

                        <tr className="d-flex">
                          <th className="col-1 control-label">Année </th>
                          <th className="col-2 control-label">Nom du diplôme </th>
                          <th className="col-3 control-label">Etablissement </th>
                          <th className="col-2 control-label">Spécialité </th>
                          <th className="col-2 control-label">Mention </th>
                          <th className="col-2 control-label">Pays </th>
                        </tr>
                      </thead>
                      {items.map((item, index) =>
                        <tbody>

                          <tr key={index} className="d-flex">
                            {/* annee obtention */}
                            <td className="col-1"> <div className="form-group">

                              <input
                                type="text"
                                name="annee"
                                value={item.annee}
                                onChange={(e) => { this.onChangeAnneeObtention(e, index) }}
                                className={this.state.touched && this.state.touched[parcourFields.annee + index] && (!item.annee || item.annee > new Date().getFullYear()) ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                                data-tip
                                data-for={"anneeTip" + index}
                              />

                              {/* msg erreur */}
                              {this.state.touched && this.state.touched[parcourFields.annee + index] && (!item.annee || item.annee > new Date().getFullYear()) && (
                                <ReactTooltip id={"anneeTip" + index} place="top" effect="solid">
                                  {ValidationService.validator.message(parcourFields.annee + index, item.annee, 'required|afterCurrentYear')}
                                </ReactTooltip>
                              )}

                            </div>
                            </td>
                            {/* diplome */}
                            <td className="col-2">
                              <div className="form-group">
                                <select
                                  className={this.state.touched && this.state.touched[parcourFields.diplome + index] && item.diplome.id == -1 ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                                  id="sel1"
                                  onChange={(e) => { this.onChangeDiplome(e, index) }}
                                  value={item.diplome.id}
                                  data-tip
                                  data-for={"diplomeTip" + index}>
                                  <option value="-1" key="defaultdiplome"></option>
                                  {diplomes.map(({ id, libelle }, index) => <option value={id} key={index} >{libelle}</option>)}
                                </select>

                                {/* msg erreur */}
                                {this.state.touched && this.state.touched[parcourFields.diplome + index] && item.diplome.id == -1 && (
                                  <ReactTooltip id={"diplomeTip" + index} place="top" effect="solid">
                                    {ValidationService.validator.message(parcourFields.diplome + index, item.diplome.id, 'requiredSelect:Nom du diplôme')}
                                  </ReactTooltip>
                                )}
                              </div>
                            </td>
                            {/* etablissement */}
                            <td className="col-3"><div className="form-group">
                              <select
                                className={this.state.touched && this.state.touched[parcourFields.etablissement + index] && item.etablissement.id == -1 ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                                id="sel1"
                                onChange={(e) => { this.onChangeEtablissement(e, index) }}
                                value={item.etablissement.id}
                                data-tip
                                data-for={"etablissementTip" + index}>
                                <option value="-1" key="defaultetablissement"></option>
                                {etablissements.map(({ id, libelle }, index) => <option value={id} key={index} >{libelle}</option>)}
                              </select>

                              {/* msg erreur */}
                              {this.state.touched && this.state.touched[parcourFields.etablissement + index] && item.etablissement.id == -1 && (
                                <ReactTooltip id={"etablissementTip" + index} place="top" effect="solid">
                                  {ValidationService.validator.message(parcourFields.etablissement + index, item.etablissement.id, 'requiredSelect:Etablissement')}
                                </ReactTooltip>
                              )}
                            </div>
                            </td>
                            {/* spetialite */}
                            <td className="col-2"> <div className="form-group">
                              <select
                                className={this.state.touched && this.state.touched[parcourFields.spetialite + index] && item.specialite.id == -1 ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                                id="sel1"
                                onChange={(e) => { this.onChangeSpecialite(e, index) }}
                                value={item.specialite.id}
                                data-tip
                                data-for={"spetialiteTip" + index}>
                                <option value="-1" key="defaultspecialite"></option>
                                {specialites.map(({ id, libelle }, index) => <option value={id} key={index} >{libelle}</option>)}
                              </select>

                              {/* msg erreur */}
                              {this.state.touched && this.state.touched[parcourFields.spetialite + index] && item.specialite.id == -1 && (
                                <ReactTooltip id={"spetialiteTip" + index} place="top" effect="solid">
                                  {ValidationService.validator.message(parcourFields.spetialite + index, item.specialite.id, 'requiredSelect:Spécialité')}
                                </ReactTooltip>
                              )}
                            </div>
                            </td>
                            {/* mention */}
                            <td className="col-2"><div className="form-group">
                              <select
                                className={this.state.touched && this.state.touched[parcourFields.mention + index] && item.mention == -1 ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                                id="sel1"
                                onChange={(e) => { this.onChangeMention(e, index) }}
                                value={item.mention}
                                data-tip
                                data-for={"mentionTip" + index}
                              >
                                <option value="-1" key="defaultspecialite"></option>
                                <option value="1" key="passable">Passable</option>
                                <option value="2" key="bien">Bien</option>
                                <option value="3" key="tbien">Très bien</option>
                              </select>

                              {/* msg erreur */}
                              {this.state.touched && this.state.touched[parcourFields.mention + index] && item.mention == -1 && (
                                <ReactTooltip id={"mentionTip" + index} place="top" effect="solid">
                                  {ValidationService.validator.message(parcourFields.mention + index, item.mention, 'requiredSelect:Mention')}
                                </ReactTooltip>
                              )}
                            </div>
                            </td>
                            {/* pays */}
                            <td className="col-2"><div className="form-group">
                              <select
                                className={this.state.touched && this.state.touched[parcourFields.pays + index] && item.pays.id == -1 ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                                id="sel1"
                                onChange={(e) => { this.onChangePays(e, index) }}
                                value={item.pays.id}
                                data-tip
                                data-for={"paysTip" + index}>
                                <option value="-1" key="defaultpays"></option>
                                {pays.map(({ id, libelle }, index) => <option value={id} key={index} >{libelle}</option>)}
                              </select>

                              {/* msg erreur */}
                              {this.state.touched && this.state.touched[parcourFields.pays + index] && item.pays.id == -1 && (
                                <ReactTooltip id={"paysTip" + index} place="top" effect="solid">
                                  {ValidationService.validator.message(parcourFields.pays + index, item.pays.id, 'requiredSelect:Pays')}
                                </ReactTooltip>
                              )}
                            </div>
                              {index != 0 && (
                                <Fab color="secondary" aria-label="delete" size="small" className={classes.fab} style={{ zIndex: 100 }} >
                                  <DeleteIcon onClick={(e) => this.deleteTabElement(e, index)} />
                                </Fab>
                              )}
                            </td>
                          </tr>


                        </tbody>
                      )}
                    </table>
                
                    <button type="button" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={this.updateTabElements}>+Ajouter</button>

                  </div>
                  )}
                  {(this.props.condidatReducer && this.props.condidatReducer.aConfirmer &&
                    <ParcourLecture items={items} />
                  )}
                </div>

                <CheckButton
                  style={{ display: "none" }}
                  ref={(c) => {
                    this.checkBtn = c;
                  }}
                />

              </Form>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {

  const { diplomes } = state.diplome;
  const { etablissements } = state.etablissement;
  const { specialites } = state.specialite;
  const { pays } = state.pays;
  const { condidatReducer } = state.condidat;
  const  loggedOut  = state.authentication;

  return { diplomes, etablissements, specialites, pays, condidatReducer,loggedOut };
}
const actionCreators = {
  setCondidat: condidatActions.setCondidat,
  validerParcours: validerEtapeActions.validerParcours
};
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, actionCreators)(Parcour));