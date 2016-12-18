import React from 'react';
import cssModules from 'react-css-modules';
import { AboutContainer } from 'containers';  // eslint-disable-line
import styles from './index.module.scss';

const AboutPage = () => (
  <div className={styles.container}>
    <AboutContainer />
  </div>
);

export default cssModules(AboutPage, styles);
