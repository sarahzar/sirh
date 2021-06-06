import { NomenclaturesConstants } from '../../../_constants/NomenclaturesConstants';
import NomenclaturesService from  "../../../services/Shared/NomenclaturesService";

export const specialiteActions = {
    
    allSpecialites,
    
};

function allSpecialites() {
    return dispatch => {
    NomenclaturesService.getAllSpecialites().then(

        resp =>{
            dispatch(all(resp.data));
        });
    };
    function all(specialites) { return { type: NomenclaturesConstants.GETALL_SPECIALITES, specialites } }
}
