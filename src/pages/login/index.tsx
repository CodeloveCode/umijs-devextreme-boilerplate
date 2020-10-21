import React from 'react';
import SingleCard from './singleCard';
import { Redirect, Link, SessionModelState } from 'umi';
import { connect } from 'react-redux';

import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import './index.less';

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Email' };
const passwordEditorOptions = {
  stylingMode: 'filled',
  placeholder: 'Password',
  mode: 'password',
};
const rememberMeEditorOptions = {
  text: 'Remember me',
  elementAttr: { class: 'form-text' },
};

class LoginView extends React.Component<any, any> {
  private formRef: any;

  constructor(props: any) {
    super(props);

    this.formRef = React.createRef();
  }

  get form() {
    return this.formRef.current.instance;
  }

  onSubmit = (e: any) => {
    e.preventDefault();
    let { account, password, rememberme } = this.form.option('formData');
    rememberme = rememberme ? 1 : 0;
    this.props.dispatch({
      type: 'session/login',
      payload: { account, password, rememberme },
    });
  };

  onCreateAccountClick = () => {
    this.props.history.push('/create-account');
  };

  render() {
    const {
      loading,
      session: { userInfo },
    } = this.props;

    let token = userInfo.token;
    if (token) {
      return <Redirect to="/" />;
    }

    return (
      <SingleCard title="Sign In">
        <form className={'login-form'} onSubmit={this.onSubmit}>
          <Form ref={this.formRef} disabled={loading}>
            <Item
              dataField={'account'}
              editorType={'dxTextBox'}
              editorOptions={emailEditorOptions}
            >
              <RequiredRule message="account is required" />
              <Label visible={false} />
            </Item>
            <Item
              dataField={'password'}
              editorType={'dxTextBox'}
              editorOptions={passwordEditorOptions}
            >
              <RequiredRule message="Password is required" />
              <Label visible={false} />
            </Item>
            <Item
              dataField={'rememberme'}
              editorType={'dxCheckBox'}
              editorOptions={rememberMeEditorOptions}
            >
              <Label visible={false} />
            </Item>
            <ButtonItem>
              <ButtonOptions
                width={'100%'}
                type={'default'}
                useSubmitBehavior={true}
              >
                <span className="dx-button-text">
                  {loading ? (
                    <LoadIndicator
                      width={'24px'}
                      height={'24px'}
                      visible={true}
                    />
                  ) : (
                      'Sign In'
                    )}
                </span>
              </ButtonOptions>
            </ButtonItem>
            <Item>
              <div className={'link'}>
                <Link to={'/reset-password'}>Forgot password?</Link>
              </div>
            </Item>
            <ButtonItem>
              <ButtonOptions
                text={'Create an account'}
                width={'100%'}
                onClick={this.onCreateAccountClick}
              />
            </ButtonItem>
          </Form>
        </form>
      </SingleCard>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  const session: SessionModelState = state.session;
  return {
    session,
    loading: state.loading.models.session, // dvaJs自带的loading(每个model共用一个)
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps)(LoginView);
