import React, { Component } from 'react';
import mock_events from './mocked_events';


class Event extends Component {
  render() {
    const { 
      scene, 
      type,
      name,
      start_time,
      end_time,
      hidden
    } = this.props;

    const timeString = datesToIntervalString(start_time, end_time);
    const duration = end_time - start_time;

    return (
      <div 
      style={{
        height:msToEms(duration)+"em"
      }}
      className={"event-thumbnail " + scene + " " + type + (hidden ? " hidden" : "")}>
          <p className="event-time">{timeString}</p>
          <h4>{name}</h4>
      </div>
    );
  }
}

class ProgramBreak extends Component {
  render() {
    const { 
      start_time,
      end_time
    } = this.props;

    const timeString = datesToIntervalString(start_time, end_time);
    const duration = end_time - start_time;

    return (
      <div 
      style={{
        height:msToEms(duration)+"em"
      }}
      className="program-break">
          <p className="event-time">{timeString} Break</p> 
      </div>
    );
  }
}

class ProgramRow extends Component {
  render(){
    const { events, start_time, end_time } = this.props; 
    const isBreak = !events;
    const medianDate = getMedianDate(start_time, end_time);
    medianDate.setMinutes(0,0,0);
    const sideHourOffset = msToEms(medianDate - start_time);
    const sideHour = addLeadingZero(medianDate.getHours());
    const hideSideHour = medianDate.getTime() === end_time.getTime();

    return(
      <div className="program-row">
      <div 
      style={{
        top: sideHourOffset+'em'
      }}
      className="side-hour">
        {hideSideHour ? "" : sideHour}
      </div>
      {isBreak ? 
      <ProgramBreak start_time={start_time} end_time={end_time} />
      :
      events.map((e, idx)=>{
        return (
          <div 
            key={"event-"+idx}
            className={"thumbnail-wrapper " + e.scene}
            >
            <Event  
            {...e}
            />
          </div>
        )
      })
      }
      </div>
    );
  }
} 


class Filters extends Component {

  state={
    checked : []
  }

  onChange = (val, e) => {
    let newState = [];
    if(e.target.checked){
      newState = [...this.state.checked, val];
    }else{
      newState = this.state.checked.filter(v => v !== val);
    }
    this.props.onChange && this.props.onChange(newState);
    this.setState({
      checked : newState 
    })
  }

  render() {
    const { options, name } = this.props;

    return (
      <ul className="filters">
        {options.map((o, idx)=>{
          return(
            <li key={name+"-option-"+idx}>
              <input 
                id={o+"-"+idx} 
                onChange={(e)=>this.onChange(o, e)}
                name={name+"-"+idx} 
                type="checkbox" >
              </input>
              <label htmlFor={o+"-"+idx}>{o}</label>
            </li>
          );
        })}
      </ul>
    );
  }
}


class ProgramOverview extends Component {
  state = {
    rows: [],
    events : [],
    filters: {}
  }

  filterChange = (name, val) => {
    this.setState({
      filters: {
        ...this.state.filters,
        [name] : val
      }
    });
  }

  componentWillMount(){
    const events = parseEvents(mock_events);
    const rows = eventsToTimeTable(events);

    this.setState({
      rows: rows,
      events: events
    });
  }


  render() {
    const { rows, events, filters } = this.state;
    const filterAttr1 = "categories";
    const categories = mapToUnique(events, filterAttr1);

    const filteredRows = filterRows(rows, filters);

    return (
      <div className="program-overview">
        <div>
          <Filters 
            onChange={(val)=>{this.filterChange(filterAttr1, val)}}
            name={filterAttr1}
            options={categories}
          />
        </div>

        {filteredRows.map((r, idx)=>{
          return (
            <ProgramRow 
              key={"ProgramRow-"+idx}
              {...r}
            />
          )
        })}
      </div>
    );
  }
};

const filterEvents = (events, filters) => {
  return events.map( event => {
    
    return Object.keys(filters).reduce((event, attribute) => {
      if (event.hidden) return event;
      const filterValues = filters[attribute];
      const haveCommonValues = filterValues.some(v1 => event[attribute].indexOf(v1) !== -1);
      const hide = !haveCommonValues && filterValues.length > 0;

      return {
        ...event,
        hidden : hide
      }

    }, event);
  });
}

const filterRows = (rows, filters) => {
  return rows.map(row => {
    if (row.break) return row

    const filteredEvents = filterEvents(row.events, filters);
    const collapseRow = filteredEvents.every(e => e.hidden);

    return {
      ...row,
      collapse: collapseRow,
      events: filteredEvents
    }
  });
}

const sortEventsByStart = (events) => {
  return  [...events].sort((a,b)=>{
    return a.start_time - b.start_time;
  });
};

const datesRangesOverlap = (d1s, d1e, d2s, d2e) => {
  // de morgans
  return (d1s < d2e) && (d1e > d2s);
}

// Returns true or false, and updates the row accordingly
const eventFitsInRow = (rows, event) => {
  const idx = rows.findIndex( r => {
    return datesRangesOverlap(r.start_time, r.end_time, event.start_time, event.end_time);
  });

  // Update row times
  if(idx !== -1){
    const row = rows[idx];
    row.start_time = row.start_time < event.start_time ? row.start_time :  event.start_time;
    row.end_time = row.end_time < event.end_time ? row.end_time :  event.end_time;
    row.events.push(event);
  }
  return idx !== -1;
}


// creates an arraw of rows containing events
// each row consists of all the events that overlap within that row
// breaks are automatically added as seperate rows between rows with events
const eventsToTimeTable = (events) => {
  let last_end_time;
  const sortedEvents = sortEventsByStart(events);
  const rows = [];

  sortedEvents.forEach((event) => {
    const { start_time, end_time } = event;
    const fitsInExistingRow = eventFitsInRow(rows, event);

    // Create break if necessary
    if(!!last_end_time && start_time > last_end_time){
      const timeBreak = {
          start_time: last_end_time,
          end_time: start_time,  
          break : true 
      }
      rows.push(timeBreak)
    }

    // Update time
    last_end_time = end_time;

    if(!fitsInExistingRow){
      rows.push(
        {
          start_time: start_time,
          end_time: end_time,
          events: [event]
        }
      );
    }

    
  });

  return rows;
}

const getMedianDate = (start,end) => {
  return new Date(start.getTime() + (end-start));
}

const addLeadingZero = (num) => {
  return num < 10 ? "0"+num : num;
}
const getFullMinutes = (d) => addLeadingZero(d.getMinutes());
const getFullHours = (d) => addLeadingZero(d.getHours());

const datesToIntervalString = (d1, d2) => {
  return `${getFullHours(d1)}:${getFullMinutes(d1)}-${getFullHours(d2)}:${getFullMinutes(d2)}`;
}

const parseEvents = (events) => {
  return events.map(e => {
    return {
      ...e,
      start_time: new Date(e.start_time),
      end_time: new Date(e.end_time)
    }
  });
}


const mapToUnique = (arr, attr) => {
  return [...new Set( // make unique
   // Reduce to list of all attr
    arr.reduce((acc,e) => {
      // Check if attribute consists of multiple attributes
      const newVal = Array.isArray(e[attr]) ? e[attr] : [e[attr]];
      return [...acc, ...newVal]
    }, [])
  )];
}

// Returns height in ems.
// 200px == 60mins and 16px == 1em
const msToEms = (ms) => {
  const pxPerMin = 200/60;
  return (ms/1000/60)*pxPerMin/16;
}



export default ProgramOverview;
