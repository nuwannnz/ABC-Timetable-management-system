/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import SideBarContainer from './containers/SideBarContainer';
import ContentWrapper from './containers/ContentWrapper';
import LecturePage from './containers/LecturePage';
import SubjectPage from './containers/SubjectPage';
import LocationPage from './containers/LocationPage';

// Lazily load routes and code split with webpack
// const LazyCounterPage = React.lazy(() =>
//   import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
// );

// const CounterPage = (props: Record<string, any>) => (
//   <React.Suspense fallback={<h1>Loading...</h1>}>
//     <LazyCounterPage {...props} />
//   </React.Suspense>
// );

export default function Routes() {
  return (
    <App>
      <SideBarContainer />
      <ContentWrapper>
        <Switch>
          <Route path={routes.LECTURE} component={LecturePage} />
          <Route path={routes.SUBJECT} component={SubjectPage} />
          <Route path={routes.LOCATION} component={LocationPage} />
        </Switch>
      </ContentWrapper>
    </App>
  );
}
