import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Subscribe from "./components/subscribe/Subscribe";
import Login from "./components/login/Login";
import SalleManagement from "./components/Admin/SalleEntrainement";
import UserManagement from "./components/Admin/UserManagement";
import ExerciseTypeManagement from "./components/Admin/ExerciseTypeManagement";
import BadgeManagement from "./components/Admin/BadgeManagement";
import ConnectedRoute from "./components/connected-route";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/gyms" element={<SalleManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/exercises" element={<ExerciseTypeManagement />} />
            <Route path="/badges" element={<BadgeManagement />} />
            <Route path="/" element={<ConnectedRoute />}>
            </Route>
            <Route path="/admin" element={<ConnectedRoute access="admin" />}>
                <Route path="home" element={<App />} />
            </Route>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
