import { UserSession } from '@/pages/login/DTO';
import { notifyError } from '@/utils/devExtremeUtils';
import { Effect, Reducer } from 'umi';
import { deleteSession, fetchUserInfo } from '../pages/login/service';

export interface SessionModelState {
  userSession?: UserSession;
  error: null;
}

export interface SessionModelType {
  namespace: 'session';
  state: SessionModelState;
  effects: {
    getUserProfile: Effect;
    logout: Effect;
  };
  reducers: {
    saveUserInfo: Reducer<SessionModelState>;
    removeSession: Reducer<SessionModelState>;
  };
}

const SessionModel: SessionModelType = {
  namespace: 'session',

  state: {
    userSession: undefined,
    error: null,
  },

  effects: {
    *getUserProfile({ payload: { token } }, { call, put }) {
      try {
        const userSession = yield call(fetchUserInfo, token);
        yield put({ type: 'saveUserInfo', payload: { userSession } });
      } catch (error) {
        console.log(error.message);
        notifyError(error.message);
      }
    },

    *logout(_, { call, put }) {
      try {
        yield call(deleteSession);
        yield put({ type: 'removeSession' });
        window.document.location.pathname = '/login';
      } catch (error) {
        console.log(error.message);
        notifyError(error.message);
      }
    },
  },
  reducers: {
    saveUserInfo(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    removeSession(state, action) {
      return {
        loading: false,
        userSession: undefined,
        error: null,
      };
    },
  },
};

export default SessionModel;
