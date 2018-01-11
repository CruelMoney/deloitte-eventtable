import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ProgramOverview from './ProgramOverview';


document.addEventListener("DOMContentLoaded", function() {
  ReactDOM.render(<ProgramOverview />, document.getElementById('program-overview-root'));
});