import React, { Component } from 'react';
import mock_events from './mocked_events_2';
import {
  Tech,
  Business,
  Both
} from './icons'
import { StickyContainer, Sticky } from 'react-sticky';

const icons = {
  "Both IT and Business": <Both />,
  "IT/technology": <Tech />,
  "Business/strategy" : <Business />
}

class Event extends Component {
  render() {
    const { 
      scene, 
      name,
      type,
      start_time,
      end_time,
      hidden,
      topic
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
            {/* {
              icons[topic[0]]
            } */}
            {type==="workshop" ?
            <span className="participants-only">By invitation only</span>
            : null}
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
          <p className="event-time">{timeString}</p> 
          <h4>{duration <= 600000 ? "Track change" : "Break"}</h4>
      </div>
    );
  }
}

class ProgramRow extends Component {
  render(){
    const { 
      events, 
      start_time, 
      end_time, 
      collapse,
      bottom_time,
      top_time,
      lastRow
     } = this.props; 
    const isBreak = !events;
    const eventsCount = isBreak ? 0 : events.length;

    // Calculating side hour
    //const medianDate = getMedianDate(start_time, end_time);
    const overlappedHours = getOverlappedHours(start_time, end_time)
    
    const rowHeight = msToEms(end_time - start_time);
    // const hideSideHour = (
    //   (medianDate.getTime() === end_time.getTime()
    //   || sideHourOffset < 0
    //   || sideHourOffset > rowHeight)
    // );


    return(
      <div 
        className={"row-wrapper" 
        + (collapse ? " collapsed" : "")
        + (eventsCount > 1 ? " multiple-events" : "")
      } 
        data-events-count={eventsCount} 
        
        >
      
      
           <div  
           className="row-hours">
             {addLeadingZero(start_time.getHours()) + ':' + addLeadingZero(start_time.getMinutes())}-{addLeadingZero(end_time.getHours()) + ':' + addLeadingZero(end_time.getMinutes())}
           </div>
        
      
      <div className={
        "program-row " + (collapse ? "collapsed" : "")
        + (bottom_time ? " bottom-time " : "")
        + (top_time ? " top-time " : "")}
        style={{
          maxHeight: (Math.max(rowHeight, 3.4))+"em"
        }}
        >
      
       {top_time ?
         <div  
         style={{top: 0 }}
         className="side-hour top-time">
           <u>{addLeadingZero(start_time.getHours()) + ':' + addLeadingZero(start_time.getMinutes())}</u>
         </div>
      : null}
      {overlappedHours.map(date => {
        date.setMinutes(0,0,0);
        if(date < start_time || date >= end_time) return null
        const sideHourOffset = msToEms(date - start_time);
        const sideHour = addLeadingZero(date.getHours());
        return (
            <div 
            style={{
              top: sideHourOffset+'em'
            }}
            className="side-hour middle-time">
              <u>{sideHour+":00"}</u>
            </div>
        )
      }) 
      }
      {bottom_time || lastRow ?
         <div  
         style={{bottom: 0 }}
         className="side-hour bottom-time">
            <u>{addLeadingZero(end_time.getHours()) + ':' + addLeadingZero(end_time.getMinutes())}</u>
         </div>
      : null}
      {isBreak ? 
      <ProgramBreak start_time={start_time} end_time={end_time} />
      :
      events.map((e, idx)=>{
        const type = (!!(e.scene.indexOf("Blomstersalen")+1) || !!(e.scene.indexOf("Ballonsalen")+1)) ? "workshop" : "speak"; 
        return (
          <div 
            key={"event-"+idx}
            className={"thumbnail-wrapper " + e.scene + " " + type + (!!e.link ? " clickable " : "") + (e.hidden ? " hidden " : "")}
            onClick={()=>{!!e.link && window.loadModal(e.link)}}
            >
            <Event  
            {...e}
            type={type}
            />
          </div>
        )
      })
      }
      </div>
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
              <div className="filter-option">
                <input 
                  id={o+"-"+idx} 
                  onChange={(e)=>this.onChange(o, e)}
                  name={name+"-"+idx} 
                  type="checkbox" >
                </input>
                <label htmlFor={o+"-"+idx}>{o}</label>
              </div>
             
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
    let events;

    if(window.program_events){
      events = parseEvents(window.program_events)
      
    }else{
      events = parseEvents(mock_events);
    }
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
    const filterAttr2 = "topic";
    const topics = mapToUnique(events, filterAttr2);

    let renderRows =  filterRows(rows, filters);
    renderRows = collapseBreaks(renderRows);
    renderRows = calculateExtraTimes(renderRows); 
  
    return (
      <StickyContainer>

      <div className="row">
      <div className="spacer"></div>
      <div className="col-sm-8">
      <div className="program-overview">
        {renderRows.map((r, idx)=>{
          return (
            <ProgramRow
              lastRow={idx+1===renderRows.length}
              key={"ProgramRow-"+idx}
              {...r}
            />
          )
        })}
      </div>
      </div>
     
      <div className="col-sm-4 filters-wrapper"> 

          <Sticky topOffset={-50}>
          { ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight }) =>   
          <div style={{...style, top: "90px"}} >
            <h3>Filter by topic/category</h3>
            <hr/>
            <Filters 
              onChange={(val)=>{this.filterChange(filterAttr2, val)}}
              name={filterAttr2}
              options={topics}
            />
            <hr/>
            <Filters 
              onChange={(val)=>{this.filterChange(filterAttr1, val)}}
              name={filterAttr1}
              options={categories}
            />
            <hr/>
            </div>
          }
         
          </Sticky>
        </div>

      </div>
      </StickyContainer>

    );
  }
};

