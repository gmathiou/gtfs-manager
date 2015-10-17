module.exports = {
  isInt: function(n) {
      return typeof n == 'number' && n % 1 == 0;
    },

    getDayName: function(date) {
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    },

    formatDay: function(date) {
      var day = (date.getDate() < 10) ? '' + '0' + date.getDate() : date.getDate(),
        month = ((date.getMonth() + 1) < 10) ? '' + '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
        year = date.getFullYear();
      return '' + year + month + day;
    },

    timeToSeconds: function(time) {
      if (time instanceof Date) {
        var timeParts = [time.getHours(), time.getMinutes(), time.getSeconds()];
      } else {
        var timeParts = time.split(':');
        if (timeParts.length != 3) {
          return null;
        }
      }
      return parseInt(timeParts[0], 10) * 60 * 60 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
    },

    secondsToTime: function(seconds) {
      //check if seconds are already in HH:MM:SS format
      if (seconds.match(/\d+:\d+:\d+/)[0]) {
        return seconds;
      }

      var hour = Math.floor(seconds / (60 * 60)),
        minute = Math.floor((seconds - hour * (60 * 60)) / 60),
        second = seconds - hour * (60 * 60) - minute * 60;
      return ((hour < 10) ? '' + '0' + hour : hour) + ':' + ((minute < 10) ? '' + '0' + minute : minute) + ':' + ((second < 10) ? '' + '0' + second : second);
    }
}

GTFSFiles = [{
  fileNameBase: 'agency',
  collection: 'agencies'
}, {
  fileNameBase: 'calendar_dates',
  collection: 'calendardates'
}, {
  fileNameBase: 'calendar',
  collection: 'calendars'
}, {
  fileNameBase: 'fare_attributes',
  collection: 'fareattributes'
}, {
  fileNameBase: 'fare_rules',
  collection: 'farerules'
}, {
  fileNameBase: 'feed_info',
  collection: 'feedinfos'
}, {
  fileNameBase: 'frequencies',
  collection: 'frequencies'
}, {
  fileNameBase: 'routes',
  collection: 'routes'
}, {
  fileNameBase: 'stop_times',
  collection: 'stoptimes'
}, {
  fileNameBase: 'stops',
  collection: 'stops'
}, {
  fileNameBase: 'transfers',
  collection: 'transfers'
}, {
  fileNameBase: 'trips',
  collection: 'trips'
}];