import moment from "moment";

var evenMonth = [1, 3, 5, 7, 8, 10, 12];
var oldMonth = [2, 4, 6, 9, 11];

const getMonth = () => {
  var currentMonth = moment().month() + 1;
  var currentYear = moment().year();
  var lastDayOfMonth = 30;
  if (evenMonth.includes(currentMonth)) {
    lastDayOfMonth = 31;
  }
  return {
    start: new Date(`${currentMonth}/1/${currentYear}`),
    end: new Date(`${currentMonth}/${lastDayOfMonth}/${currentYear}`),
  };
};
const getPreMonth = () => {
  var currentMonth = moment().month() + 1;
  var currentYear = moment().year();
  var lastDayOfMonth = 30;
  if (evenMonth.includes(currentMonth)) {
    lastDayOfMonth = 31;
  }
  if(currentMonth > 1){
    return {
      start: new Date(`${currentMonth-1}/1/${currentYear}`),
      end: new Date(`${currentMonth-1}/${lastDayOfMonth}/${currentYear}`),
    };
  }
  return {
    start: new Date(`12/1/${currentYear-1}`),
    end: new Date(`12/${lastDayOfMonth}/${currentYear-1}`),
  };

};
const getQuarter = () => {
  var currentMonth = moment().month() + 1;
  var currentYear = moment().year();
  var start, end;
  if (currentMonth <= 3) {
    start = `1/1/${currentYear}`;
    end = `3/31/${currentYear}`;
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    start = `4/1/${currentYear}`;
    end = `6/30/${currentYear}`;
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    start = `7/1/${currentYear}`;
    end = `9/30/${currentYear}`;
  } else if (currentMonth >= 10 && currentMonth <= 12) {
    start = `10/1/${currentYear}`;
    end = `12/31/${currentYear}`;
  }
  return {
    start: new Date(start),
    end: new Date(end),
  };
};
const getPreQuarter = () => {
  var currentMonth = moment().month() + 1;
  var currentYear = moment().year();
  var start, end;
  if (currentMonth <= 3) {
    start = `10/1/${currentYear-1}`;
    end = `12/31/${currentYear-1}`;
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    start = `1/1/${currentYear}`;
    end = `3/31/${currentYear}`;
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    start = `4/1/${currentYear}`;
    end = `6/30/${currentYear}`;
  } else if (currentMonth >= 10 && currentMonth <= 12) {
    start = `7/1/${currentYear}`;
    end = `9/30/${currentYear}`;
  }
  return {
    start: new Date(start),
    end: new Date(end),
  };
};

const getYear = () => {
  var currentYear = moment().year();
  return {
    start: new Date(`1/1/${currentYear}`),
    end: new Date(`12/31/${currentYear}`),
  };
};

const getPreYear = () => {
  var currentYear = moment().year();
  return {
    start: new Date(`1/1/${currentYear-1}`),
    end: new Date(`12/31/${currentYear-1}`),
  };
};

export { getMonth, getQuarter, getYear,getPreYear,getPreMonth,getPreQuarter};
