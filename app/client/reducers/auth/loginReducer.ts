import { LoginAction } from "./actions";

import { LoginActionTypes } from "./types";
import { Organisation } from "../organisation/types";

export interface LoginState {
  isLoggingIn: boolean;
  //TODO(refactor): what is token actually? seems to only be used in checking it's not null
  token: null | string;
  //TODO(refactor): is it number or string?
  userId: null | number;
  email: null | string;
  //TODO(refactor): is it number or string?
  vendorId: null | number;
  intercomHash: null | string;
  webApiVersion: null | string;
  organisationName: null | string;
  //TODO(refactor): is it number or string?
  organisationId: null | number;
  organisationToken: null | string;
  usdToSatoshiRate: null | number;
  error: null | string;
  tfaURL: null | string;
  tfaFailure: boolean;
  organisations?: null | OrganisationFlat[];
  requireTransferCardExists: null | boolean;
  adminTier?: string;
}

export interface OrganisationFlat {
  id: number;
  name: string;
  token: string;
}

const initialLoginState: LoginState = {
  isLoggingIn: false,
  token: null,
  userId: null,
  email: null,
  vendorId: null,
  intercomHash: null,
  webApiVersion: null,
  organisationName: null,
  organisationId: null,
  organisationToken: null,
  organisations: null,
  requireTransferCardExists: null,
  usdToSatoshiRate: null,
  error: null,
  tfaURL: null,
  tfaFailure: false
};

export const login = (state = initialLoginState, action: LoginAction) => {
  switch (action.type) {
    case LoginActionTypes.REAUTH_REQUEST:
    case LoginActionTypes.LOGIN_REQUEST:
      return { ...state, isLoggingIn: true };
    case LoginActionTypes.UPDATE_ACTIVE_ORG:
      return {
        ...state,
        organisationName: action.payload.name,
        organisationId: action.payload.id
      };
    case LoginActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        token: action.payload.token,
        userId: action.payload.userId,
        vendorId: action.payload.vendorId,
        intercomHash: action.payload.intercomHash,
        webApiVersion: action.payload.webApiVersion,
        organisationName: action.payload.organisationName,
        organisationId: action.payload.organisationId,
        organisationToken: action.payload.organisationToken,
        organisations: action.payload.organisations,
        requireTransferCardExists: action.payload.requireTransferCardExists,
        email: action.payload.email,
        adminTier: action.payload.adminTier,
        usdToSatoshiRate: action.payload.usdToSatoshiRate,
        tfaURL: null,
        tfaFailure: false
      };
    case LoginActionTypes.LOGIN_PARTIAL:
      return {
        ...state,
        isLoggingIn: false,
        token: null,
        userId: null,
        intercomHash: null,
        webApiVersion: null,
        organisationName: null,
        organisationId: null,
        organisations: null,
        requireTransferCardExists: null,
        tfaURL: action.payload.tfaURL,
        tfaFailure: action.payload.tfaFailure,
        error: action.payload.error || "unknown error"
      };
    case LoginActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        token: null,
        userId: null,
        error: action.error || "unknown error"
      };
    case LoginActionTypes.LOGOUT:
      return initialLoginState;
    default:
      return state;
  }
};
