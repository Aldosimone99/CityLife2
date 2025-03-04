
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface State {
    token: string | null;
}

export const initialState: State = {
    token: null,
};

export const authReducer = createReducer(
    initialState,
    on(AuthActions.login, (state, { token }) => ({ ...state, token })),
    on(AuthActions.logout, (state) => ({ ...state, token: null }))
);