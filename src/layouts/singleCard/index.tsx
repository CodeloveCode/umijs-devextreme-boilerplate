import React from 'react';
import ScrollView from 'devextreme-react/scroll-view';
import './index.less';
// import { PUBLIC_URL } from '../../serviceWorker';
import backGroundUrl from '../../assets/img/background.png';

const styles = {
  img: {
    // background: `url(${backGroundUrl})no-repeat`,
    backgroundSize: '100% 100vh',
  },
  children: {
    marginTop: '10%',
  },
};

export default function SingleCard({ title, description, children }: any) {
  return (
    <ScrollView
      height={'100vh'}
      width={'100%'}
      className={'with-footer single-card'}
      style={styles.img}
    >
      <div className={'dx-card content'} style={styles.children}>
        <div className={'header'}>
          <div className={'title'}>{title}</div>
          <div className={'description'}>{description}</div>
        </div>
        {children}
      </div>
    </ScrollView>
  );
}
