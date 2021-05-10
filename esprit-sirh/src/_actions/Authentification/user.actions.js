import { userConstants } from '../../_constants';
import AuthService from "../../services/Authentification/AuthService";
import { alertActions } from '..';
import { history } from '../../_helpers';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete
};

function login(username, password) {
    return dispatch => {
       dispatch(request({ username }));
       dispatch(alertActions.clear());  
        AuthService.login(username, password)
            .then(
                user => {
                    let token = user.accessToken.token;
                    if (token) {
                        dispatch(success(user));
                    }
                    else {
                        dispatch(failure(user.accessToken.authenticationError));
                        dispatch(alertActions.error(user.accessToken.authenticationError));

                    }
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(resMessage));
                 }

            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    AuthService.logout();
    history.replace("/");
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        // userService.register(user)
        //     .then(
        //         user => { 
        //             dispatch(success());
        //             history.push('/login');
        //             dispatch(alertActions.success('Registration successful'));
        //         },
        //         error => {
        //             dispatch(failure(error.toString()));
        //             dispatch(alertActions.error(error.toString()));
        //         }
        //     );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        // userService.getAll()
        //     .then(
        //         users => dispatch(success(users)),
        //         error => dispatch(failure(error.toString()))
        //     );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        // userService.delete(id)
        //     .then(
        //         user => dispatch(success(id)),
        //         error => dispatch(failure(id, error.toString()))
        //     );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}