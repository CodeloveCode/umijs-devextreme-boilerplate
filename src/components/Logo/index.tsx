import React from 'react';
import logoImg from '@/assets/logo.png';
import logo1 from '@/assets/logo1.png';
import styles from './index.less';

export const smallLogo = () => (
  <>
    <img src={logoImg} alt="" />
  </>
);

export const bigLogo = () => (
  <>
    <img src={logo1} alt="" className={styles['big-logo']} />
  </>
);
