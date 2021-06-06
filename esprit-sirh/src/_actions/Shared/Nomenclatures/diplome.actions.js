import { NomenclaturesConstants } from '../../../_constants/NomenclaturesConstants';
import NomenclaturesService from  "../../../services/Shared/NomenclaturesService";

export const diplomeActions = {
    
    allDiplomes,
    
};

function allDiplomes() {
    return dispatch => {
    NomenclaturesService.getAllDiplomes().then(

        resp =>{
            dispatch(all(resp.data));
        });
    };
    function all(diplomes) { return { type: NomenclaturesConstants.GETALL_DIPLOMES, diplomes } }
}