const filterEvents = (events, filters) => {
  return events.map( event => {
    
    return (Object.keys(filters)).reduce((event, attribute) => {
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
  const filteredRows = rows.map(row => {
    if (row.break) return row

    const filteredEvents = filterEvents(row.events, filters);
    const collapseRow = filteredEvents.every(e => e.hidden);

    return {
      ...row,
      collapse: collapseRow,
      events: filteredEvents
    }
  });

  return filteredRows;
}

// Collaps break blocks on each side of collapsed eventrows
const collapseBreaks = (rows) => {
  const maxIdx = rows.length - 1;

  rows.forEach((row, idx)=>{
    if(row.break){
      if(idx+1 <= maxIdx && !rows[idx+1].break && rows[idx+1].collapse){
        row.collapse = true;
        return;
      }
      if(idx-1 >= 0 && !rows[idx-1].break && rows[idx-1].collapse){
        row.collapse = true;
        return;
      }
      row.collapse = false
    }
  });

  return rows;
}

// Figure out if extra time should be shown
const calculateExtraTimes = (rows) => {
  const maxIdx = rows.length - 1;

  rows.forEach((row, idx)=>{
    if(!row.break){
      // If row below is collapsed
      if(idx+1 <= maxIdx && rows[idx+1].collapse){
        row.bottom_time = true;
      }else{
        row.bottom_time = false;
      }
      // if row above is collapsed
      if(idx-1 >= 0 && rows[idx-1].collapse){
        row.top_time = true;
      }else{
        row.top_time = false;
      }
    }
  });

  return rows;
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
    row.end_time = row.end_time > event.end_time ? row.end_time :  event.end_time;
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

const getOverlappedHours = (start,end) => {
  const nHours = Math.max((end.getHours() - start.getHours()), 1);
  const hours = [];

  for (let n = 0; n < nHours; n++) {
    hours.push(new Date(start.getTime() + n*60*60*1000));
  }
  hours.push(new Date(end.getTime()));

  return hours;
}

const getMedianDate = (start,end) => {
  return new Date(start.getTime() + (end - start)/2);
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
  return events.reduce((acc, e) => {
    if(!e.start_time || !e.end_time){
      return acc
    }
    return [
      ...acc,
      {
      ...e,
      start_time: new Date(e.start_time.date.replace(/-/g, "/").replace(".000000", "")),
      end_time: new Date(e.end_time.date.replace(/-/g, "/").replace(".000000", ""))
    }]
  }, []);
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
