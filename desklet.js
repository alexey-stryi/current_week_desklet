const St = imports.gi.St;
const Desklet = imports.ui.desklet;
const Settings = imports.ui.settings;

function WeekNowDesklet(metadata, desklet_id) {
    this._init(metadata, desklet_id);
}

let createWindow = function (config) {
  let window = new St.BoxLayout({
    vertical: true,
    width: config.width,
    height: config.height,
    styleClass: "week-now-window"
  });

  config.items.forEach((item) => window.add(item));
  return window;
};

let createLabel = function(label, cssClass) {
  return new St.Label({
    text: label,
    styleClass: cssClass
  });
};

WeekNowDesklet.prototype = {
  __proto__: Desklet.Desklet.prototype,

  _init: function(metadata, desklet_id) {
      Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);

      this.settings = new Settings.DeskletSettings(this, this.metadata.uuid, desklet_id);
      this.settings.bindProperty(Settings.BindingDirection.IN, "height", "height", this.onSettingsChanged, null);
      this.settings.bindProperty(Settings.BindingDirection.IN, "width", "width", this.onSettingsChanged, null);

      this.refresh();
  },


  getUIConfig () {
    return {
      height: this.height,
      width: this.width,
      items: this.layoutItems || []
    };
  },

  updateUI(){
    this.setHeader(`Current week`)

    const config = this.getUIConfig();

    this.window = createWindow(config);
    this.setContent(this.window);
  },

  getCurrentWeekNumber () {
    const weekNum = this.getDateWeek()

    this.layoutItems = [
      createLabel(''+weekNum, 'week-now-week-number')
    ]

    this.updateUI()
  },

  refresh: function() {
    this.getCurrentWeekNumber()
  },

  showMessage(msg) {
    this.layoutItems = [
      createLabel(msg, '')
    ];

    this.updateUI();
  },

  on_desklet_clicked: function() {
    this.getCurrentWeekNumber()
  },

  onSettingsChanged() {
    this.window.set_size(this.width, this.height);
  },

  on_desklet_removed: function() {
  },

  getDateWeek(date) {
    const currentDate = (typeof date === 'object') ? date : new Date();
    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday = (januaryFirst.getDay() === 1)
      ? 0
      : (7 - januaryFirst.getDay()) % 7;

    const nextMonday = new Date(currentDate.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday);

    return (currentDate < nextMonday)
      ? 52
      : currentDate > nextMonday
        ? Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7)
        : 1;
  }
};

function main(metadata, desklet_id) {
  return new WeekNowDesklet(metadata, desklet_id);
}


