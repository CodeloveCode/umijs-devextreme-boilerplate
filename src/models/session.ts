import { notifyError } from '@/utils/devExtremeUtils';
import { Effect, Reducer } from 'umi';
import { signIn, deleteSession } from '../pages/login/service';

export interface SessionModelState {
  // loading: false, dvajs可以提供自动loading,不需要这个了.
  userInfo: {};
  appList: any[];
  error: null;
}

export interface SessionModelType {
  namespace: 'session';
  state: SessionModelState;
  effects: {
    login: Effect;
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
    userInfo: {},
    appList: [],
    error: null,
  },

  effects: {
    *login({ payload: { account, password } }, { call, put }) {
      try {
        const userInfo = yield call(signIn, account, password);
        yield put({ type: 'saveUserInfo', payload: { user: userInfo } });
      } catch (error) {
        console.log(error.message);
        notifyError(error.message);
      }
    },

    *logout({ payload }, { call, put }) {
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
        userInfo: {},
        appList: [],
        error: null,
      };
    },
  },
};

export default SessionModel;
