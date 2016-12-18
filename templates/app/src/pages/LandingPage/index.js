import React from 'react';
import cssModules from 'react-css-modules';
import { LandingContainer } from 'containers'; // eslint-disable-line
import styles from './index.module.scss';

const LandingPage = () => (
  <div className={styles.container}>
    <LandingContainer />
  </div>
);

export default cssModules(LandingPage, styles);
