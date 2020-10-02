/* eslint-disable prettier/prettier */
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
import TagPage from './containers/TagPage';
import ConsecutiveSessions from './containers/ConsecutiveSessions';
import ProgrammePage from './containers/Programmes';
import StudentBatchPage from './containers/StudentBatchPage';
import WorkingDaysPage from './containers/WorkingDaysPage';
import SessionPage from './containers/SessionPage';
import LecturerStatistics from './containers/LecturerStatistics';
import StudentStatistics from './containers/StudentStatistics';
import SubjectStatistics from './containers/SubjectStatistics';
import StudentGroupRoomsPage from './containers/StudentGroupRoomsPage';
import TagRoomsPage from './containers/TagRoomsPage';
import SubjectRoomsPage from './containers/SubjectRoomsPage';
import ConsecutiveDialog from './components/session/ConsecutiveDialog';
import ParallelSessions from './containers/ParallelSessions';
import NotAvailableTime from './containers/NotAvailableTime';
import TimetablePage from './containers/Timetables';

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
          <Route path={routes.SUBJECT_ROOMS} component={SubjectRoomsPage} />
          <Route path={routes.SUBJECT} component={SubjectPage} />
          <Route path={routes.LOCATION} component={LocationPage} />
          <Route path={routes.PROGRAMMES} component={ProgrammePage} />
          <Route path={routes.TAGS_ROOMS} component={TagRoomsPage} />
          <Route path={routes.TAGS} component={TagPage} />
          <Route
            path={routes.STUDENT_GROUP_ROOMS}
            component={StudentGroupRoomsPage}
          />
          <Route path={routes.STUDENT_BATCHES} component={StudentBatchPage} />
          <Route path={routes.WORKING_DAYS} component={WorkingDaysPage} />
          <Route
            path={routes.CONSECUTIVE_SESSIONS}
            component={ConsecutiveSessions}
          />
          <Route path={routes.PARALLEL_SESSIONS} component={ParallelSessions} />
          <Route path={routes.SESSIONS} component={SessionPage} />
          <Route
            path={routes.STATISTICS_LECTURE}
            component={LecturerStatistics}
          />
          <Route
            path={routes.STATISTICS_STUDENT}
            component={StudentStatistics}
          />
          <Route
            path={routes.STATISTICS_SUBJECT}
            component={SubjectStatistics}
          />
          <Route
            path={routes.NOT_AVAILABLE_TIME}
            component={NotAvailableTime}
          />
          <Route path={routes.TIMETABLES} component={TimetablePage} />
        </Switch>
      </ContentWrapper>
    </App>
  );
}
