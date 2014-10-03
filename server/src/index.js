(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = '<img src="" width="100%" alt="" />';
},{}],2:[function(require,module,exports){
module.exports = {
    className: 'image',
    template: require('./index.html'),
    data: {
        name: 'Image',
        icon: '/images/blocks_image.png',
        attributes: {
            src: {
                label: 'Source',
                type: 'string',
                value: '/images/placeholder.png'
            }
        }
    }
};

},{"./index.html":1}],3:[function(require,module,exports){
module.exports = '<a href="tel:{{ attributes.number.value }}">{{ attributes.label.value }}</a>\n';
},{}],4:[function(require,module,exports){
module.exports = {
    className: 'phone',
    template: require('./index.html'),
    data: {
        name: 'Phone',
        icon: '/images/blocks_phone.png',
        attributes: {
            number: {
                label: 'Phone #',
                type: 'string',
                value: '+18005555555'
            },
            innerHTML: {
                label: 'Label',
                type: 'string',
                value: 'Place call'
            }
        }
    },
};

},{"./index.html":3}],5:[function(require,module,exports){
module.exports = '<button></button>\n';
},{}],6:[function(require,module,exports){
module.exports = {
    className: 'sms',
    template: require('./index.html'),
    data: {
        name: 'SMS',
        icon: '/images/blocks_sms.png',
        attributes: {
            value: {
                label: 'Phone #',
                type: 'string',
                value: '+18005555555'
            },
            messageBody: {
                label: 'Message',
                type: 'string',
                value: '',
            },
            innerHTML: {
                label: 'Label',
                type: 'string',
                value: 'Send SMS'
            }
        }
    },
    ready: function () {
        var self = this;
        self.$el.addEventListener('click', function (e) {
            if (self.$parent.$parent.$data.params.mode !== 'play') return;
            e.preventDefault();

            var number = self.$data.attributes.value.value;
            var body = self.$data.attributes.messageBody.value;
            window.location = 'sms:' + number + '?body=' + body;
        });
    }
};

},{"./index.html":5}],7:[function(require,module,exports){
module.exports = '<p></p>';
},{}],8:[function(require,module,exports){
module.exports = {
    className: 'text',
    template: require('./index.html'),
    data: {
        name: 'Text',
        icon: '/images/blocks_text.png',
        attributes: {
            innerHTML: {
                label: 'Text',
                type: 'string',
                value: 'I am some text'
            },
            color: {
                label: 'Color',
                type: 'color',
                value: '#333444'
            },
            'font-size': {
                label: 'Font Size',
                type: 'font-size',
                value: '14'
            }
        }
    }
};

},{"./index.html":7}],9:[function(require,module,exports){
module.exports = '<button class="back" v-if="back" v-on="click: goBack">&lt;</button>\n<button v-if="cancel" v-on="click: goBack">{{\'Cancel\' | i18n}}</button>\n<h1>{{title | i18n}}</h1>\n<button v-if="onDone" v-on="click: onDone">{{\'Done\' | i18n}}</button>\n';
},{}],10:[function(require,module,exports){
(function (global){
module.exports = {
    id: 'navigationBar',
    template: require('./index.html'),
    data: {
        goBack: function (e) {
            e.preventDefault();
            global.history.back();
        }
    }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./index.html":9}],11:[function(require,module,exports){
var WebmakerAuthClient = require('webmaker-auth-client');
var page = require('page');

var auth = new WebmakerAuthClient({
    host: 'http://login-dev.mofodev.net',
    handleNewUserUI: false
});

auth.on('newuser', function (assertion, email) {
    page('/sign-up');
    auth._assertion = assertion;
    auth._email = email;
});

auth.on('error', function (err) {
    console.log(err);
});

module.exports = auth;

},{"page":76,"webmaker-auth-client":107}],12:[function(require,module,exports){
var Vue = require('vue');

module.exports = Vue.extend({
    created: function () {
        var attrs = this.$data.attributes;
        var target = this.$el.firstChild;

        for (var id in attrs) {
            if (attrs.hasOwnProperty(id)) {
                target.setAttribute(id, attrs[id].value);
                switch (id) {
                case 'innerHTML':
                    target.innerHTML = attrs[id].value;
                    break;
                case 'color':
                    target.style.color = attrs[id].value;
                    break;
                case 'font-size':
                    target.style.fontSize = attrs[id].value + 'px';
                }
            }
        }
    }
});

},{"vue":97}],13:[function(require,module,exports){
/**
 * Localization!
 *
 */
var Vue = require('vue');
var model = require('./model')();

// Spoof because navigator.language sucks
function getLocaleFromQueryString() {
    var regex = new RegExp('[\\?&]locale=([^&#]*)');
    var results = regex.exec(window.location.search);

    if (results === null) {
        return '';
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
}

function Localize () {
    var self = this;

    self.defaultLang = 'en-US';

    self.dictionary =  {};
    self.dictionaries = {};
    self.url = '';

    self.bind = function (langs, vue) {

        self.dictionaries = langs;

        // Bind directives/filters
        if (vue) {
            vue.filter('i18n', self.i18nFilter);
            vue.directive('bind-html', self.bindHtml);
        }
    };

    self.setLocale = function (locale, autodetect) {
        var html = window.document.querySelector('html');

        // Try to autodetect locale
        if (autodetect) {
            var spoofLocale = getLocaleFromQueryString();
            var navigatorLocale = navigator.language;
            var defaultLang = self.defaultLang;
            model.locale = spoofLocale || locale || navigatorLocale || defaultLang;
        }

        // Set dictionary
        var currentLangDict = self.dictionaries[model.locale];
        var defaultLangDict = self.dictionaries[self.defaultLang];
        self.dictionary = currentLangDict || defaultLangDict;

        if (html) {
            html.setAttribute('lang', model.locale);
        }

    };

    self.get = function (key) {
        var dict = self.dictionary[key];
        var defaultLang = self.dictionaries[self.defaultLang][key];
        return dict || defaultLang || key;
    };

    self.i18nFilter = function (key) {
        return self.get(key);
    };

    self.bindHtml = function (key) {
        var raw = self.get(key);
        var compiler = this.compiler;
        this.el.innerHTML = raw;
    };
}

module.exports = new Localize();

},{"./model":14,"vue":97}],14:[function(require,module,exports){
/**
 * Data model provider.
 *
 * @package webmaker
 * @author  Andrew Sliwinski <a@mozillafoundation.org>
 */

var MakeDrive = require('makedrive');
var watch = require('watchjs').watch;
var utils = require('./utils');
var auth = require('./auth');

var MAKEDRIVE_URL = 'ws://makedrive.mofodev.net';

/**
 * Constructor
 */
function Model (options) {
    var self = this;

    if (!(self instanceof Model)) return new Model();

    // Options
    // memory: (false) Use memory provider for Makedrive
    // noConnect: () if true, will not connect to remote server
    self.options = options || {};

    self.connectAttempt = false;

    // Internal
    self._ns = '/_model';
    self._ready = false;
    self._logger = function (prefix, msg) {
        if (typeof msg === 'undefined') {
            msg = prefix;
            prefix = 'Model';
        }

        if (msg) console.log('[' + prefix + '] ' + msg);
    };

    // Public
    self.history = {
        ftu: true,
        path: '/ftu'
    };
    self.locale = null;
    self.user = {};
    self.apps = [];

    // Makedrive + login
    self._fs = MakeDrive.fs({
        memory: self.options.memory,
        interval: 10000
    });
    self._sync = self._fs.sync;

    self._sync.on('connected', function() {
        self._logger('Makedrive connected');
    });
    self._sync.on('error', self._logger);
    self._sync.on('completed', function() {
        self._logger('Sync Completed');
    });
    self._sync.on('syncing', function() {
        self._logger('Syncing');
    });

}

/**
 * Restores the model from localforage.
 *
 * @param  {Function} callback
 *
 * @return {void}
 */
Model.prototype.restore = function (callback) {
    var self = this;
    self._fs.readFile(self._ns, function (err, item) {
        if (err && err.code === 'ENOENT') {
            self._logger('No saved file found.');
            self.observe();
            return callback(null);
        }

        if (!item) {
            self._logger('File was empty');
            return callback(null);
        }
        item = JSON.parse(item);

        if (typeof item.history !== 'undefined') self.history = item.history;
        if (typeof item.user !== 'undefined') self.user = item.user;
        if (typeof item.apps !== 'undefined') self.apps = item.apps;
        if (typeof item.locale !== 'undefined') self.locale = item.locale;
        self.observe();
        self._logger('Data restored');

        // Sign in and connect
        if (!self.options.noConnect) {
            auth.on('login', function (user) {
                self._logger('login');
                if (!self.connectAttempt) {
                    self._logger('Connecting...');
                    self._sync.connect(MAKEDRIVE_URL);
                    self.connectAttempt = true;
                }
                self.user = user;
            });
            auth.on('logout', function () {
                self._logger('logout');
                self.user = {};
            });
            auth.verify();
        }

        callback(null);
    });
};

/**
 * Saves the current model state to localforage.
 *
 * @param  {Function} callback
 *
 * @return {void}
 */
Model.prototype.save = function (callback) {
    var self = this;
    callback = callback || function (){};

    var item = {
        history: self.history,
        user: self.user,
        apps: self.apps,
        locale: self.locale,
    };
    putItem = JSON.stringify(item);
    self._fs.writeFile(self._ns, putItem, function (item) {
        self._logger('Data saved');
        callback(null);
    });
};

/**
 * Starts observing ("watch"-ing) for object changes.
 *
 * @return {void}
 */
Model.prototype.observe = function () {
    var self = this;

    watch(self.history, function () {
        // remove myApps from user object. we don't need to save it in the user.
        self.user.myApps = [];
        self.save(self._logger);
    }, 1);

    watch(self.user, function () {
        self.save(self._logger);
    }, 1);

    watch(self.locale, function () {
        self.save(self._logger);
    }, 1);

    watch(self.apps, function (path) {
        self.save(self._logger);
    }, 10);

    self._ready = true;
};

var model;

function instantiateModel (options) {
    // If the instance doesn't exist, create it.
    if (!model) model = new Model(options);
    return model;
}

module.exports = instantiateModel;

},{"./auth":11,"./utils":15,"makedrive":25,"watchjs":104}],15:[function(require,module,exports){
module.exports = {
    // Returns index of an object in arr containing key and val
    findInArray: function (arr, key, val) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i][key] === val) {
                return i;
            }
        }
    },
    // Note: all colors are outputted as lowercase hex.
    shadeColor: function (color, percent) {
        var num = parseInt(color.slice(1), 16);
        var amt = Math.round(2.55 * percent);
        var R = (num >> 16) + amt;
        var G = (num >> 8 & 0x00FF) + amt;
        var B = (num & 0x0000FF) + amt;
        /* jshint ignore:start */
        // jscs:disable
        return ('#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1)).toLowerCase();
        /* jshint ignore:end */
        // jscs:enable
    }
};

},{}],16:[function(require,module,exports){
module.exports = {"af":{"scientists":"scientists","Me":"Ek","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Plek","Edit":"Wysig","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Teks","teachers":"teachers","doctors":"doctors"},"ar":{"scientists":"scientists","Me":"عنّي","by user.name":"by {{user.name}}","you":"أنت","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"التفاصيل","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"الإسم","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"قوالب","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"الطلاب","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"موقع ","Edit":"حرر/عدل","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"نًص ","teachers":"teachers","doctors":"doctors"},"bg-BG":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Детайли","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Местоположение","Edit":"Редактиране","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"bn":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"bn-BD":{"scientists":"বিজ্ঞানী","Me":"আমি","by user.name":"{{user.name}}","you":"তুমি","You can create your own app. Just open a template and edit!":"আপনি আপনার নিজের অ্যাপ বানাতে পারেন। শুধুমাত্র একটি টেমপ্লেট খুলুন এবং সম্পাদনা করুন।!","Details":"বিস্তারিত","Get Started":"আসুন শুরু করি","Apps":"অ্যাপ","by author":"{{author.name}}","Image":"ছবি","Name":"নাম","activists":"স্বেচ্ছাসেবক","Apps I've Created":"আমার বানানো অ্যাপসমূহ","Templates":"টেমপ্লেটস","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"শিক্ষার্থী","Create and share app templates with people all around the world":"অ্যাপের টেমপ্লেট বানান এবং পৃথিবীর সকলের সাথে তা শেয়ার করুন","Message":"ম্যাসেজ","Remove":"সরান","vendors":"বিক্রেতারা","journalists":"সাংবাদিক","Journalist":"সাংবাদিক","parents":"অভিভাবক","Select Color":"রং পছন্দ করুন","Location":"অবস্থান","Edit":"সম্পাদনা","Apps made by _":"অ্যাপ বানিয়েছে: <span v-cycle=\\\"personas\\\"></span>","Place call":"কল করুন","Next":"পরবর্তি","Play":"দেখুন","Text":"টেক্সট","teachers":"শিক্ষক","doctors":"চিকিৎসক"},"bn-IN":{"scientists":"বিজ্ঞানীরা","Me":"আমি ","by user.name":"{{user.name}} দ্বারা","you":"আপনি","You can create your own app. Just open a template and edit!":"আপনি আপনার নিজস্ব অ্যাপ্লিকেশন তৈরি করতে পারেন. শুধুমাত্র একটি টেমপ্লেট খুলুন এবং সম্পাদনা করুন!","Details":"বিশদ বিবরণ ","Get Started":"শুরু করুন","Apps":"অ্যাপসমূহ","by author":"{{author.name}} দ্বারা","Image":"চিত্র","Name":"নাম","activists":"অংশগ্রহণকারীরা","Apps I've Created":"যে অ্যাপস্ অামি তৈরী করেছি","Templates":"টেমপ্লেটস","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"ছাত্ররা","Create and share app templates with people all around the world":"অ্যাপ্লিকেশন টেমপ্লেট তৈরি করুন এবং সারা বিশ্বের মানুষের সঙ্গে শেয়ার করুন","Remove":"সরিয়ে দিন","vendors":"vendors","journalists":"সাংবাদিকরা","Journalist":"সাংবাদিক","parents":"অভিভাবকরা","Select Color":"রঙ নির্বাচন করুন","Location":"অবস্থান","Edit":"সম্পাদনা","Apps made by _":"অ্যাপস্ তৈরী করা হয়েছে: <span v-cycle=\"personas\"></span>","Next":"পরবর্তী","Play":"খেলা","Text":"টেক্সট","teachers":"শিক্ষকরা","doctors":"চিকিৎসকরা"},"ca":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalls","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nom","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"estudiants","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Editar","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"cs":{"scientists":"vědci","Me":"Já","by user.name":"od {{user.name}}","you":"vámi","You can create your own app. Just open a template and edit!":"Můžete tvořit vaše vlastní aplikace. Stačí otevřít šablonu a upravit!","Details":"Detaily","Get Started":"Začínáme","Apps":"Aplikace","by author":"od {{author.name}}","Image":"Obrázek","Name":"Název","activists":"aktivisty","Apps I've Created":"Aplikace, které jsem vytvořil","Templates":"Šablony","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"studenty","Create and share app templates with people all around the world":"Tvorba a sdílení šablon aplikace s lidmi na celém světě","Message":"Message","Remove":"Odstranit","vendors":"prodejci","journalists":"žurnalisty","Journalist":"Žurnalista","parents":"rodiči","Select Color":"Vybrat barvu","Location":"Místo","Edit":"Upravit","Apps made by _":"Aplikace vytvořeny: <span v-cycle=\"personas\"></span>","Place call":"Place call","Next":"Další","Play":"Přehrát","Text":"Text","teachers":"učiteli","doctors":"doktory"},"da-DK":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detaljer","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Navn","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"studerende","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Placering","Edit":"Rediger","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Tekst","teachers":"teachers","doctors":"doctors"},"de":{"scientists":"scientists","Me":"Ich","by user.name":"by {{user.name}}","you":"du","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Muster","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"Schüler","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Standort","Edit":"Bearbeiten","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"el":{"scientists":"scientists","Me":"Εγώ","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"λεπτομέριες","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Όνομα","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"μαθητές","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Τοποθεσία","Edit":"Επεξεργασία","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Κείμενο","teachers":"teachers","doctors":"doctors"},"el-GR":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Λεπτομέρειες","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Επεξεργασία","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Κείμενο","teachers":"teachers","doctors":"doctors"},"en":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Editar","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"en@pirate":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"en-CA":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Message":"Message","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Colour","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Place call":"Place call","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"en-GB":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"en-US":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors","Message":"Message","Place call":"Place call"},"eo":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detaloj","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"es":{"scientists":"scientists","Me":"Yo","by user.name":"by {{user.name}}","you":"tú","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalles","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nombre","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Plantillas","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"estudiantes","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Ubicación","Edit":"Editar","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Texto","teachers":"teachers","doctors":"doctors"},"es-419":{"scientists":"scientists","Me":"Yo","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalles","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nombre","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"estudiantes","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Ubicación","Edit":"Editar","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Texto","teachers":"teachers","doctors":"doctors"},"es-AR":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nombre","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Ubicación","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Texto","teachers":"teachers","doctors":"doctors"},"es-CL":{"scientists":"científicos","Me":"Yo","by user.name":"por {{user.name}}","you":"tu","You can create your own app. Just open a template and edit!":"Puedes crear tu propia app. ¡Solo abre una plantilla y edítala!","Details":"Detalles","Get Started":"Comenzar","Apps":"Apps","by author":"por {{author.name}}","Image":"Imagen","Name":"Nombre","activists":"activistas","Apps I've Created":"Apps que he creado","Templates":"Plantillas","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"estudiantes","Create and share app templates with people all around the world":"Crea y comparte plantillas de apps con personas de todo el mundo","Message":"Mensaje","Remove":"Remover","vendors":"proveedores","journalists":"periodistas","Journalist":"Periodista","parents":"padres","Select Color":"Seleccionar color","Location":"Ubicación","Edit":"Editar","Apps made by _":"Apps creadas por: <span v-cycle=\"personas\"></span>","Place call":"Realizar llamada","Next":"Siguiente","Play":"Reproducir","Text":"Texto","teachers":"profesores","doctors":"doctores"},"es-CO":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"es-EC":{"scientists":"scientists","Me":"Yo","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalles","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"es-MX":{"scientists":"científicos","Me":"Yo","by user.name":"por {{user.name}}","you":"tú","You can create your own app. Just open a template and edit!":"Puedes crear tu propia aplicación; solo tiene que abrir una plantilla y editar.","Details":"Detalles","Get Started":"Comenzar","Apps":"Aplicaciones","by author":"por {{author.name}}","Image":"Imagen","Name":"Nombre","activists":"activistas","Apps I've Created":"Aplicaciones que he creado","Templates":"Plantillas","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"estudiantes","Create and share app templates with people all around the world":"Crea y comparte plantillas de aplicaciones con gente de todo el mundo","Message":"Mensaje","Remove":"Eliminar","vendors":"proveedores","journalists":"periodistas","Journalist":"Periodista","parents":"padres","Select Color":"Seleccionar color","Location":"Ubicación","Edit":"Editar","Apps made by _":"Aplicaciones realizadas por: <span v-cycle=\"personas\"></span>","Place call":"Hacer una llamada","Next":"Siguiente","Play":"Reproducir","Text":"Texto","teachers":"profesores","doctors":"doctores"},"es-NI":{"scientists":"scientists","Me":"Yo","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalles","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"et":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Teave","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nimi","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Asukoht","Edit":"Muuda","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Tekst","teachers":"teachers","doctors":"doctors"},"eu":{"scientists":"scientists","Me":"Ni","by user.name":"by {{user.name}}","you":"zu","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Xehetasunak","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Izena","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Txantiloiak","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Kokapena","Edit":"Editatu","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Testua","teachers":"teachers","doctors":"doctors"},"fa":{"scientists":"scientists","Me":"من","by user.name":"by {{user.name}}","you":"شما","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"جزئیات","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"نام","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"قالب‌ها","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"محل","Edit":"ویرایش","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"متن","teachers":"teachers","doctors":"doctors"},"ff":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Cariiɗe","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Taƴto","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"fi":{"scientists":"scientists","Me":"Minä","by user.name":"by {{user.name}}","you":"sinä","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Lisätiedot","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nimi","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Muokkaa","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"fil":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"ikaw","You can create your own app. Just open a template and edit!":"Pwede kang gumawa ng sarili mong app. Magbukas lang ng template at i-edit ito.","Details":"Details","Get Started":"Magsimula","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"mga mag-aaral","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Tanggalin","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"mga magulang","Select Color":"Pumili ng kulay","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"mga guro","doctors":"mga doctor"},"fr":{"scientists":"scientifiques","Me":"Moi","by user.name":"de {{user.name}}","you":"vous","You can create your own app. Just open a template and edit!":"Vous pouvez créer votre propre app. Il suffit d'ouvrir le modèle et l'éditer!","Details":"Détails","Get Started":"Commencer","Apps":"Applications","by author":"de {{author.name}}","Image":"Image","Name":"Nom","activists":"activistes","Apps I've Created":"Applications que j'ai créé","Templates":"Modèles","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"étudiants","Create and share app templates with people all around the world":"Créer et partager app modèles avec des personnes autour du monde","Message":"Message","Remove":"Supprimer","vendors":"vendeurs","journalists":"journalistes","Journalist":"Journaliste","parents":"parents","Select Color":"Sélectionner une couleur","Location":"Habite à","Edit":"Modifier","Apps made by _":"Applications créées par : <span v-cycle=\"personas\"></span>","Place call":"Passer un appel","Next":"Suivant","Play":"Jouer","Text":"Texte","teachers":"enseignants","doctors":"docteurs"},"fr-CA":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"gl":{"scientists":"scientists","Me":"Eu","by user.name":"by {{user.name}}","you":"ti","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalles","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"he":{"scientists":"scientists","Me":"אני","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"פרטים","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"שם","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"he-IL":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"hi-IN":{"scientists":"साइंटिस्टस ","Me":"मुझे","by user.name":"के द्वारा ","you":"तुम ","You can create your own app. Just open a template and edit!":"आप अपना खुद का एप्प बना सकते है |  बस एक टेम्पलेट खोलो और उसको एडिट या सम्पादित करो | ","Details":"विस्तार विवरण","Get Started":"शुरुआत करो","Apps":"एप्लिकेशनस ","by author":"के द्वारा ","Image":"चित्र ","Name":"नाम","activists":"कार्यकर्ताओं","Apps I've Created":"एप्लिकेशनस जिन्हे मै बना चुका हूँ ","Templates":"टेम्पलेट","SMS":"एस एम एस ","name from location":"से ","students":"विद्यार्थियों ","Create and share app templates with people all around the world":"एप्प बनाओ और विश्व के सभी लोगो के साथ अपनी टेम्पलेट्स शेयर करो ","Remove":"हटाओ ","vendors":"विक्रेता","journalists":"पत्रकार ","Journalist":"पत्रकार","parents":"माता पिता","Select Color":"कलर चुनो ","Location":"स्थान","Edit":"संपादित करें","Apps made by _":"एप्प का निर्माता ","Next":"अगला ","Play":"प्ले ","Text":"पाठ","teachers":"शिक्षकों","doctors":"चिकित्सकों "},"hr-HR":{"scientists":"scientists","Me":"Ja","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalji","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Uredi","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"hu":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Részletek","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Szerkesztés","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Szöveg","teachers":"teachers","doctors":"doctors"},"id":{"scientists":"ilmuwan","Me":"Saya","by user.name":"oleh {{user.name}}","you":"Anda","You can create your own app. Just open a template and edit!":"Anda dapat membuat aplikasi anda sendiri. Cukup dengan membuka sebuah template dan ubah!","Details":"Rincian","Get Started":"Mulai","Apps":"Aplikasi","by author":"oleh {{author.name}}","Image":"Gambar","Name":"Nama","activists":"aktivis","Apps I've Created":"Aplikasi yang telah saya buat","Templates":"Template","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"pelajar","Create and share app templates with people all around the world":"Buat dan bagikan contoh aplikasi kepada orang-orang diseluruh dunia","Message":"Pesan","Remove":"Buang","vendors":"penjual","journalists":"wartawan","Journalist":"Wartawan","parents":"orang tua","Select Color":"Pilih Warna","Location":"Lokasi","Edit":"Edit","Apps made by _":"Aplikasi dibuat oleh: <span v-cycle=\"personas\"></span>","Place call":"Letakkan panggilan","Next":"Selanjutnya","Play":"Mainkan","Text":"Teks","teachers":"guru","doctors":"dokter"},"is":{"scientists":"scientists","Me":"Ég","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Smáatriði","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nafn","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Staðsetning","Edit":"Breyta","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Texti","teachers":"teachers","doctors":"doctors"},"it":{"scientists":"scientists","Me":"Io","by user.name":"by {{user.name}}","you":"te","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Dettagli","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nome","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Modelli","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"studenti","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Localizzazione","Edit":"Modifica","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Testo","teachers":"teachers","doctors":"doctors"},"ja":{"scientists":"scientists","Me":"マイページ","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"詳細","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"名前","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"学生","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"場所","Edit":"編集","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"テキスト","teachers":"teachers","doctors":"doctors"},"km":{"scientists":"scientists","Me":"ខ្ញុំ","by user.name":"by {{user.name}}","you":"អ្នក","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"សេចក្ដី​លម្អិត","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"ឈ្មោះ","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"ពុម្ព​","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"សិស្ស","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"ទីតាំង","Edit":"កែសម្រួល","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"អត្ថបទ","teachers":"teachers","doctors":"doctors"},"km-KH":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"kn-IN":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"ಹೆಸರು","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"ko":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"세부사항","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"학생","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"편집기","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"ko-KR":{"scientists":"scientists","Me":"나","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"자세히 보기","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"이름","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"템플릿","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"학생","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"장소","Edit":"편집","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"텍스트","teachers":"teachers","doctors":"doctors"},"la":{"scientists":"scientists","Me":"Ego","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nomen","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"lt-LT":{"scientists":"scientists","Me":"aš","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Išsamiai","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Redaguoti","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"mai":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"mk":{"scientists":"scientists","Me":"Јас","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Детали","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Локација","Edit":"Промени","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"ml":{"scientists":"scientists","Me":"ഞാന്‍","by user.name":"by {{user.name}}","you":"നിങ്ങള്‍","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"വിശദാംശങ്ങള്‍","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"ഫലകങ്ങള്‍","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"പ്രദേശം","Edit":"തിരുത്തുക","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"ടെക്സ്റ്റ്","teachers":"teachers","doctors":"doctors"},"ml-IN":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"mr":{"scientists":"scientists","Me":"मी","by user.name":"by {{user.name}}","you":"आपण","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"तपशील","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"नाव","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"स्थान","Edit":"संपादीत करा","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"ms":{"scientists":"scientists","Me":"Saya","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Maklumat","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"pelajar-pelajar","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"my":{"scientists":"scientists","Me":"ကျွနု်ပ်","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"အသေးစိတ်","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"အမည်","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"ပြုပြင်","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"ne":{"scientists":"scientists","Me":"म","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"विवरणहरु","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"नाम","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"स्थान","Edit":"सम्पादन","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"पाठ","teachers":"teachers","doctors":"doctors"},"nl":{"scientists":"wetenschappers","Me":"Ik","by user.name":"door {{user.name}}","you":"u","You can create your own app. Just open a template and edit!":"U kunt uw eigen app maken. Open gewoon een sjabloon en bewerk deze!","Details":"Details","Get Started":"Begin nu","Apps":"Apps","by author":"door {{author.name}}","Image":"Afbeelding","Name":"Naam","activists":"activisten","Apps I've Created":"Apps die ik heb gemaakt","Templates":"Sjablonen","SMS":"sms","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"studenten","Create and share app templates with people all around the world":"Maak en deel app-sjablonen met mensen van over de hele wereld","Message":"Bericht","Remove":"Verwijder","vendors":"uitgevers","journalists":"journalisten","Journalist":"Journalist","parents":"ouders","Select Color":"Selecteer een kleur","Location":"Locatie","Edit":"Bewerken","Apps made by _":"Apps gemaakt door: <span v-cycle=\"personas\"></span>","Place call":"Nummer bellen","Next":"Volgende","Play":"Spelen","Text":"Tekst","teachers":"onderwijzers","doctors":"dokters"},"oc":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalhs","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"or-IN":{"scientists":"scientists","Me":"ମୁଁ","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"ସବିଶେଷ","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"ନାମ","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"pa":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"pa-IN":{"scientists":"scientists","Me":"ਮੈਂ","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"ਵੇਰਵਾ","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"ਨਾਮ","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"ਵਿਦਿਆਰਥੀ","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"ਮੁਕਾਮ","Edit":"ਸੋਧ","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"ਟੈਕਸਟ","teachers":"teachers","doctors":"doctors"},"pl-PL":{"scientists":"scientists","Me":"Ja","by user.name":"by {{user.name}}","you":"ty","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Szczegóły","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nazwa","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Szablony","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"studenci","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Lokalizacja","Edit":"Zmień","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"pt":{"scientists":"scientists","Me":"Eu","by user.name":"by {{user.name}}","you":"você","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalhes","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nome","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Modelos","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"Estudantes","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Local","Edit":"Editar","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Texto","teachers":"teachers","doctors":"doctors"},"pt-BR":{"scientists":"scientists","Me":"Eu","by user.name":"by {{user.name}}","you":"você","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalhes","Get Started":"Get Started","Apps":"Aplitcativos","by author":"by {{author.name}}","Image":"Imagem","Name":"Nome","activists":"activists","Apps I've Created":"Aplicativos que eu criei","Templates":"Modelos","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"alunos","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Jornalista","parents":"parents","Select Color":"Select Color","Location":"Local","Edit":"Editar","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Próximo","Play":"Play","Text":"Texto","teachers":"teachers","doctors":"doctors"},"ro":{"scientists":"scientists","Me":"Eu","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalii","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Nume","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Editare","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"ru":{"scientists":"scientists","Me":"Я","by user.name":"by {{user.name}}","you":"Вы","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Детали","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Название","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Шаблоны","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Местоположение","Edit":"редактироваете","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Текст","teachers":"teachers","doctors":"doctors"},"si-LK":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"sk":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detaily","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Meno","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Miesto","Edit":"Zmeniť","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"sl":{"scientists":"scientists","Me":"Moja","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Podrobnosti","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Ime","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"študente","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Položaj","Edit":"Urejanje","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Besedilo","teachers":"teachers","doctors":"doctors"},"sq":{"scientists":"scientists","Me":"unë","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Hollësi","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Emri","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Përpunoni","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"sq-AL":{"scientists":"scientists","Me":"Unë","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detaje","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"sr":{"scientists":"scientists","Me":"Ja","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalji","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Ime","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Izmijeni","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"sr-RS":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"studenti","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"su":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"sv":{"scientists":"forskare","Me":"Mig","by user.name":"efter {{user.name}}","you":"dig","You can create your own app. Just open a template and edit!":"Du kan skapa din egna app. Öppna bara en mall och editera!","Details":"Detaljer","Get Started":"Kom igång","Apps":"Appar","by author":"efter {{author.name}}","Image":"Bild","Name":"Namn","activists":"aktivister ","Apps I've Created":"Appar jag har skapat","Templates":"Mallar","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"><br/> from <br/></span><strong>{{location}}</strong>","students":"studenter","Create and share app templates with people all around the world":"Skapa och dela app mallar med folk runt om i världen","Message":"Meddelande ","Remove":"Radera","vendors":"utvecklare","journalists":"journalister","Journalist":"Journalist","parents":"föräldrar","Select Color":"Välj Färg","Location":"Område","Edit":"Redigera","Apps made by _":"Appar gjorda av: <span v-cycle=\"personas\"></span>","Place call":"Place call","Next":"Nästa","Play":"Spela","Text":"Text","teachers":"lärare","doctors":"doktorer"},"ta":{"scientists":"scientists","Me":"என்னை","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"விவரங்கள்","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"இடம்","Edit":"திருத்து","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"உரை","teachers":"teachers","doctors":"doctors"},"ta-IN":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"விவரங்கள்","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"திருத்து","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"te":{"scientists":"scientists","Me":"నేను","by user.name":"ద్వారా{{వాడక దారుడి పేరు     }}","you":"మీరు","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"వివరాలు","Get Started":"Get Started","Apps":"Apps","by author":"ద్వారా {{ రచయిత పేరు }}","Image":"Image","Name":"పేరు","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{పేరు }}</strong><span v-if=\"location\"> నుండి </span><strong>{{నగరం }}</strong>","students":"విద్యార్థులు","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"లొకేషన్","Edit":"ఎడిట్","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"టెక్స్ట్","teachers":"teachers","doctors":"doctors"},"te-IN":{"scientists":"scientists","Me":"నెను","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"వివరాలు","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"th-TH":{"scientists":"scientists","Me":"ฉัน","by user.name":"by {{user.name}}","you":"คุณ","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"รายละเอียด","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"ชื่อ","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"แม่แบบ","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"สถานที่","Edit":"แก้ไข","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"ข้อความ","teachers":"teachers","doctors":"doctors"},"tl":{"scientists":"scientists","Me":"Ako","by user.name":"by {{user.name}}","you":"ikaw","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detalye","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"Mga mag-aaral","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"tr-TR":{"scientists":"scientists","Me":"Ben","by user.name":"by {{user.name}}","you":"sen","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Detaylar","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"İsim","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Şablonlar","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"Öğrenciler","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Konum","Edit":"Düzenle","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Metin","teachers":"teachers","doctors":"doctors"},"uk":{"scientists":"scientists","Me":"Я","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Деталі","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Імя ","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"учні","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Розташування","Edit":"Редагувати","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Текст","teachers":"teachers","doctors":"doctors"},"ur":{"scientists":"scientists","Me":"میں","by user.name":"by {{user.name}}","you":"آپ","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":" تفاصیل","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"نام","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"سانچے","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"ترمیم کریں","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"متن","teachers":"teachers","doctors":"doctors"},"ur-PK":{"scientists":"scientists","Me":"میں","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"تفصیلات","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"uz":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Tavsilotlar","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Ism","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"vi-VN":{"scientists":"scientists","Me":"Tôi","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Chi tiết","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Tên","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Địa điểm","Edit":"Sửa","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Văn bản","teachers":"teachers","doctors":"doctors"},"zh":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"Edit","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"zh-CN":{"scientists":"scientists","Me":"自我","by user.name":"创建者 {{user.name}}","you":"您","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"细节","Get Started":"Get Started","Apps":"手机软件","by author":"创建者 {{author.name}}","Image":"Image","Name":"名称","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"模板","SMS":"SMS","name from location":"<strong>{{name}}</strong><span v-if=\\\"location\\\">来自</span><strong>{{location}}</strong>","students":"学生","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"地区","Edit":"编辑","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"文本","teachers":"teachers","doctors":"doctors"},"zh-HK":{"scientists":"scientists","Me":"Me","by user.name":"by {{user.name}}","you":"you","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"Details","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"Name","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"Templates","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"students","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"Location","Edit":"編輯","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"Text","teachers":"teachers","doctors":"doctors"},"zh-TW":{"scientists":"scientists","Me":"我","by user.name":"by {{user.name}}","you":"您","You can create your own app. Just open a template and edit!":"You can create your own app. Just open a template and edit!","Details":"詳情","Get Started":"Get Started","Apps":"Apps","by author":"by {{author.name}}","Image":"Image","Name":"名稱","activists":"activists","Apps I've Created":"Apps I've Created","Templates":"範本","SMS":"SMS","name from location":" <strong>{{name}}</strong><span v-if=\"location\"> from </span><strong>{{location}}</strong>","students":"學生","Create and share app templates with people all around the world":"Create and share app templates with people all around the world","Remove":"Remove","vendors":"vendors","journalists":"journalists","Journalist":"Journalist","parents":"parents","Select Color":"Select Color","Location":"位置","Edit":"編輯","Apps made by _":"Apps made by: <span v-cycle=\"personas\"></span>","Next":"Next","Play":"Play","Text":"文字","teachers":"teachers","doctors":"doctors"}};
},{}],17:[function(require,module,exports){
(function (Buffer){
'use strict';

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

// shim for Node's 'util' package
// DO NOT REMOVE THIS! It is required for compatibility with EnderJS (http://enderjs.com/).
var util = {
  isArray: function (ar) {
    return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
  },
  isDate: function (d) {
    return typeof d === 'object' && objectToString(d) === '[object Date]';
  },
  isRegExp: function (re) {
    return typeof re === 'object' && objectToString(re) === '[object RegExp]';
  },
  getRegExpFlags: function (re) {
    var flags = '';
    re.global && (flags += 'g');
    re.ignoreCase && (flags += 'i');
    re.multiline && (flags += 'm');
    return flags;
  }
};


if (typeof module === 'object')
  module.exports = clone;

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
*/

function clone(parent, circular, depth, prototype) {
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth == 0)
      return parent;

    var child;
    if (typeof parent != 'object') {
      return parent;
    }

    if (util.isArray(parent)) {
      child = [];
    } else if (util.isRegExp(parent)) {
      child = new RegExp(parent.source, util.getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (util.isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else {
      if (typeof prototype == 'undefined') child = Object.create(Object.getPrototypeOf(parent));
      else child = Object.create(prototype);
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    for (var i in parent) {
      child[i] = _clone(parent[i], depth - 1);
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

}).call(this,require("buffer").Buffer)
},{"buffer":18}],18:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":19,"ieee754":20}],19:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
  'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

  var PLUS   = '+'.charCodeAt(0)
  var SLASH  = '/'.charCodeAt(0)
  var NUMBER = '0'.charCodeAt(0)
  var LOWER  = 'a'.charCodeAt(0)
  var UPPER  = 'A'.charCodeAt(0)

  function decode (elt) {
    var code = elt.charCodeAt(0)
    if (code === PLUS)
      return 62 // '+'
    if (code === SLASH)
      return 63 // '/'
    if (code < NUMBER)
      return -1 //no match
    if (code < NUMBER + 10)
      return code - NUMBER + 26 + 26
    if (code < UPPER + 26)
      return code - UPPER
    if (code < LOWER + 26)
      return code - LOWER + 26
  }

  function b64ToByteArray (b64) {
    var i, j, l, tmp, placeHolders, arr

    if (b64.length % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4')
    }

    // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice
    var len = b64.length
    placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

    // base64 is 4/3 + up to two characters of the original data
    arr = new Arr(b64.length * 3 / 4 - placeHolders)

    // if there are placeholders, only get up to the last complete 4 chars
    l = placeHolders > 0 ? b64.length - 4 : b64.length

    var L = 0

    function push (v) {
      arr[L++] = v
    }

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
      tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
      push((tmp & 0xFF0000) >> 16)
      push((tmp & 0xFF00) >> 8)
      push(tmp & 0xFF)
    }

    if (placeHolders === 2) {
      tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
      push(tmp & 0xFF)
    } else if (placeHolders === 1) {
      tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
      push((tmp >> 8) & 0xFF)
      push(tmp & 0xFF)
    }

    return arr
  }

  function uint8ToBase64 (uint8) {
    var i,
      extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
      output = "",
      temp, length

    function encode (num) {
      return lookup.charAt(num)
    }

    function tripletToBase64 (num) {
      return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
    }

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
      temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
      output += tripletToBase64(temp)
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    switch (extraBytes) {
      case 1:
        temp = uint8[uint8.length - 1]
        output += encode(temp >> 2)
        output += encode((temp << 4) & 0x3F)
        output += '=='
        break
      case 2:
        temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
        output += encode(temp >> 10)
        output += encode((temp >> 4) & 0x3F)
        output += encode((temp << 2) & 0x3F)
        output += '='
        break
    }

    return output
  }

  exports.toByteArray = b64ToByteArray
  exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],20:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],21:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],22:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],23:[function(require,module,exports){
(function (global){
function parse(url) { return new global.URL(url); }
function format(urlObj) { return urlObj.toString(); }

module.exports = {
  parse: parse,
  format: format
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
(function (global){
/**
 * In node.js we want to use the ws module for WebSocket. In the
 * browser we can just use the native WebSocket. Here we adapt
 * the browser's WebSocket interface to more closely match ws
 * so that we can use either.
 *
 * This module gets used by browserify, see package.json
 */

global.WebSocket.prototype.on = global.WebSocket.prototype.on || function(event, listener) {
  this.addEventListener(event, listener);
};

global.WebSocket.prototype.removeListener = global.WebSocket.prototype.removeListener || function(event, listener) {
  this.removeEventListener(event, listener);
};

global.WebSocket.prototype.once = global.WebSocket.prototype.once || function(event, listener) {
  var ws = this;
  this.addEventListener(event, function onEvent() {
    ws.removeEventListener(event, onEvent);
    listener.apply(null, arguments);
  });
};

module.exports = global.WebSocket;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],25:[function(require,module,exports){
(function (global){
/**
 * MakeDrive is a single/shared Filer filesystem instance with
 * manual- and auto-sync'ing features. A client first gets the
 * filesystem instance like so:
 *
 * var fs = MakeDrive.fs();
 *
 * Multiple calls to MakeDrive.fs() will return the same instance.
 *
 * A number of configuration options can be passed to the fs() function.
 * These include:
 *
 * - manual=true - by default the filesystem syncs automatically in
 * the background. This disables it.
 *
 * - memory=<Boolean> - by default we use a persistent store (indexeddb
 * or websql). Using memory=true overrides and uses a temporary ram disk.
 *
 * - provider=<Object> - a Filer data provider to use instead of the
 * default provider normally used. The provider given should already
 * be instantiated (i.e., don't pass a constructor function).
 *
 * - forceCreate=<Boolean> - by default we return the same fs instance with
 * every call to MakeDrive.fs(). In some cases it is necessary to have
 * multiple instances.  Using forceCreate=true does this.
 *
 * - interval=<Number> - by default, the filesystem syncs every minute if
 * auto syncing is turned on otherwise the interval between syncs can be
 * specified in ms.
 *
 * Various bits of Filer are available on MakeDrive, including:
 *
 * - MakeDrive.Buffer
 * - MakeDrive.Path
 * - MakeDrive.Errors
 *
 * The filesystem instance returned by MakeDrive.fs() also includes
 * a new property `sync`.  The fs.sync property is an EventEmitter
 * which emits the following events:
 *
 * - 'error': an error occured while connecting/syncing. The error
 * object is passed as the first arg to the event.
 *
 * - 'connected': a connection was established with the sync server
 *
 * - 'disconnected': the connection to the sync server was lost, either
 * due to the client or server.
 *
 * - 'syncing': a sync with the server has begun. A subsequent 'completed'
 * or 'error' event should follow at some point, indicating whether
 * or not the sync was successful.
 *
 * - 'completed': a sync has completed and was successful.
 *
 *
 * The `sync` property also exposes a number of methods, including:
 *
 * - connect(url, [token]): try to connect to the specified sync server URL.
 * An 'error' or 'connected' event will follow, depending on success. If the
 * token parameter is provided, that authentication token will be used. Otherwise
 * the client will try to obtain one from the server's /api/sync route. This
 * requires the user to be authenticated previously with Webmaker.
 *
 * - disconnect(): disconnect from the sync server.
 *
 * - request(path): request a sync with the server for the specified
 * path. Such requests may or may not be processed right away.
 *
 *
 * Finally, the `sync` propery also exposes a `state`, which is the
 * current sync state and can be one of:
 *
 * sync.SYNC_DISCONNECTED = "SYNC DISCONNECTED" (also the initial state)
 * sync.SYNC_CONNECTING = "SYNC CONNECTING"
 * sync.SYNC_CONNECTED = "SYNC CONNECTED"
 * sync.SYNC_SYNCING = "SYNC SYNCING"
 * sync.SYNC_ERROR = "SYNC ERROR"
 */

var SyncManager = require('./sync-manager.js');
var SyncFileSystem = require('./sync-filesystem.js');
var Filer = require('../../lib/filer.js');
var resolvePath = require('../../lib/sync-path-resolver').resolve;
var EventEmitter = require('events').EventEmitter;

var MakeDrive = {};
module.exports = MakeDrive;

function createFS(options) {
  options.manual = options.manual === true;
  options.memory = options.memory === true;
  options.autoReconnect = options.autoReconnect !== false;

  // Use a supplied provider, in memory RAM disk, or Fallback provider (default).
  var provider;
  if(options.provider) {
    provider = options.provider;
  } else if(options.memory) {
    provider = new Filer.FileSystem.providers.Memory('makedrive');
  } else {
    provider = new Filer.FileSystem.providers.Fallback('makedrive');
  }

  // Our fs instance is a modified Filer fs, with extra sync awareness
  // for conflict mediation, etc.  We keep an internal reference to the
  // raw Filer fs, and use the SyncFileSystem instance externally.
  var _fs = new Filer.FileSystem({provider: provider});
  var fs = new SyncFileSystem(_fs);
  var sync = fs.sync = new EventEmitter();
  var manager;

  // Auto-sync handles
  var autoSync;
  var pathCache;

  // State of the sync connection
  sync.SYNC_DISCONNECTED = "SYNC DISCONNECTED";
  sync.SYNC_CONNECTING = "SYNC CONNECTING";
  sync.SYNC_CONNECTED = "SYNC CONNECTED";
  sync.SYNC_SYNCING = "SYNC SYNCING";
  sync.SYNC_ERROR = "SYNC ERROR";

  // Intitially we are not connected
  sync.state = sync.SYNC_DISCONNECTED;

  // Optionally warn when closing the window if still syncing
  function windowCloseHandler(event) {
    if(!options.windowCloseWarning) {
      return;
    }

    if(sync.state !== sync.SYNC_SYNCING) {
      return;
    }

    var confirmationMessage = "Sync currently underway, are you sure you want to close?";
    (event || global.event).returnValue = confirmationMessage;

    return confirmationMessage;
  }

  function cleanupManager() {
    if(!manager) {
      return;
    }
    manager.close();
    manager = null;
  }

  // Turn on auto-syncing if its not already on
  sync.auto = function(interval) {
    var syncInterval = interval|0 > 0 ? interval|0 : 60 * 1000;

    if(autoSync) {
      clearInterval(autoSync);
    }

    autoSync = setInterval(sync.request, syncInterval);
  };

  // Turn off auto-syncing and turn on manual syncing
  sync.manual = function() {
    if(autoSync) {
      clearInterval(autoSync);
      autoSync = null;
    }
  };

  sync.onError = function(err) {
    // Regress to the path that needed to be synced but failed
    // (likely because of a sync LOCK)
    fs.pathToSync = pathCache;
    sync.state = sync.SYNC_ERROR;
    sync.emit('error', err);
  };

  sync.onDisconnected = function() {
    // Remove listeners so we don't leak instance variables
    if("onbeforeunload" in global) {
      global.removeEventListener('beforeunload', windowCloseHandler);
    }
    if("onunload" in global){
      global.removeEventListener('unload', cleanupManager);
    }

    sync.state = sync.SYNC_DISCONNECTED;
    sync.emit('disconnected');
  };

  // Request that a sync begin.
  sync.request = function() {
    // If we're not connected (or are already syncing), ignore this request
    if(sync.state === sync.SYNC_DISCONNECTED || sync.state === sync.SYNC_ERROR) {
      sync.emit('error', new Error('Invalid state. Expected ' + sync.SYNC_CONNECTED + ', got ' + sync.state));
      return;
    }

    // If there were no changes to the filesystem, ignore this request
    if(!fs.pathToSync) {
      return;
    }

    // Cache the path that needs to be synced for error recovery
    pathCache = fs.pathToSync;
    fs.pathToSync = null;
    manager.syncPath(pathCache);
  };

  // Try to connect to the server.
  sync.connect = function(url, token) {
    // Bail if we're already connected
    if(sync.state !== sync.SYNC_DISCONNECTED &&
       sync.state !== sync.ERROR) {
      sync.emit('error', new Error("MakeDrive: Attempted to connect to \"" + url + "\", but a connection already exists!"));
      return;
    }

    // Also bail if we already have a SyncManager
    if(manager) {
      return;
    }

    // Upgrade connection state to `connecting`
    sync.state = sync.SYNC_CONNECTING;

    function downstreamSyncCompleted() {
      // Re-wire message handler functions for regular syncing
      // now that initial downstream sync is completed.
      sync.onSyncing = function() {
        sync.state = sync.SYNC_SYNCING;
        sync.emit('syncing');
      };

      sync.onCompleted = function(paths) {
        // If changes happened to the files that needed to be synced
        // during the sync itself, they will be overwritten
        // https://github.com/mozilla/makedrive/issues/129 and
        // https://github.com/mozilla/makedrive/issues/3

        function complete() {
          sync.state = sync.SYNC_CONNECTED;
          sync.emit('completed');
        }

        if(!paths) {
          return complete();
        }

        manager.resetUnsynced(paths, function(err) {
          if(err) {
            return sync.onError(err);
          }

          complete();
        });
      };

      // Upgrade connection state to 'connected'
      sync.state = sync.SYNC_CONNECTED;

      // If we're in manual mode, bail before starting auto-sync
      if(options.manual) {
        sync.manual();
      } else {
        sync.auto(options.interval);
      }

      // In a browser, try to clean-up after ourselves when window goes away
      if("onbeforeunload" in global) {
        global.addEventListener('beforeunload', windowCloseHandler);
      }
      if("onunload" in global){
        global.addEventListener('unload', cleanupManager);
      }

      sync.emit('connected');
    }

    function connect(token) {
      // Try to connect to provided server URL. Use the raw Filer fs
      // instance for all rsync operations on the filesystem, so that we
      // can untangle changes done by user vs. sync code.
      manager = new SyncManager(sync, _fs);
      manager.init(url, token, options, function(err) {
        if(err) {
          sync.onError(err);
          return;
        }

        // Wait on initial downstream sync events to complete
        sync.onSyncing = function() {
          // do nothing, wait for onCompleted()
        };
        sync.onCompleted = function() {
          // Downstream sync is done, finish connect() setup
          downstreamSyncCompleted();
        };
      });
    }
    connect(token);
  };

  // Disconnect from the server
  sync.disconnect = function() {
    // Bail if we're not already connected
    if(sync.state === sync.SYNC_DISCONNECTED ||
       sync.state === sync.ERROR) {
      sync.emit('error', new Error("MakeDrive: Attempted to disconnect, but no server connection exists!"));
      return;
    }

    // Stop auto-syncing
    if(autoSync) {
      clearInterval(autoSync);
      autoSync = null;
      fs.pathToSync = null;
    }

    // Do a proper network shutdown
    cleanupManager();

    sync.onDisconnected();
  };

  return fs;
}

// Manage single instance of a Filer filesystem with auto-sync'ing
var sharedFS;

MakeDrive.fs = function(options) {
  options = options || {};

  // We usually only want to hand out a single, shared instance
  // for every call, but sometimes you need multiple (e.g., tests)
  if(options.forceCreate) {
    return createFS(options);
  }

  if(!sharedFS) {
    sharedFS = createFS(options);
  }
  return sharedFS;
};

// Expose bits of Filer that clients will need on MakeDrive
MakeDrive.Buffer = Filer.Buffer;
MakeDrive.Path = Filer.Path;
MakeDrive.Errors = Filer.Errors;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../lib/filer.js":36,"../../lib/sync-path-resolver":44,"./sync-filesystem.js":27,"./sync-manager.js":28,"events":21}],26:[function(require,module,exports){
var SyncMessage = require('../../lib/syncmessage');
var rsync = require('../../lib/rsync');
var rsyncUtils = rsync.utils;
var rsyncOptions = require('../../lib/constants').rsyncDefaults;
var serializeDiff = require('../../lib/diff').serialize;
var deserializeDiff = require('../../lib/diff').deserialize;
var states = require('./sync-states');
var steps = require('./sync-steps');
var dirname = require('../../lib/filer').Path.dirname;

function onError(syncManager, err) {
  syncManager.session.step = steps.FAILED;
  syncManager.sync.onError(err);
}

// Checks if path is in masterPath
function hasCommonPath(masterPath, path) {
  if(masterPath === path) {
    return true;
  }

  if(path === '/') {
    return false;
  }

  return hasCommonPath(masterPath, dirname(path));
}

function handleRequest(syncManager, data) {
  var fs = syncManager.fs;
  var sync = syncManager.sync;
  var session = syncManager.session;

  function handleChecksumRequest() {
    var srcList = session.srcList = data.content.srcList;
    session.path = data.content.path;
    fs.modifiedPath = null;
    sync.onSyncing();

    rsync.checksums(fs, session.path, srcList, rsyncOptions, function(err, checksums) {
      if (err) {
        return onError(syncManager, err);
      }

      session.step = steps.PATCH;

      var message = SyncMessage.request.diffs;
      message.content = {checksums: checksums};
      syncManager.send(message.stringify());
    });
  }

  function handleDiffRequest() {
    rsync.diff(fs, session.path, data.content.checksums, rsyncOptions, function(err, diffs) {
      if(err){
        return onError(syncManager, err);
      }

      session.step = steps.PATCH;

      var message = SyncMessage.response.diffs;
      message.content = {diffs: serializeDiff(diffs)};
      syncManager.send(message.stringify());
    });
  }


  if(data.is.chksum && session.is.ready &&
     (session.is.synced || session.is.failed)) {
    // DOWNSTREAM - CHKSUM
    handleChecksumRequest();
  } else if(data.is.diffs && session.is.syncing && session.is.diffs) {
    // UPSTREAM - DIFFS
    handleDiffRequest();
  } else {
    onError(syncManager, new Error('Failed to sync with the server. Current step is: ' +
                                    session.step + '. Current state is: ' + session.state));  }
}

function handleResponse(syncManager, data) {
  var fs = syncManager.fs;
  var sync = syncManager.sync;
  var session = syncManager.session;

  function resendChecksums() {
    if(!session.srcList) {
      // Sourcelist was somehow reset, the entire downstream sync
      // needs to be restarted
      session.step = steps.FAILED;
      syncManager.send(SyncMessage.response.reset.stringify());
      return onError(syncManager, new Error('Fatal Error: Could not sync filesystem from server...trying again!'));
    }

    rsync.checksums(fs, session.path, session.srcList, rsyncOptions, function(err, checksums) {
      if(err) {
        syncManager.send(SyncMessage.response.reset.stringify());
        return onError(syncManager, err);
      }

      var message = SyncMessage.request.diffs;
      message.content = {checksums: checksums};
      syncManager.send(message.stringify());
    });
  }

  function handleSrcListResponse() {
    session.state = states.SYNCING;
    session.step = steps.INIT;
    session.path = data.content.path;
    sync.onSyncing();

    rsync.sourceList(fs, session.path, rsyncOptions, function(err, srcList) {
      if(err){
        syncManager.send(SyncMessage.request.reset.stringify());
        return onError(syncManager, err);
      }

      session.step = steps.DIFFS;

      var message = SyncMessage.request.chksum;
      message.content = {srcList: srcList};
      syncManager.send(message.stringify());
    });
  }

  function handlePatchAckResponse() {
    session.state = states.READY;
    session.step = steps.SYNCED;
    sync.onCompleted(data.content.syncedPaths);
  }

  function handlePatchResponse() {
    var modifiedPath = fs.modifiedPath;
    fs.modifiedPath = null;

    // If there was a change to the filesystem that shares a common path with
    // the path being synced, regenerate the checksums and send them
    // (even if it is the initial one)
    if(modifiedPath && hasCommonPath(session.path, modifiedPath)) {
      return resendChecksums();
    }

    var diffs = data.content.diffs;
    diffs = deserializeDiff(diffs);

    rsync.patch(fs, session.path, diffs, rsyncOptions, function(err, paths) {
      if (err) {
        var message = SyncMessage.response.reset;
        syncManager.send(message.stringify());
        return onError(syncManager, err);
      }

      var size = rsyncOptions.size || 5;

      rsyncUtils.generateChecksums(fs, paths.synced, size, function(err, checksums) {
        if(err) {
          var message = SyncMessage.response.reset;
          syncManager.send(message.stringify());
          return onError(syncManager, err);
        }

        var message = SyncMessage.response.patch;
        message.content = {checksums: checksums, size: size};
        syncManager.send(message.stringify());
      });
    });
  }

  function handleVerificationResponse() {
    session.srcList = null;
    session.step = steps.SYNCED;
    sync.onCompleted();
  }

  function handleUpstreamResetResponse() {
    var message = SyncMessage.request.sync;
    message.content = {path: session.path};
    syncManager.send(message.stringify());
  }

  if(data.is.sync) {
    // UPSTREAM - INIT
    handleSrcListResponse();
  } else if(data.is.patch && session.is.syncing && session.is.patch) {
    // UPSTREAM - PATCH
    handlePatchAckResponse();
  } else if(data.is.diffs && session.is.ready && session.is.patch) {
    // DOWNSTREAM - PATCH
    handlePatchResponse();
  } else if(data.is.verification && session.is.ready && session.is.patch) {
    // DOWNSTREAM - PATCH VERIFICATION
    handleVerificationResponse();
  }  else if (data.is.reset && session.is.failed) {
    handleUpstreamResetResponse();
  } else {
    onError(syncManager, new Error('Failed to sync with the server. Current step is: ' +
                                    session.step + '. Current state is: ' + session.state));  }
}

function handleError(syncManager, data) {
  var sync = syncManager.sync;
  var session = syncManager.session;
  var message = SyncMessage.response.reset;

  // DOWNSTREAM - ERROR
  if((((data.is.srclist && session.is.synced)) ||
      (data.is.diffs && session.is.patch) && (session.is.ready || session.is.syncing))) {
    session.state = states.READY;
    session.step = steps.SYNCED;

    syncManager.send(message.stringify());
    onError(syncManager, new Error('Could not sync filesystem from server... trying again'));
  } else if(data.is.verification && session.is.patch && session.is.ready) {
    syncManager.send(message.stringify());
    onError(syncManager, new Error('Could not sync filesystem from server... trying again'));
  } else if(data.is.locked && session.is.ready && session.is.synced) {
    // UPSTREAM - LOCK
    onError(syncManager, new Error('Current sync in progress! Try again later!'));
  } else if(((data.is.chksum && session.is.diffs) ||
             (data.is.patch && session.is.patch)) &&
            session.is.syncing) {
    // UPSTREAM - ERROR
    var message = SyncMessage.request.reset;
    syncManager.send(message.stringify());
    onError(syncManager, new Error('Could not sync filesystem from server... trying again'));
  } else {
    onError(syncManager, new Error('Failed to sync with the server. Current step is: ' +
                                    session.step + '. Current state is: ' + session.state));
  }
}

function handleMessage(syncManager, data) {
  try {
    data = JSON.parse(data);
    data = SyncMessage.parse(data);
  } catch(e) {
    return onError(syncManager, e);
  }

  if (data.is.request) {
    handleRequest(syncManager, data);
  } else if(data.is.response){
    handleResponse(syncManager, data);
  } else if(data.is.error){
    handleError(syncManager, data);
  } else {
    onError(syncManager, new Error('Cannot handle message'));
  }
}

module.exports = handleMessage;

},{"../../lib/constants":33,"../../lib/diff":34,"../../lib/filer":36,"../../lib/rsync":40,"../../lib/syncmessage":45,"./sync-states":29,"./sync-steps":30}],27:[function(require,module,exports){
/**
 * An extended Filer FileSystem with wrapped methods
 * for writing that manage file metadata (xattribs)
 * reflecting sync state.
 */

var Filer = require('../../lib/filer.js');
var Shell = require('../../lib/filer-shell.js');
var Path = Filer.Path;
var fsUtils = require('../../lib/fs-utils.js');
var conflict = require('../../lib/conflict.js');
var constants = require('../../lib/constants.js');
var resolvePath = require('../../lib/sync-path-resolver.js').resolve;

function SyncFileSystem(fs) {
  var self = this;
  var pathToSync;
  var modifiedPath;

  // Manage path resolution for sync path
  Object.defineProperty(self, 'pathToSync', {
    get: function() { return pathToSync; },
    set: function(path) {
      if(path) {
        pathToSync = resolvePath(pathToSync, path);
      } else {
        pathToSync = null;
      }
    }
  });

  // Record modifications to the filesystem during a sync
  Object.defineProperty(fs, 'modifiedPath', {
    get: function() { return modifiedPath; },
    set: function(path) {
      if(path) {
        modifiedPath = resolvePath(modifiedPath, path);
      } else {
        modifiedPath = null;
      }
    }
  });

  // The following non-modifying fs operations can be run as normal,
  // and are simply forwarded to the fs instance. NOTE: we have
  // included setting xattributes since we don't sync these to the server (yet).
  ['stat', 'fstat', 'lstat', 'exists', 'readlink', 'realpath',
   'readdir', 'open', 'close', 'fsync', 'read', 'readFile',
   'setxattr', 'fsetxattr', 'getxattr', 'fgetxattr', 'removexattr',
   'fremovexattr', 'watch'].forEach(function(method) {
     self[method] = function() {
       fs[method].apply(fs, arguments);
     };
  });

  function fsetUnsynced(fd, callback) {
    fsUtils.fsetUnsynced(fs, fd, callback);
  }

  function setUnsynced(path, callback) {
    fsUtils.setUnsynced(fs, path, callback);
  }

  // We wrap all fs methods that modify the filesystem in some way that matters
  // for syncing (i.e., changes we need to sync back to the server), such that we
  // can track things. Different fs methods need to do this in slighly different ways,
  // but the overall logic is the same.  The wrapMethod() fn defines this logic.
  function wrapMethod(method, pathArgPos, setUnsyncedFn, useParentPath) {
    return function() {
      var args = Array.prototype.slice.call(arguments, 0);
      var lastIdx = args.length - 1;
      var callback = args[lastIdx];

      // Grab the path or fd so we can use it to set the xattribute.
      // Most methods take `path` or `fd` as the first arg, but it's
      // second for some.
      var pathOrFD = args[pathArgPos];

      // In most cases we want to use the path itself, but in the case
      // that a node is being removed, we want the parent dir.
      pathOrFD = useParentPath ? Path.dirname(pathOrFD) : pathOrFD;

      // Check to see if it is a path or an open file descriptor
      // TODO: Deal with a case of fs.open for a path with a write flag
      // https://github.com/mozilla/makedrive/issues/210.
      if(!fs.openFiles[pathOrFD]) {
        self.pathToSync = pathOrFD;
        // Record the path that was modified on the fs
        fs.modifiedPath = pathOrFD;
      }

      args[lastIdx] = function wrappedCallback() {
        var args = Array.prototype.slice.call(arguments, 0);
        if(args[0]) {
          return callback(args[0]);
        }

        setUnsyncedFn(pathOrFD, function(err) {
          if(err) {
            return callback(err);
          }
          callback.apply(null, args);
        });
      };

      fs[method].apply(fs, args);
    };
  }

  // Wrapped fs methods that have path at first arg position and use paths
  ['truncate', 'mknod', 'mkdir', 'utimes', 'writeFile',
   'appendFile'].forEach(function(method) {
     self[method] = wrapMethod(method, 0, setUnsynced);
  });

  // Wrapped fs methods that have path at second arg position
  ['link', 'symlink'].forEach(function(method) {
    self[method] = wrapMethod(method, 1, setUnsynced);
  });

  // Wrapped fs methods that have path at second arg position, and need to use the parent path.
  ['rename'].forEach(function(method) {
    self[method] = wrapMethod(method, 1, setUnsynced, true);
  });

  // Wrapped fs methods that use file descriptors
  ['ftruncate', 'futimes', 'write'].forEach(function(method) {
    self[method] = wrapMethod(method, 0, fsetUnsynced);
  });

  // Wrapped fs methods that have path at first arg position and use parent
  // path for writing unsynced metadata (i.e., removes node)
  ['rmdir', 'unlink'].forEach(function(method) {
    self[method] = wrapMethod(method, 0, setUnsynced, true);
  });

  // We also want to do extra work in the case of a rename.
  // If a file is a conflicted copy, and a rename is done,
  // remove the conflict.
  var rename = self.rename;
  self.rename = function(oldPath, newPath, callback) {
    rename(oldPath, newPath, function(err) {
      if(err) {
        return callback(err);
      }

      conflict.isConflictedCopy(fs, newPath, function(err, conflicted) {
        if(err) {
          return callback(err);
        }

        if(conflicted) {
          conflict.removeFileConflict(fs, newPath, callback);
        } else {
          callback();
        }
      });
    });
  };

  // Expose fs.Shell() but use wrapped sync filesystem instance vs fs.
  // This is a bit brittle, but since Filer doesn't expose the Shell()
  // directly, we deal with it by doing a deep require into Filer's code
  // ourselves. The other down side of this is that we're now including
  // the Shell code twice (once in filer.js, once here). We need to
  // optimize this when we look at making MakeDrive smaller.
  self.Shell = function(options) {
    return new Shell(self, options);
  };

  // Expose extra operations for checking whether path/fd is unsynced
  self.getUnsynced = function(path, callback) {
    fsUtils.getUnsynced(fs, path, callback);
  };
  self.fgetUnsynced = function(fd, callback) {
    fsUtils.fgetUnsynced(fs, fd, callback);
  };
}

module.exports = SyncFileSystem;

},{"../../lib/conflict.js":32,"../../lib/constants.js":33,"../../lib/filer-shell.js":35,"../../lib/filer.js":36,"../../lib/fs-utils.js":37,"../../lib/sync-path-resolver.js":44}],28:[function(require,module,exports){
var SyncMessage = require( '../../lib/syncmessage' ),
    messageHandler = require('./message-handler'),
    states = require('./sync-states'),
    steps = require('./sync-steps'),
    WebSocket = require('ws'),
    fsUtils = require('../../lib/fs-utils'),
    async = require('../../lib/async-lite.js'),
    request = require('request'),
    url = require('url');

function SyncManager(sync, fs) {
  var manager = this;

  manager.sync = sync;
  manager.fs = fs;
  manager.session = {
    state: states.CLOSED,
    step: steps.SYNCED,
    path: '/',

    is: Object.create(Object.prototype, {
      // States
      syncing: {
        get: function() { return manager.session.state === states.SYNCING; }
      },
      ready: {
        get: function() { return manager.session.state === states.READY; }
      },
      error: {
        get: function() { return manager.session.state === states.ERROR; }
      },
      closed: {
        get: function() { return manager.session.state === states.CLOSED; }
      },

      // Steps
      init: {
        get: function() { return manager.session.step === steps.INIT; }
      },
      chksum: {
        get: function() { return manager.session.step === steps.CHKSUM; }
      },
      diffs: {
        get: function() { return manager.session.step === steps.DIFFS; }
      },
      patch: {
        get: function() { return manager.session.step === steps.PATCH; }
      },
      synced: {
        get: function() { return manager.session.step === steps.SYNCED; }
      },
      failed: {
        get: function() { return manager.session.step === steps.FAILED; }
      }
    })
  };
}

SyncManager.prototype.init = function(wsUrl, token, options, callback) {
  var manager = this;
  var session = manager.session;
  var sync = manager.sync;
  var reconnectCounter = 0;
  var socket;
  var timeout;

  function handleAuth(event) {
    var data = event.data || event;
    try {
      data = JSON.parse(data);
      data = SyncMessage.parse(data);
    } catch(e) {
      return callback(e);
    }

    if(data.is.response && data.is.authz) {
      session.state = states.READY;
      session.step = steps.SYNCED;

      socket.onmessage = function(event) {
        var data = event.data || event;
        messageHandler(manager, data);
      };
      manager.send(SyncMessage.response.authz.stringify());

      callback();
    } else {
      callback(new Error('Cannot handle message'));
    }
  }

  function handleClose(info) {
    var reason = info.reason || 'WebSocket closed unexpectedly';
    var error = new Error(info.code + ': ' + reason);

    manager.close();
    manager.socket = null;

    sync.onError(error);
    sync.onDisconnected();
  }

  // Reconnecting WebSocket options
  var reconnectAttempts;
  var reconnectionDelay;
  var reconnectionDelayMax;

  if(options.autoReconnect) {
    reconnectAttempts = options.reconnectAttempts ? options.reconnectAttempts : Math.Infinity;
    reconnectionDelay = options.reconnectionDelay ? options.reconnectionDelay : 1000;
    reconnectionDelayMax = options.reconnectionDelayMax ? options.reconnectionDelayMax : 5000;
  }

  function getToken(callback) {
    var apiSyncURL;
    try {
      apiSyncURL = url.parse(wsUrl);
    } catch(err) {
      sync.onError(err);
    }
    apiSyncURL.protocol = apiSyncURL.protocol === 'wss:' ? 'https:' : 'http:';
    apiSyncURL.pathname = "api/sync";
    apiSyncURL = url.format(apiSyncURL);

    request({
      url: apiSyncURL,
      method: 'GET',
      json: true,
      withCredentials: true
    }, function(err, msg, body) {
      var statusCode;
      var error;

      statusCode = msg && msg.statusCode;
      error = statusCode !== 200 ?
        { message: err || 'Unable to get token', code: statusCode } : null;

      if(error) {
        sync.onError(error);
      } else{
        callback(body);
      }
    });
  }

  function connect(reconnecting) {
    clearTimeout(timeout);
    socket = new WebSocket(wsUrl);
    socket.onmessage = handleAuth;
    socket.onopen = function() {
      manager.socket = socket;
      reconnectCounter = 0;
      // We checking for `reconnecting` to see if this is their first time connecting to
      // WebSocket and have provided us with a valid token. Otherwise this is a reconnecting
      // to WebSocket and we will retrieve a new valid token.
      if(!reconnecting && token) {
        manager.send(JSON.stringify({token: token}));
      } else {
        getToken(function(token) {
          manager.send(JSON.stringify({token: token}));
        });
      }
    };
    if(options.autoReconnect) {
      socket.onclose = function() {
        // Clean up after WebSocket closed.
        socket.onclose = function(){};
        socket.close();
        socket = null;
        manager.socket = null;

        // We only want to emit an error once.
        if(reconnectCounter === 0) {
          var error = new Error('WebSocket closed unexpectedly');
          sync.onError(error);
          sync.onDisconnected();
        }

        if(reconnectAttempts < reconnectCounter) {
          sync.emit('reconnect_failed');
        } else {
          var delay = reconnectCounter * reconnectionDelay;
          delay = Math.min(delay, reconnectionDelayMax);
          timeout = setTimeout(function () {
            reconnectCounter++;
            sync.emit('reconnecting');
            connect(true);
          }, delay);
        }
      };
    } else {
      socket.onclose = handleClose;
    }
  }
  connect();
};

SyncManager.prototype.syncPath = function(path) {
  var manager = this;
  var syncRequest;

  if(!manager.socket) {
    throw new Error('sync called before init');
  }

  syncRequest = SyncMessage.request.sync;
  syncRequest.content = {path: path};
  manager.send(syncRequest.stringify());
};

// Remove the unsynced attribute for a list of paths
SyncManager.prototype.resetUnsynced = function(paths, callback) {
  var fs = this.fs;

  function removeUnsyncedAttr(path, callback) {
    fsUtils.removeUnsynced(fs, path, function(err) {
      if(err && err.code !== 'ENOENT') {
        return callback(err);
      }

      callback();
    });
  }

  async.eachSeries(paths, removeUnsyncedAttr, function(err) {
    if(err) {
      return callback(err);
    }

    callback();
  });
};

SyncManager.prototype.close = function() {
  var manager = this;
  var socket = manager.socket;

  if(socket) {
    socket.onmessage = function(){};
    socket.onopen = function(){};

    if(socket.readyState === 1) {
      socket.onclose = function(){
        manager.socket = null;
      };
      socket.close();
    } else {
      manager.socket = null;
    }
  }
};

SyncManager.prototype.send = function(syncMessage) {
  var manager = this;
  var ws = manager.socket;

  if(!ws || ws.readyState !== ws.OPEN) {
    sync.onError(new Error('Socket state invalid for sending'));
  }

  try {
    ws.send(syncMessage);
  } catch(err) {
    // This will also emit an error.
    ws.close();
  }
};

module.exports = SyncManager;

},{"../../lib/async-lite.js":31,"../../lib/fs-utils":37,"../../lib/syncmessage":45,"./message-handler":26,"./sync-states":29,"./sync-steps":30,"request":49,"url":23,"ws":24}],29:[function(require,module,exports){
module.exports = {
  SYNCING: "SYNC IN PROGRESS",
  READY: "READY",
  ERROR: "ERROR",
  CLOSED: "CLOSED"
};
},{}],30:[function(require,module,exports){
module.exports = {
  INIT: "SYNC INITIALIZED",
  CHKSUM: "CHECKSUM",
  DIFFS: "DIFFS",
  PATCH: "PATCH",
  SYNCED: "SYNCED",
  FAILED: "FAILED"
};
},{}],31:[function(require,module,exports){
// We're sharing Filer's same stripped-down version of async, in order to save space.
module.exports = require('../node_modules/filer/lib/async.js');

},{"../node_modules/filer/lib/async.js":50}],32:[function(require,module,exports){
/**
 * Utility functions for working with Conflicted Files.
 */
var Filer = require('./filer.js');
var Path = Filer.Path;
var constants = require('./constants.js');
var fsUtils = require('./fs-utils.js');

// Turn "/index.html" into "/index.html (Conflicted Copy 2014-07-23 12:00:00).html"
function generateConflictedPath(fs, path, callback) {
  var dirname = Path.dirname(path);
  var basename = Path.basename(path);
  var extname = Path.extname(path);

  var now = new Date();
  var dateStamp = now.getFullYear() + '-' +
        now.getMonth() + '-' +
        now.getDay() + ' ' +
        now.getHours() + ':' +
        now.getMinutes() + ':' +
        now.getSeconds();
  var conflictedCopy = ' (Conflicted Copy ' + dateStamp + ')';
  var conflictedPath = Path.join(dirname, basename + conflictedCopy + extname);

  // Copy the file using the conflicted filename. If there is
  // already a conflicted file, replace it with this one.
  fsUtils.forceCopy(fs, path, conflictedPath, function(err) {
    if(err) {
      return callback(err);
    }

    // Send the new path back on the callback
    callback(null, conflictedPath);
  });
}

function filenameContainsConflicted(path) {
  // Look for path to be a conflicted copy, e.g.,
  // /dir/index (Conflicted Copy 2014-07-23 12:00:00).html
  return /\(Conflicted Copy \d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}\)/.test(path);
}

function isConflictedCopy(fs, path, callback) {
  fs.getxattr(path, constants.attributes.conflict, function(err, value) {
    if(err && err.code !== 'ENOATTR') {
      return callback(err);
    }

    callback(null, !!value);
  });
}

function makeConflictedCopy(fs, path, callback) {
  fs.lstat(path, function(err, stats) {
    if(err) {
      return callback(err);
    }

    // If this is a dir, err now
    if(stats.isDirectory()) {
      return callback(new Filer.Errors.EISDIR('conflict not permitted on directory'));
    }

    // Otherwise, copy to a conflicted filename, and mark as makedrive-conflict
    generateConflictedPath(fs, path, function(err, conflictedPath) {
      if(err) {
        return callback(err);
      }
      fs.setxattr(conflictedPath, constants.attributes.conflict, true, function(err) {
        if(err) {
          return callback(err);
        }

        callback(null, conflictedPath);
      });
    });
  });
}

function removeFileConflict(fs, path, callback) {
  fs.removexattr(path, constants.attributes.conflict, function(err) {
    if(err && err.code !== 'ENOATTR') {
      return callback(err);
    }

    callback();
  });
}

module.exports = {
  filenameContainsConflicted: filenameContainsConflicted,
  isConflictedCopy: isConflictedCopy,
  makeConflictedCopy: makeConflictedCopy,
  removeFileConflict: removeFileConflict
};

},{"./constants.js":33,"./filer.js":36,"./fs-utils.js":37}],33:[function(require,module,exports){
module.exports = {
  rsyncDefaults: {
    size: 5,
    time: true,
    recursive: true
  },

  attributes: {
    unsynced: 'makedrive-unsynced',
    conflict: 'makedrive-conflict'
  }
};

},{}],34:[function(require,module,exports){
/**
 * Functions to process lists of Node Diff objects (i.e.,
 * diffs of files, folders). A Node Diff object takes the
 * following form:
 *
 * // Node Diff for a file
 * {
 *   modified: 1404926919696,
 *   path: 'index.html',
 *   diffs: [
 *     {
 *       length: 56,
 *       index: 17,
 *       data: Buffer([...])
 *     },
 *     ...
 *   ]
 * }
 */

 var Buffer = require('./filer.js').Buffer;

function processNodeDiff(nodeDiff, processDataFn) {
  // Check if this is a directory or file, process, and return
  if(nodeDiff.diffs) {
    nodeDiff.diffs = nodeDiff.diffs.map(function(diff) {
      diff.data = processDataFn(diff.data);
      return diff;
    });
  }

  return nodeDiff;
}

function bufferToJSON(data) {
  if(!Buffer.isBuffer(data)) {
    return data;
  }
  var json = data.toJSON();
  // Note: when we're in node.js, json will be the raw array.
  // In browserify it will be {type:'Buffer', data:[...]}
  return json.data || json;
}

function jsonToBuffer(data) {
  return new Buffer(data);
}

function processFn(nodeDiffs, processDataFn) {
  if(!nodeDiffs.length) {
    return nodeDiffs;
  }
  return nodeDiffs.map(function(nodeDiff){
    return processNodeDiff(nodeDiff, processDataFn);
  });
}

module.exports.serialize = function(nodeDiffs) {
  return processFn(nodeDiffs, bufferToJSON);
};

module.exports.deserialize = function(nodeDiffs) {
  return processFn(nodeDiffs, jsonToBuffer);
};

},{"./filer.js":36}],35:[function(require,module,exports){
// Filer doesn't expose the Shell() ctor directly, so provide a shortcut.
// See client/src/sync-filesystem.js
module.exports = require('../node_modules/filer/src/shell/shell.js');

},{"../node_modules/filer/src/shell/shell.js":73}],36:[function(require,module,exports){
module.exports = require('filer');

},{"filer":63}],37:[function(require,module,exports){
/**
 * Extra common fs operations we do throughout MakeDrive.
 */
var constants = require('./constants.js');

// copy oldPath to newPath, deleting newPath if it exists
function forceCopy(fs, oldPath, newPath, callback) {
  fs.unlink(newPath, function(err) {
    if(err && err.code !== 'ENOENT') {
      return callback(err);
    }

    fs.readFile(oldPath, function(err, buf) {
      if(err) {
        return callback(err);
      }

      fs.writeFile(newPath, buf, callback);
    });
  });
}

// See if a given path a) exists, and whether it is marked unsynced.
function isPathUnsynced(fs, path, callback) {
  fs.getxattr(path, constants.attributes.unsynced, function(err, unsynced) {
    // File doesn't exist locally at all
    if(err && err.code === 'ENOENT') {
      return callback(null, false);
    }

    // Deal with unexpected error
    if(err && err.code !== 'ENOATTR') {
      return callback(err);
    }

    callback(null, !!unsynced);
  });
}

// Remove the unsynced metadata from a path
function removeUnsynced(fs, path, callback) {
  fs.removexattr(path, constants.attributes.unsynced, function(err) {
    if(err && err.code !== 'ENOATTR') {
      return callback(err);
    }

    callback();
  });
}
function fremoveUnsynced(fs, fd, callback) {
  fs.fremovexattr(fd, constants.attributes.unsynced, function(err) {
    if(err && err.code !== 'ENOATTR') {
      return callback(err);
    }

    callback();
  });
}

// Set the unsynced metadata for a path
function setUnsynced(fs, path, callback) {
  fs.setxattr(path, constants.attributes.unsynced, Date.now(), function(err) {
    if(err) {
      return callback(err);
    }

    callback();
  });
}
function fsetUnsynced(fs, fd, callback) {
  fs.fsetxattr(fd, constants.attributes.unsynced, Date.now(), function(err) {
    if(err) {
      return callback(err);
    }

    callback();
  });
}

// Get the unsynced metadata for a path
function getUnsynced(fs, path, callback) {
  fs.getxattr(path, constants.attributes.unsynced, function(err, value) {
    if(err && err.code !== 'ENOATTR') {
      return callback(err);
    }

    callback(null, value);
  });
}
function fgetUnsynced(fs, fd, callback) {
  fs.fgetxattr(fd, constants.attributes.unsynced, function(err, value) {
    if(err && err.code !== 'ENOATTR') {
      return callback(err);
    }

    callback(null, value);
  });
}

module.exports = {
  forceCopy: forceCopy,
  isPathUnsynced: isPathUnsynced,
  removeUnsynced: removeUnsynced,
  fremoveUnsynced: fremoveUnsynced,
  setUnsynced: setUnsynced,
  fsetUnsynced: fsetUnsynced,
  getUnsynced: getUnsynced,
  fgetUnsynced: fgetUnsynced
};

},{"./constants.js":33}],38:[function(require,module,exports){
var rsyncUtils = require('./rsync-utils');
var async = require('../async-lite');

// Generate checksums for every source node in a given destination path
module.exports = function checksums(fs, path, srcList, options, callback) {
  callback = rsyncUtils.findCallback(callback, options);

  var paramError = rsyncUtils.validateParams(fs, path);
  if(paramError) {
    return callback(paramError);
  }

  options = rsyncUtils.configureOptions(options);

  var checksumList = [];

  function ChecksumNode(path, type) {
    this.path = path;
    this.type = type;
  }

  function checksumsForFile(checksumNode, sourceNode, callback) {

    function generateChecksumsForFile() {
      rsyncUtils.checksum(fs, sourceNode.path, options.size, function(err, checksums) {
        if(err) {
          return callback(err);
        }

        checksumNode.checksums = checksums;
        checksumNode.modified = sourceNode.modified;
        checksumList.push(checksumNode);
        
        callback();
      });
    }

    // Checksums are always calculated even for identical files
    // if and only if checksums are turned on and rsync is not
    // implemented recursively
    if(options.checksum && !options.recursive) {
      return generateChecksumsForFile();
    }

    // Skip identical files if checksums are turned off or
    // if rsync is performed recursively
    fs.stat(sourceNode.path, function(err, stat) {
      if(err && err.code !== 'ENOENT') {
        return callback(err);
      }

      // Add the 'identical' flag if the modified time and size
      // of the existing file match
      if(stat && stat.mtime === sourceNode.modified && stat.size === sourceNode.size) {
        checksumNode.checksums = [];
        checksumNode.modified = sourceNode.modified;
        checksumNode.identical = true;
        checksumList.push(checksumNode);
        
        return callback();
      }

      generateChecksumsForFile();
    });
  }

  function checksumsForLink(checksumNode, sourceNode, callback) {

    function generateChecksumsForLink() {
      fs.readlink(sourceNode.path, function(err, linkContents) {
        if(err) {
          return callback(err);
        }

        rsyncUtils.checksum(fs, linkContents, options.size, function(err, checksums) {
          if(err) {
            return callback(err);
          }

          checksumNode.checksums = checksums;
          checksumList.push(checksumNode);
          
          callback();
        });
      });
    }

    // Checksums are always calculated even for identical links
    // if and only if checksums are turned on and rsync is not
    // implemented recursively
    if(options.checksum && !options.recursive) {
      checksumList.push(checksumNode);
      
      return callback();
    }

    // Skip identical links if checksums are turned off or
    // if rsync is performed recursively
    fs.stat(sourceNode.path, function(err, stat) {
      if(err && err.code !== 'ENOENT') {
        return callback(err);
      }

      // Add `identical` if the modified time and size of the existing file match
      if(stat && stat.mtime === sourceNode.modified && stat.size === sourceNode.size) {
        checksumNode.identical = true;
        checksumList.push(checksumNode);
        
        return callback();
      } 

      // Link does not exist i.e. no checksums
      if(err && err.code === 'ENOENT') {
        checksumList.push(checksumNode);
        
        return callback();
      }

      // Link exists and is not identical to the source link
      generateChecksumsForLink();
    });
  }

  function checksumsForDir(checksumNode, callback) {
    checksumNode.checksums = [];
    checksumList.push(checksumNode);

    callback();
  }

  function getChecksumsForSourceNode(sourceNode, callback) {
    var sourceNodeType = sourceNode.type;
    var checksumNode = new ChecksumNode(sourceNode.path, sourceNodeType);

    // Directory
    if(sourceNodeType === 'DIRECTORY') {
      return checksumsForDir(checksumNode, callback);
    }

    // Link
    if(sourceNodeType === 'SYMLINK' && options.link){
      checksumNode.link = true;
      
      return checksumsForLink(checksumNode, sourceNode, callback);
    }

    // File or Links treated as files
    checksumsForFile(checksumNode, sourceNode, callback);
  }

  async.eachSeries(srcList, getChecksumsForSourceNode, function(err) {
    if(err) {
      callback(err);
    } else {
      callback(null, checksumList);
    }
  });
};

},{"../async-lite":31,"./rsync-utils":42}],39:[function(require,module,exports){
var Errors = require('../filer').Errors;
var rsyncUtils = require('./rsync-utils');
var async = require('../async-lite');

// Generate diffs from the source based on destination checksums
module.exports = function diff(fs, path, checksumList, options, callback) {
  callback = rsyncUtils.findCallback(callback, options);

  var paramError = rsyncUtils.validateParams(fs, path);
  if(paramError) {
    return callback(paramError);
  }

  options = rsyncUtils.configureOptions(options);

  if(options.checksum && !checksumList) {
    return callback(new Errors.EINVAL('Checksums must be provided'));
  }

  var diffList = [];

  function DiffNode(path, type, modifiedTime) {
    this.path = path;
    this.type = type;
    this.modified = modifiedTime;
  }

  function diffsForLink(checksumNode, callback) {
    var checksumNodePath = checksumNode.path;
    var diffNode = new DiffNode(checksumNodePath, checksumNode.type, checksumNode.modified);

    fs.readlink(checksumNodePath, function(err, linkContents) {
      if(err) {
        return callback(err);
      }

      diffNode.link = linkContents;

      // If links are enabled, contents of the node pointed
      // to by the link are ignored
      if(options.links) {
        diffList.push(diffNode);

        return callback(null, diffList);
      }

      // If links are disabled, diffs are generated for
      // the node pointed to by the link
      fs.readFile(linkContents, function(err, data) {
        if(err) {
          return callback(err);
        }

        diffNode.diffs = rsyncUtils.rollData(data, checksumNode.checksums, options.size);
        diffList.push(diffNode);

        callback(null, diffList);
      });
    });
  }

  function diffsForFile(checksumNode, callback) {
    var checksumNodePath = checksumNode.path;
    var diffNode = new DiffNode(checksumNodePath, checksumNode.type, checksumNode.modified);

    // Identical files have empty diffs
    if(checksumNode.identical) {
      diffNode.diffs = [];
      diffList.push(diffNode);

      return callback(null, diffList);
    }

    fs.readFile(checksumNodePath, function(err, data) {
      if (err) {
        return callback(err);
      }

      diffNode.diffs = rsyncUtils.rollData(data, checksumNode.checksums, options.size);
      diffList.push(diffNode);

      callback(null, diffList);
    });
  }

  function diffsForDir() {

    function processDirContents(checksumNode, callback) {
      var checksumNodePath = checksumNode.path;
      var diffNode = new DiffNode(checksumNodePath, checksumNode.type);

      // Directory
      if(checksumNode.type === 'DIRECTORY') {
        diffNode.diffs = [];
        diffList.push(diffNode);

        return callback();
      }

      // Link
      if (checksumNode.link) {
        return diffsForLink(checksumNode, callback);
      }

      // File
      diffsForFile(checksumNode, callback);
    }

    async.eachSeries(checksumList, processDirContents, function(err) {
      if(err) {
        return callback(err);
      }

      callback(null, diffList);
    });
  }

  fs.lstat(path, function(err, stat) {
    if(err) {
      return callback(err);
    }

    // Directory
    if(stat.isDirectory()) {
      return diffsForDir();
    }

    // If the path was a file, clearly there was only one checksum
    // entry i.e. the length of checksumList will be 1 which will 
    // be stored in checksumList[0]
    var checksumNode = checksumList[0];

    // File
    if(stat.isFile() || !options.links) {
      return diffsForFile(checksumNode, callback);
    }

    // Link
    diffsForLink(checksumNode, callback);
  });
};

},{"../async-lite":31,"../filer":36,"./rsync-utils":42}],40:[function(require,module,exports){
/* index.js
 * Implement rsync to sync between two Filer filesystems
 * Portions used from Node.js Anchor module
 * Copyright(c) 2011 Mihai Tomescu <matomesc@gmail.com>
 * Copyright(c) 2011 Tolga Tezel <tolgatezel11@gmail.com>
 * MIT Licensed
 * https://github.com/ttezel/anchor
*/

module.exports = {
  sourceList: require('./source-list'),
  checksums: require('./checksums'),
  diff: require('./diff'),
  patch: require('./patch'),
  utils: require('./rsync-utils')
};

},{"./checksums":38,"./diff":39,"./patch":41,"./rsync-utils":42,"./source-list":43}],41:[function(require,module,exports){
var fsUtils = require('../fs-utils');
var Filer = require('../filer');
var Buffer = Filer.Buffer;
var Path = Filer.Path;
var async = require('../async-lite');
var conflict = require('../conflict');
var rsyncUtils = require('./rsync-utils');

function extractPathsFromDiffs(diffs) {
  function getPath(diff) {
    return diff.path;
  }

  return diffs.map(getPath);
}

// This function has been taken from lodash
// Licensed under the MIT license
// https://github.com/lodash/lodash
function difference(arr, farr) {
  return arr.filter(function(v) {
    return farr.indexOf(v) === -1;
  });
}

// Path the destination filesystem by applying diffs
module.exports = function patch(fs, path, diffList, options, callback) {
  callback = rsyncUtils.findCallback(callback, options);

  var paths = {
    synced: [],
    failed: []
  };
  var pathsToSync = extractPathsFromDiffs(diffList);

  var paramError = rsyncUtils.validateParams(fs, path);
  if(paramError) {
    return callback(paramError);
  }

  options = rsyncUtils.configureOptions(options);

  // Taken from 

  function handleError(err, callback) {
    // Determine the node paths for those that were not synced
    // by getting the difference between the paths that needed to
    // be synced and the paths that were synced
    var failedPaths = difference(pathsToSync, paths.synced);
    paths.failed = paths.failed.concat(failedPaths);

    callback(err, paths);
  }

  // Remove the nodes in the patched directory that are no longer
  // present in the source. The only exception to this is any file
  // locally that hasn't been synced to the server yet (i.e.,
  // we don't want to delete things in a downstream sync because they
  // don't exist upstream yet, since an upstream sync will add them).
  function removeDeletedNodes(path, callback) {

    function maybeUnlink(pathToDelete, callback) {
      if(pathsToSync.indexOf(pathToDelete) !== -1) {
        return callback();
      }

      // Make sure this file isn't unsynced before deleting
      fsUtils.isPathUnsynced(fs, pathToDelete, function(err, unsynced) {
        if(err) {
          return handleError(err, callback);
        }

        if(unsynced) {
          // Don't delete
          return callback();
        }

        paths.synced.push(pathToDelete);
        fs.unlink(pathToDelete, callback);
      });
    }

    function processRemoval(subPath, callback) {
      var nodePath = Path.join(path, subPath);

      fs.lstat(nodePath, function(err, stats) {
        if(err) {
          return handleError(err, callback);
        }

        if(!stats.isDirectory()) {
          return maybeUnlink(nodePath, callback);
        }

        removeDeletedNodes(nodePath, callback);
      });
    }

    function removeDeletedNodesInDir(dirContents) {
      async.eachSeries(dirContents, processRemoval, function(err) {
        if(err) {
          return handleError(err, callback);
        }

        maybeUnlink(path, function(err) {
          if(err) {
            return handleError(err, callback);
          }

          callback(null, paths); 
        });
      });
    }

    fs.lstat(path, function(err, stats) {
      if(err) {
        return callback(err);
      }

      if(!stats.isDirectory()) {
        return callback(null, paths);
      }

      fs.readdir(path, function(err, dirContents) {
        if(err) {
          return handleError(err, callback);
        }

        removeDeletedNodesInDir(dirContents);
      });
    });
  }

  function maybeGenerateConflicted(nodePath, callback) {
    fsUtils.isPathUnsynced(fs, nodePath, function(err, unsynced) {
      if(err) {
        return handleError(err, callback);
      }

      // Do not generate a conflicted copy for an unsynced file
      if(!unsynced) {
        return callback();
      }

      conflict.makeConflictedCopy(fs, nodePath, function(err) {
        if(err) {
          return handleError(err, callback);
        }

        // Because we'll overwrite the file with upstream changes,
        // remove the unsynced attribute (local changes are in
        // the conflicted copy now).
        fsUtils.removeUnsynced(fs, nodePath, function(err) {
          if(err) {
            return handleError(err, callback);
          }

          callback();
        });
      });
    });
  }

  function patchFile(diffNode, callback) {
    var diffLength = diffNode.diffs ? diffNode.diffs.length : 0;
    var filePath = diffNode.path;

    function updateModifiedTime() {
      fs.utimes(filePath, diffNode.modified, diffNode.modified, function(err) {
        if(err) {
          return handleError(err, callback);
        }

        paths.synced.push(filePath);
        callback(null, paths);
      });
    }

    function applyPatch(data) {
      // Before we alter the local file, make sure we don't
      // need a conflicted copy before proceeding.
      maybeGenerateConflicted(filePath, function(err) {
        if(err) {
          return handleError(err, callback);
        }

        fs.writeFile(filePath, data, function(err) {
          if(err) {
            return handleError(err, callback);
          }

          if(options.time) {
            return updateModifiedTime();
          }

          paths.synced.push(filePath);
          callback(null, paths);
        });
      });
    }

    function getPatchedData(rawData) {
      var blocks = [];
      var block, blockData;

      function getRawFileBlock(offsetIndex) {
        var start = offsetIndex * options.size;
        var end = start + options.size;
        end = end > rawData.length ? rawData.length : end;

        return rawData.slice(start, end);
      }

      // Loop through the diffs and construct a buffer representing
      // the file using a block of data from either the original
      // file itself or from the diff depending on which position
      // the diff needs to be inserted at
      for(var i = 0; i < diffLength; i++) {
        block = diffNode.diffs[i];
        blockData = block.data || getRawFileBlock(block.index);

        blocks.push(blockData);

        if(block.data && block.index) {
          blocks.push(getRawFileBlock(block.index));
        }
      }

      return Buffer.concat(blocks);
    }

    // Nothing to patch
    if(!diffLength) {
      paths.synced.push(filePath);
      return callback(null, paths);
    }

    fs.readFile(filePath, function(err, data) {
      if(err && err.code !== 'ENOENT') {
        return handleError(err, callback);
      }

      applyPatch(getPatchedData(data || new Buffer(0)));
    });
  }

  function patchLink(diffNode, callback) {
    var linkPath = diffNode.path;

    // Patch the symbolic link as a file
    if(!options.links) {
      return patchFile(diffNode, callback);
    }

    fs.symlink(diffNode.link, linkPath, function(err){
      if(err) {
        return handleError(err, callback);
      }

      paths.synced.push(linkPath);
      callback(null, paths);
    });
  }

  function patchDir(diffNode, callback) {
    var dirPath = diffNode.path;

    fs.mkdir(dirPath, function(err) {
      if(err && err.code !== 'EEXIST') {
        return handleError(err, callback);
      }

      paths.synced.push(dirPath);
      callback(null, paths);
    });
  }

  function patchNode(diffNode, callback) {
    // Directory
    if(diffNode.type === 'DIRECTORY') {
      return patchDir(diffNode, callback);
    }

    // Symbolic link
    if(diffNode.type === 'SYMLINK') {
      return patchLink(diffNode, callback);
    }

    // File
    patchFile(diffNode, callback);
  }

  function applyDiffs(diffNode, callback) {
    createParentDirectories(diffNode.path, function(err) {
      if(err) {
        return callback(err);
      }

      patchNode(diffNode, callback);
    });
  }

  function processDiffList() {
    async.eachSeries(diffList, applyDiffs, function(err) {
      if(err) {
        return handleError(err, callback);
      }

      removeDeletedNodes(path, callback);
    });
  }

  // Create any parent directories that do not exist
  function createParentDirectories(path, callback) {
    fs.Shell().mkdirp(Path.dirname(path), function(err) {
      if(err && err.code !== 'EEXIST') {
        return callback(err);
      }

      callback();
    });
  }

  if(diffList && diffList.length) {
    return processDiffList();
  }

  createParentDirectories(path, function(err) {
    if(err && err !== 'EEXIST') {
      return callback(err, paths);
    }

    removeDeletedNodes(path, callback);
  });
};

},{"../async-lite":31,"../conflict":32,"../filer":36,"../fs-utils":37,"./rsync-utils":42}],42:[function(require,module,exports){
/*
 * Rsync utilities that include hashing
 * algorithms necessary for rsync and
 * checksum comparison algorithms to check
 * the equivalency of two file systems
 * as well as general validation functions
 *
 * Portions used from Node.js Anchor module
 * Copyright(c) 2011 Mihai Tomescu <matomesc@gmail.com>
 * Copyright(c) 2011 Tolga Tezel <tolgatezel11@gmail.com>
 * MIT Licensed
 * https://github.com/ttezel/anchor
*/

var MD5 = require('MD5');
var Errors = require('../filer').Errors;
var async = require('../async-lite');
var fsUtils = require('../fs-utils');

// Rsync Options that can be passed are:
// size       -   the size of each chunk of data in bytes that should be checksumed
// checksum   -   true: always calculate checksums [default]
//                false: ignore checksums for identical files
// recursive  -   true: sync each contained node in the path provided
//                false: only sync the node for the path provided [default]
// time       -   true: sync modified times of source/destination files
//                false: do not change modified times of destination files [default]
// links      -   true: sync symbolic links as links in destination
//                false: sync symbolic links as the files they link to in destination [default]
function configureOptions(options) {
  if(!options || typeof options === 'function') {
    options = {};
  }

  options.size = options.size || 512;
  options.checksum = options.checksum !== false;
  options.recursive = options.recursive || false;
  options.time = options.time || false;
  options.links = options.links || false;

  return options;
}

// Set the callback in case options are not provided
function findCallback(callback, options) {
  if(!callback && typeof options === 'function') {
    callback = options;
  }

  return callback;
}

// Validate the parameters sent to each rsync method
function validateParams(fs, param2) {
  var err;

  if(!fs) {
    err = new Errors.EINVAL('No filesystem provided');
  } else if(!param2) {
    err = new Errors.EINVAL('Second argument must be specified');
  }

  return err;
}

// This function has been taken from lodash
// Licensed under the MIT license
// https://github.com/lodash/lodash
function sortObjects(list, prop) {
  return list.sort(function(a,b) {
    a = a[prop];
    b = b[prop];
    return (a === b) ? 0 : (a < b) ? -1 : 1;
  });
}

// MD5 hashing for RSync
function md5sum(data) {
  return MD5(data).toString();
}

// Weak32 hashing for RSync based on Mark Adler's 32bit checksum algorithm
function calcWeak32(data, prev, start, end) {
  var a = 0;
  var b = 0;
  var sum = 0;
  var M = 1 << 16;
  var N = 65521;

  if (!prev) {
    var len = (start >= 0 && end >= 0) ? (end - start + 1) : data.length;
    var datai;
    for (var i = 0; i < len; i++) {
      datai = data[i];
      a += datai;
      b += ((len - i) * datai);
    }

    a %= N;
    b %= N;
  } else {
    var k = start;
    var l = end - 1;
    var prev_k = k - 1;
    var prev_l = l - 1;
    var prev_first = data[prev_k];
    var prev_last = data[prev_l];
    var curr_first = data[k];
    var curr_last = data[l];

    a = (prev.a - prev_first + curr_last) % N;
    b = (prev.b - (prev_l - prev_k + 1) * prev_first + a) % N;
  }
  return { a: a, b: b, sum: a + b * M };
}

// Weak16 hashing for RSync
function calcWeak16(data) {
  return 0xffff & (data >> 16 ^ data * 1009);
}

// RSync algorithm to create a hashtable from checksums
function createHashtable(checksums) {
  var hashtable = {};
  var len = checksums.length;
  var checksum;
  var weak16;

  for (var i = 0; i < len; i++) {
    checksum = checksums[i];
    weak16 = calcWeak16(checksum.weak);
    if (hashtable[weak16]) {
      hashtable[weak16].push(checksum);
    } else {
      hashtable[weak16] = [checksum];
    }
  }
  return hashtable;
}

// RSync algorithm to perform data rolling
function roll(data, checksums, blockSize) {
  var results = [];
  var hashtable = createHashtable(checksums);
  var length = data.length;
  var start = 0;
  var end = blockSize > length ? length : blockSize;
  // Updated when a block matches
  var lastMatchedEnd = 0;
  // This gets updated every iteration with the previous weak 32bit hash
  var prevRollingWeak = null;
  var weak;
  var weak16;
  var match;
  var d;
  var len;
  var mightMatch;
  var chunk;
  var strong;
  var hashtable_weak16;
  var hashtable_weak16i;

  for (; end <= length; start++, end++) {
    weak = calcWeak32(data, prevRollingWeak, start, end);
    weak16 = calcWeak16(weak.sum);
    match = false;
    d = null;
    prevRollingWeak = weak;
    hashtable_weak16 = hashtable[weak16];

    if (hashtable_weak16) {
      len = hashtable_weak16.length;
      for (var i = 0; i < len; i++) {
        hashtable_weak16i = hashtable_weak16[i];
        if (hashtable_weak16i.weak === weak.sum) {
          mightMatch = hashtable_weak16i;
          chunk = data.slice(start, end);
          strong = md5sum(chunk);

          if (mightMatch.strong === strong) {
            match = mightMatch;
            break;
          }
        }
      }
    }
    if (match) {
      if(start < lastMatchedEnd) {
        d = data.slice(lastMatchedEnd - 1, end);
        results.push({
          data: d,
          index: match.index
        });
      } else if (start - lastMatchedEnd > 0) {
        d = data.slice(lastMatchedEnd, start);
        results.push({
          data: d,
          index: match.index
        });
      } else {
        results.push({
          index: match.index
        });
      }
      lastMatchedEnd = end;
    } else if (end === length) {
      // No match and last block
      d = data.slice(lastMatchedEnd);
      results.push({
        data: d
      });
    }
  }
  return results;
}

// RSync function to calculate checksums
function checksum (fs, path, size, callback) {
  var cache = {};

  fs.readFile(path, function (err, data) {
    if (!err) {
      // cache file
      cache[path] = data;
    } else if (err && err.code === 'ENOENT') {
      cache[path] = [];
    } else {
      return callback(err);
    }

    var length = cache[path].length;
    var incr = size;
    var start = 0;
    var end = incr > length ? length : incr;
    var blockIndex = 0;
    var result = [];
    var chunk;
    var weak;
    var strong;

    while (start < length) {
      chunk  = cache[path].slice(start, end);
      weak   = calcWeak32(chunk).sum;
      strong = md5sum(chunk);

      result.push({
        index: blockIndex,
        weak: weak,
        strong: strong
      });
      // update slice indices
      start += incr;
      end = (end + incr) > length ? length : end + incr;
      // update block index
      blockIndex++;
    }

    callback(null, result);
  });
}

// Generate checksums for an array of paths to be used for comparison
function generateChecksums(fs, paths, blockSize, callback) {
  if(!blockSize || typeof callback !== 'function') {
    return callback(new Errors.EINVAL('Insufficient data provided'));
  }

  var paramError = validateParams(fs, paths);
  if(paramError) {
    return callback(paramError);
  }

  var checksums = [];

  function ChecksumNode(path, checksum) {
    this.path = path;
    this.checksum = checksum || [];
  }

  function calcChecksum(path, callback) {
    var checksumNode;

    fs.lstat(path, function(err, stat) {
      if(err) {
        if(err.code !== 'ENOENT') {
          return callback(err);
        }

        checksumNode = new ChecksumNode(path);
        checksums.push(checksumNode);

        return callback();
      }

      // Use contents of directory instead of checksums
      if(stat.isDirectory()) {
        checksumNode = new ChecksumNode(path);
        checksums.push(checksumNode);
        return callback();
      }

      fsUtils.isPathUnsynced(fs, path, function(err, unsynced) {
        if(err) {
          return callback(err);
        }

        if(unsynced) {
          return callback();
        }

        // Calculate checksums for file or symbolic links
        checksum(fs, path, blockSize, function(err, chksum) {
          if(err) {
            return callback(err);
          }

          checksumNode = new ChecksumNode(path, chksum);
          checksums.push(checksumNode);

          callback();
        });
      });
    });
  }

  async.eachSeries(paths, calcChecksum, function(err) {
    if(err) {
      return callback(err);
    }

    callback(null, checksums);
  });
}

// Compare two file systems. This is done by comparing the 
// checksums for a collection of paths in one file system 
// against the checksums for the same those paths in 
// another file system
function compareContents(fs, checksums, blockSize, callback) {
  var EDIFF = 'DIFF';

  if(!blockSize || typeof callback !== 'function') {
    return callback(new Errors.EINVAL('Insufficient data provided'));
  }

  var paramError = validateParams(fs, checksums);
  if(paramError) {
    return callback(paramError);
  }

  // Check if two checksum arrays are equal
  function isEqual(checksumNode1, checksumNode2) {
    var comparisonLength = checksumNode2.length;
    var checksum1, checksum2;

    if(checksumNode1.length !== comparisonLength) {
      return false;
    }

    // Sort the checksum objects in each array by the 'index' property
    checksumNode1 = sortObjects(checksumNode1, 'index');
    checksumNode2 = sortObjects(checksumNode2, 'index');

    // Compare each object's checksums
    for(var i = 0; i < comparisonLength; i++) {
      checksum1 = checksumNode1[i];
      checksum2 = checksumNode2[i];

      if(checksum1.weak !== checksum2.weak ||
        checksum1.strong !== checksum2.strong) {
        return false;
      }
    }

    return true;
  }

  function compare(checksumNode, callback) {
    var path = checksumNode.path;

    fs.lstat(path, function(err, stat) {
      if(err) {
        if(err.code !== 'ENOENT') {
          return callback(err);
        }

        // Checksums for a non-existent path are empty
        if(checksumNode.checksum && !checksumNode.checksum.length) {
          return callback();
        }

        return callback(EDIFF);
      }

      // Directory comparison of contents
      if(stat.isDirectory()) {
        return callback();
      }

      if(!checksumNode.checksum) {
        return callback(EDIFF);
      }

      // Compare checksums for two files/symbolic links
      checksum(fs, path, blockSize, function(err, checksum) {
        if(err) {
          return callback(err);
        }

        if(!isEqual(checksum, checksumNode.checksum)) {
          return callback(EDIFF);
        }

        callback();
      });
    });
  }

  async.eachSeries(checksums, compare, function(err) {
    if(err && err !== EDIFF) {
      return callback(err, false);
    }

    if(err === EDIFF) {
      return callback(null, false);
    }

    callback(null, true);
  });
}

module.exports = {
  checksum: checksum,
  rollData: roll,
  generateChecksums: generateChecksums,
  compareContents: compareContents,
  configureOptions: configureOptions,
  findCallback: findCallback,
  validateParams: validateParams
};

},{"../async-lite":31,"../filer":36,"../fs-utils":37,"MD5":46}],43:[function(require,module,exports){
var Path = require('../filer').Path;
var async = require('../async-lite');
var conflict = require('../conflict');
var rsyncUtils = require('./rsync-utils');

// Generate the list of paths at the source file system
module.exports = function sourceList(fs, path, options, callback) {
  callback = rsyncUtils.findCallback(callback, options);

  var paramError = rsyncUtils.validateParams(fs, path);
  if(paramError) {
    return callback(paramError);
  }

  options = rsyncUtils.configureOptions(options);

  var sources = [];

  function SourceNode(path, stats) {
    this.path = path;
    this.modified = stats.mtime;
    this.size = stats.size;
    this.type = stats.type; 
  }

  // Make sure this isn't a conflicted copy before adding
  // (we don't send these to the server in a sync)
  function addNonConflicted(sourceNode, callback) {
    conflict.isConflictedCopy(fs, sourceNode.path, function(err, conflicted) {
      if(err) {
        return callback(err);
      }

      if(!conflicted) {
        sources.push(sourceNode);
      }

      callback(null, sources);
    });
  }

  function getSrcListForDir(stats) {
    fs.readdir(path, function(err, entries) {
      if(err) {
        return callback(err);
      }

      function processDirContents(contentPath, callback) {
        var sourceNodePath = Path.join(path, contentPath);

        fs.lstat(sourceNodePath, function(err, stats) {
          if(err) {
            return callback(err);
          }

          var sourceNode = new SourceNode(sourceNodePath, stats);

          // File or Link or Non-recursive directory
          if(!options.recursive || !stats.isDirectory()) {
            return addNonConflicted(sourceNode, callback);
          }

          // Directory recursively
          sourceList(fs, sourceNodePath, options, function(err, items) {
            if(err) {
              return callback(err);
            }

            sources = sources.concat(items);
            
            callback();
          });
        });
      }

      // Add the directory to the sources
      sources.push(new SourceNode(path, stats));

      async.eachSeries(entries, processDirContents, function(err) {
        if(err) {
          return callback(err);
        }

        callback(null, sources);
      });
    });
  }

  function getSrcListForFileOrLink(stats) {
    var sourceNode = new SourceNode(path, stats);
    addNonConflicted(sourceNode, callback);
  }

  function getSrcListForPath(path) {
    fs.lstat(path, function(err, stats) {
      if(err) {
        return callback(err);
      }

      // File or Link
      if(!stats.isDirectory()) {
        return getSrcListForFileOrLink(stats);
      }

      // Directory
      getSrcListForDir(stats);
    });
  }

  getSrcListForPath(path);
};

},{"../async-lite":31,"../conflict":32,"../filer":36,"./rsync-utils":42}],44:[function(require,module,exports){
/**
 * Sync path resolver is a library that provides
 * functionality to determine 'syncable' paths
 * It exposes the following method:
 *
 * resolve      - This method takes two paths as arguments.
 *                The goal is to find the most common ancestor
 *                between them. For e.g. the most common ancestor
 *                between '/dir' and '/dir/file.txt' is '/dir' while
 *                between '/dir' and '/file.txt' would be '/'.
 *
*/

var pathResolver = {};
var dirname = require('./filer').Path.dirname;

function getDepth(path) {
  if(path === '/') {
    return 0;
  }

  return 1 + getDepth(dirname(path));
}

function commonAncestor(path1, depth1, path2, depth2) {
  if(path1 === path2) {
    return path1;
  }

  // Regress the appropriate path
  if(depth1 === depth2) {
    path1 = dirname(path1);
    depth1--;
    path2 = dirname(path2);
    depth2--;
  } else if(depth1 > depth2) {
    path1 = dirname(path1);
    depth1--;
  } else {
    path2 = dirname(path2);
    depth2--;
  }

  return commonAncestor(path1, depth1, path2, depth2);
}

pathResolver.resolve = function(path1, path2) {
  if(!path1 && !path2) {
    return '/';
  }

  if(!path1 || !path2) {
    return path1 || path2;
  }

  var path1Depth = getDepth(path1);
  var path2Depth = getDepth(path2);

  return commonAncestor(path1, path1Depth, path2, path2Depth);
};

module.exports = pathResolver;

},{"./filer":36}],45:[function(require,module,exports){
// Constructor
function SyncMessage(type, name, content) {
  if(!isValidType(type)) {
    throw "Invalid type";
  }
  if(!isValidName(name)) {
    throw "Invalid name";
  }

  this.type = type;
  this.name = name;
  this.content = content || null;

  // Sugar for testing instance data
  var that = this;
  this.is = {
    // Types
    get request() {
      return that.type === SyncMessage.REQUEST;
    },
    get response() {
      return that.type === SyncMessage.RESPONSE;
    },
    get error() {
      return that.type === SyncMessage.ERROR;
    },

    // Names
    get srclist() {
      return that.name === SyncMessage.SRCLIST;
    },
    get sync() {
      return that.name === SyncMessage.SYNC;
    },
    get chksum() {
      return that.name === SyncMessage.CHKSUM;
    },
    get diffs() {
      return that.name === SyncMessage.DIFFS;
    },
    get patch() {
      return that.name === SyncMessage.PATCH;
    },
    get verification() {
      return that.name === SyncMessage.VERIFICATION;
    },
    get reset() {
      return that.name === SyncMessage.RESET;
    },
    get locked() {
      return that.name === SyncMessage.LOCKED;
    },
    get authz() {
      return that.name === SyncMessage.AUTHZ;
    },
    get impl() {
      return that.name === SyncMessage.IMPL;
    },
    get serverReset() {
      return that.name === SyncMessage.SERVER_RESET;
    },
    get downstreamLocked() {
      return that.name === SyncMessage.DOWNSTREAM_LOCKED;
    }
  };
}

SyncMessage.prototype.stringify = function() {
  return JSON.stringify({
    type: this.type,
    name: this.name,
    content: this.content
  });
};

// Try to parse data back into a SyncMessage object. If the
// data is invalid, return a format error message instead.
SyncMessage.parse = function(data) {
  if(!data || !isValidType(data.type) || !isValidName(data.name)) {
    return SyncMessage.error.format;
  }

  return new SyncMessage(data.type, data.name, data.content);
};

// SyncMessage Type constants
SyncMessage.REQUEST = "REQUEST";
SyncMessage.RESPONSE = "RESPONSE";
SyncMessage.ERROR = "ERROR";

// SyncMessage Name constants
SyncMessage.SRCLIST = "SRCLIST";
SyncMessage.SYNC = "SYNC";
SyncMessage.CHKSUM = "CHKSUM";
SyncMessage.DIFFS = "DIFFS";
SyncMessage.PATCH = "PATCH";
SyncMessage.VERIFICATION = "VERIFICATION";
SyncMessage.RESET = "RESET";
SyncMessage.LOCKED = "LOCKED";
SyncMessage.AUTHZ = "AUTHORIZED";
SyncMessage.IMPL = "IMPLEMENTATION";
SyncMessage.SERVER_RESET = "SERVER_RESET";
SyncMessage.DOWNSTREAM_LOCKED = "DOWNSTREAM_LOCKED";

// SyncMessage Error constants
SyncMessage.INFRMT = "INVALID FORMAT";
SyncMessage.INCONT = "INVALID CONTENT";

function isValidName(name) {
  return name === SyncMessage.SRCLIST      ||
         name === SyncMessage.CHKSUM       ||
         name === SyncMessage.DIFFS        ||
         name === SyncMessage.LOCKED       ||
         name === SyncMessage.PATCH        ||
         name === SyncMessage.VERIFICATION ||
         name === SyncMessage.SYNC         ||
         name === SyncMessage.RESET        ||
         name === SyncMessage.AUTHZ        ||
         name === SyncMessage.IMPL         ||
         name === SyncMessage.INFRMT       ||
         name === SyncMessage.INCONT       ||
         name === SyncMessage.SERVER_RESET ||
         name === SyncMessage.DOWNSTREAM_LOCKED;
}

function isValidType(type) {
  return type === SyncMessage.REQUEST  ||
         type === SyncMessage.RESPONSE ||
         type === SyncMessage.ERROR;
}

// Sugar for getting message instances
SyncMessage.request = {
  get diffs() {
    return new SyncMessage(SyncMessage.REQUEST, SyncMessage.DIFFS);
  },
  get chksum() {
    return new SyncMessage(SyncMessage.REQUEST, SyncMessage.CHKSUM);
  },
  get sync() {
    return new SyncMessage(SyncMessage.REQUEST, SyncMessage.SYNC);
  },
  get reset() {
    return new SyncMessage(SyncMessage.REQUEST, SyncMessage.RESET);
  }
};
SyncMessage.response = {
  get diffs() {
    return new SyncMessage(SyncMessage.RESPONSE, SyncMessage.DIFFS);
  },
  get patch() {
    return new SyncMessage(SyncMessage.RESPONSE, SyncMessage.PATCH);
  },
  get verification() {
    return new SyncMessage(SyncMessage.RESPONSE, SyncMessage.VERIFICATION);
  },
  get authz() {
    return new SyncMessage(SyncMessage.RESPONSE, SyncMessage.AUTHZ);
  },
  get sync() {
    return new SyncMessage(SyncMessage.RESPONSE, SyncMessage.SYNC);
  },
  get reset() {
    return new SyncMessage(SyncMessage.RESPONSE, SyncMessage.RESET);
  }
};
SyncMessage.error = {
  get srclist() {
    return new SyncMessage(SyncMessage.ERROR, SyncMessage.SRCLIST);
  },
  get diffs() {
    return new SyncMessage(SyncMessage.ERROR, SyncMessage.DIFFS);
  },
  get locked() {
    return new SyncMessage(SyncMessage.ERROR, SyncMessage.LOCKED);
  },
  get chksum() {
    return new SyncMessage(SyncMessage.ERROR, SyncMessage.CHKSUM);
  },
  get patch() {
    return new SyncMessage(SyncMessage.ERROR, SyncMessage.PATCH);
  },
  get impl() {
    return new SyncMessage(SyncMessage.ERROR, SyncMessage.IMPL);
  },
  get serverReset() {
    return new SyncMessage(SyncMessage.ERROR, SyncMessage.SERVER_RESET);
  },
  get downstreamLocked() {
    return new SyncMessage(SyncMessage.ERROR, SyncMessage.DOWNSTREAM_LOCKED, 'Downstream syncs are locked!');
  },
  get verification() {
    return new SyncMessage(SyncMessage.ERROR,
                           SyncMessage.VERIFICATION,
                           'Patch could not be verified');
  },
  get format() {
    return new SyncMessage(SyncMessage.ERROR,
                           SyncMessage.INFRMT,
                           'Message must be formatted as a sync message');
  },
  get content() {
    return new SyncMessage(SyncMessage.ERROR,
                           SyncMessage.INCONT,
                           'Invalid content provided');
  }
};

module.exports = SyncMessage;

},{}],46:[function(require,module,exports){
(function (Buffer){
(function(){
  var crypt = require('crypt'),
      utf8 = require('charenc').utf8,
      bin = require('charenc').bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (typeof Buffer != 'undefined' &&
        typeof Buffer.isBuffer == 'function' && Buffer.isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if(typeof message == 'undefined')
      return;

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();

}).call(this,require("buffer").Buffer)
},{"buffer":18,"charenc":47,"crypt":48}],47:[function(require,module,exports){
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;

},{}],48:[function(require,module,exports){
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();

},{}],49:[function(require,module,exports){
(function (Buffer){
// Browser Request
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var XHR = XMLHttpRequest
if (!XHR) throw new Error('missing XMLHttpRequest')
request.log = {
  'trace': noop, 'debug': noop, 'info': noop, 'warn': noop, 'error': noop
}

var DEFAULT_TIMEOUT = 3 * 60 * 1000 // 3 minutes

//
// request
//

function request(options, callback) {
  // The entry-point to the API: prep the options object and pass the real work to run_xhr.
  if(typeof callback !== 'function')
    throw new Error('Bad callback given: ' + callback)

  if(!options)
    throw new Error('No options given')

  var options_onResponse = options.onResponse; // Save this for later.

  if(typeof options === 'string')
    options = {'uri':options};
  else
    options = JSON.parse(JSON.stringify(options)); // Use a duplicate for mutating.

  options.onResponse = options_onResponse // And put it back.

  if (options.verbose) request.log = getLogger();

  if(options.url) {
    options.uri = options.url;
    delete options.url;
  }

  if(!options.uri && options.uri !== "")
    throw new Error("options.uri is a required argument");

  if(typeof options.uri != "string")
    throw new Error("options.uri must be a string");

  var unsupported_options = ['proxy', '_redirectsFollowed', 'maxRedirects', 'followRedirect']
  for (var i = 0; i < unsupported_options.length; i++)
    if(options[ unsupported_options[i] ])
      throw new Error("options." + unsupported_options[i] + " is not supported")

  options.callback = callback
  options.method = options.method || 'GET';
  options.headers = options.headers || {};
  options.body    = options.body || null
  options.timeout = options.timeout || request.DEFAULT_TIMEOUT

  if(options.headers.host)
    throw new Error("Options.headers.host is not supported");

  if(options.json) {
    options.headers.accept = options.headers.accept || 'application/json'
    if(options.method !== 'GET')
      options.headers['content-type'] = 'application/json'

    if(typeof options.json !== 'boolean')
      options.body = JSON.stringify(options.json)
    else if(typeof options.body !== 'string')
      options.body = JSON.stringify(options.body)
  }
  
  //BEGIN QS Hack
  var serialize = function(obj) {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  
  if(options.qs){
    var qs = (typeof options.qs == 'string')? options.qs : serialize(options.qs);
    if(options.uri.indexOf('?') !== -1){ //no get params
        options.uri = options.uri+'&'+qs;
    }else{ //existing get params
        options.uri = options.uri+'?'+qs;
    }
  }
  //END QS Hack
  
  //BEGIN FORM Hack
  var multipart = function(obj) {
    //todo: support file type (useful?)
    var result = {};
    result.boundry = '-------------------------------'+Math.floor(Math.random()*1000000000);
    var lines = [];
    for(var p in obj){
        if (obj.hasOwnProperty(p)) {
            lines.push(
                '--'+result.boundry+"\n"+
                'Content-Disposition: form-data; name="'+p+'"'+"\n"+
                "\n"+
                obj[p]+"\n"
            );
        }
    }
    lines.push( '--'+result.boundry+'--' );
    result.body = lines.join('');
    result.length = result.body.length;
    result.type = 'multipart/form-data; boundary='+result.boundry;
    return result;
  }
  
  if(options.form){
    if(typeof options.form == 'string') throw('form name unsupported');
    if(options.method === 'POST'){
        var encoding = (options.encoding || 'application/x-www-form-urlencoded').toLowerCase();
        options.headers['content-type'] = encoding;
        switch(encoding){
            case 'application/x-www-form-urlencoded':
                options.body = serialize(options.form).replace(/%20/g, "+");
                break;
            case 'multipart/form-data':
                var multi = multipart(options.form);
                //options.headers['content-length'] = multi.length;
                options.body = multi.body;
                options.headers['content-type'] = multi.type;
                break;
            default : throw new Error('unsupported encoding:'+encoding);
        }
    }
  }
  //END FORM Hack

  // If onResponse is boolean true, call back immediately when the response is known,
  // not when the full request is complete.
  options.onResponse = options.onResponse || noop
  if(options.onResponse === true) {
    options.onResponse = callback
    options.callback = noop
  }

  // XXX Browsers do not like this.
  //if(options.body)
  //  options.headers['content-length'] = options.body.length;

  // HTTP basic authentication
  if(!options.headers.authorization && options.auth)
    options.headers.authorization = 'Basic ' + b64_enc(options.auth.username + ':' + options.auth.password);

  return run_xhr(options)
}

var req_seq = 0
function run_xhr(options) {
  var xhr = new XHR
    , timed_out = false
    , is_cors = is_crossDomain(options.uri)
    , supports_cors = ('withCredentials' in xhr)

  req_seq += 1
  xhr.seq_id = req_seq
  xhr.id = req_seq + ': ' + options.method + ' ' + options.uri
  xhr._id = xhr.id // I know I will type "_id" from habit all the time.

  if(is_cors && !supports_cors) {
    var cors_err = new Error('Browser does not support cross-origin request: ' + options.uri)
    cors_err.cors = 'unsupported'
    return options.callback(cors_err, xhr)
  }

  xhr.timeoutTimer = setTimeout(too_late, options.timeout)
  function too_late() {
    timed_out = true
    var er = new Error('ETIMEDOUT')
    er.code = 'ETIMEDOUT'
    er.duration = options.timeout

    request.log.error('Timeout', { 'id':xhr._id, 'milliseconds':options.timeout })
    return options.callback(er, xhr)
  }

  // Some states can be skipped over, so remember what is still incomplete.
  var did = {'response':false, 'loading':false, 'end':false}

  xhr.onreadystatechange = on_state_change
  xhr.open(options.method, options.uri, true) // asynchronous
  // Deal with requests for raw buffer response
  if(options.encoding === null) {
    xhr.responseType = 'arraybuffer';
  }
  if(is_cors)
    xhr.withCredentials = !! options.withCredentials
  xhr.send(options.body)
  return xhr

  function on_state_change(event) {
    if(timed_out)
      return request.log.debug('Ignoring timed out state change', {'state':xhr.readyState, 'id':xhr.id})

    request.log.debug('State change', {'state':xhr.readyState, 'id':xhr.id, 'timed_out':timed_out})

    if(xhr.readyState === XHR.OPENED) {
      request.log.debug('Request started', {'id':xhr.id})
      for (var key in options.headers)
        xhr.setRequestHeader(key, options.headers[key])
    }

    else if(xhr.readyState === XHR.HEADERS_RECEIVED)
      on_response()

    else if(xhr.readyState === XHR.LOADING) {
      on_response()
      on_loading()
    }

    else if(xhr.readyState === XHR.DONE) {
      on_response()
      on_loading()
      on_end()
    }
  }

  function on_response() {
    if(did.response)
      return

    did.response = true
    request.log.debug('Got response', {'id':xhr.id, 'status':xhr.status})
    clearTimeout(xhr.timeoutTimer)
    xhr.statusCode = xhr.status // Node request compatibility

    // Detect failed CORS requests.
    if(is_cors && xhr.statusCode == 0) {
      var cors_err = new Error('CORS request rejected: ' + options.uri)
      cors_err.cors = 'rejected'

      // Do not process this request further.
      did.loading = true
      did.end = true

      return options.callback(cors_err, xhr)
    }

    options.onResponse(null, xhr)
  }

  function on_loading() {
    if(did.loading)
      return

    did.loading = true
    request.log.debug('Response body loading', {'id':xhr.id})
    // TODO: Maybe simulate "data" events by watching xhr.responseText
  }

  function on_end() {
    if(did.end)
      return

    did.end = true
    request.log.debug('Request done', {'id':xhr.id})

    if(options.encoding === null) {
      xhr.body = new Buffer(new Uint8Array(xhr.response));
    } else {
      xhr.body = xhr.responseText
      if(options.json) {
        try        { xhr.body = JSON.parse(xhr.responseText) }
        catch (er) { return options.callback(er, xhr)        }
      }
    }

    options.callback(null, xhr, xhr.body)
  }

} // request

request.withCredentials = false;
request.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

//
// defaults
//

request.defaults = function(options, requester) {
  var def = function (method) {
    var d = function (params, callback) {
      if(typeof params === 'string')
        params = {'uri': params};
      else {
        params = JSON.parse(JSON.stringify(params));
      }
      for (var i in options) {
        if (params[i] === undefined) params[i] = options[i]
      }
      return method(params, callback)
    }
    return d
  }
  var de = def(request)
  de.get = def(request.get)
  de.post = def(request.post)
  de.put = def(request.put)
  de.head = def(request.head)
  return de
}

//
// HTTP method shortcuts
//

var shortcuts = [ 'get', 'put', 'post', 'head' ];
shortcuts.forEach(function(shortcut) {
  var method = shortcut.toUpperCase();
  var func   = shortcut.toLowerCase();

  request[func] = function(opts) {
    if(typeof opts === 'string')
      opts = {'method':method, 'uri':opts};
    else {
      opts = JSON.parse(JSON.stringify(opts));
      opts.method = method;
    }

    var args = [opts].concat(Array.prototype.slice.apply(arguments, [1]));
    return request.apply(this, args);
  }
})

//
// CouchDB shortcut
//

request.couch = function(options, callback) {
  if(typeof options === 'string')
    options = {'uri':options}

  // Just use the request API to do JSON.
  options.json = true
  if(options.body)
    options.json = options.body
  delete options.body

  callback = callback || noop

  var xhr = request(options, couch_handler)
  return xhr

  function couch_handler(er, resp, body) {
    if(er)
      return callback(er, resp, body)

    if((resp.statusCode < 200 || resp.statusCode > 299) && body.error) {
      // The body is a Couch JSON object indicating the error.
      er = new Error('CouchDB error: ' + (body.error.reason || body.error.error))
      for (var key in body)
        er[key] = body[key]
      return callback(er, resp, body);
    }

    return callback(er, resp, body);
  }
}

//
// Utility
//

function noop() {}

function getLogger() {
  var logger = {}
    , levels = ['trace', 'debug', 'info', 'warn', 'error']
    , level, i

  for(i = 0; i < levels.length; i++) {
    level = levels[i]

    logger[level] = noop
    if(typeof console !== 'undefined' && console && console[level])
      logger[level] = formatted(console, level)
  }

  return logger
}

function formatted(obj, method) {
  return formatted_logger

  function formatted_logger(str, context) {
    if(typeof context === 'object')
      str += ' ' + JSON.stringify(context)

    return obj[method].call(obj, str)
  }
}

// Return whether a URL is a cross-domain request.
function is_crossDomain(url) {
  var rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/

  // jQuery #8138, IE may throw an exception when accessing
  // a field from window.location if document.domain has been set
  var ajaxLocation
  try { ajaxLocation = location.href }
  catch (e) {
    // Use the href attribute of an A element since IE will modify it given document.location
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
  }

  var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
    , parts = rurl.exec(url.toLowerCase() )

  var result = !!(
    parts &&
    (  parts[1] != ajaxLocParts[1]
    || parts[2] != ajaxLocParts[2]
    || (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443))
    )
  )

  //console.debug('is_crossDomain('+url+') -> ' + result)
  return result
}

// MIT License from http://phpjs.org/functions/base64_encode:358
function b64_enc (data) {
    // Encodes string using MIME base64 algorithm
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];

    if (!data) {
        return data;
    }

    // assume utf8 data
    // data = this.utf8_encode(data+'');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1<<16 | o2<<8 | o3;

        h1 = bits>>18 & 0x3f;
        h2 = bits>>12 & 0x3f;
        h3 = bits>>6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
        break;
        case 2:
            enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
}
module.exports = request;

}).call(this,require("buffer").Buffer)
},{"buffer":18}],50:[function(require,module,exports){
(function (process){
/*global setImmediate: false, setTimeout: false, console: false */

/**
 * async.js shim, based on https://raw.github.com/caolan/async/master/lib/async.js Feb 18, 2014
 * Used under MIT - https://github.com/caolan/async/blob/master/LICENSE
 */

(function () {

    var async = {};

    // async.js functions used in Filer

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require("1YiZ5S"))
},{"1YiZ5S":22}],51:[function(require,module,exports){
// Based on https://github.com/diy/intercom.js/blob/master/lib/events.js
// Copyright 2012 DIY Co Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

function removeItem(item, array) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] === item) {
      array.splice(i, 1);
    }
  }
  return array;
}

var EventEmitter = function() {};

EventEmitter.createInterface = function(space) {
  var methods = {};

  methods.on = function(name, fn) {
    if (typeof this[space] === 'undefined') {
      this[space] = {};
    }
    if (!this[space].hasOwnProperty(name)) {
      this[space][name] = [];
    }
    this[space][name].push(fn);
  };

  methods.off = function(name, fn) {
    if (typeof this[space] === 'undefined') return;
    if (this[space].hasOwnProperty(name)) {
      removeItem(fn, this[space][name]);
    }
  };

  methods.trigger = function(name) {
    if (typeof this[space] !== 'undefined' && this[space].hasOwnProperty(name)) {
      var args = Array.prototype.slice.call(arguments, 1);
      for (var i = 0; i < this[space][name].length; i++) {
        this[space][name][i].apply(this[space][name][i], args);
      }
    }
  };

  methods.removeAllListeners = function(name) {
    if (typeof this[space] === 'undefined') return;
    var self = this;
    self[space][name].forEach(function(fn) {
      self.off(name, fn);
    });
  };

  return methods;
};

var pvt = EventEmitter.createInterface('_handlers');
EventEmitter.prototype._on = pvt.on;
EventEmitter.prototype._off = pvt.off;
EventEmitter.prototype._trigger = pvt.trigger;

var pub = EventEmitter.createInterface('handlers');
EventEmitter.prototype.on = function() {
  pub.on.apply(this, arguments);
  Array.prototype.unshift.call(arguments, 'on');
  this._trigger.apply(this, arguments);
};
EventEmitter.prototype.off = pub.off;
EventEmitter.prototype.trigger = pub.trigger;
EventEmitter.prototype.removeAllListeners = pub.removeAllListeners;

module.exports = EventEmitter;

},{}],52:[function(require,module,exports){
(function (global){
// Based on https://github.com/diy/intercom.js/blob/master/lib/intercom.js
// Copyright 2012 DIY Co Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var EventEmitter = require('./eventemitter.js');
var guid = require('../src/shared.js').guid;

function throttle(delay, fn) {
  var last = 0;
  return function() {
    var now = Date.now();
    if (now - last > delay) {
      last = now;
      fn.apply(this, arguments);
    }
  };
}

function extend(a, b) {
  if (typeof a === 'undefined' || !a) { a = {}; }
  if (typeof b === 'object') {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
  }
  return a;
}

var localStorage = (function(window) {
  if (typeof window === 'undefined' ||
      typeof window.localStorage === 'undefined') {
    return {
      getItem : function() {},
      setItem : function() {},
      removeItem : function() {}
    };
  }
  return window.localStorage;
}(global));

function Intercom() {
  var self = this;
  var now = Date.now();

  this.origin         = guid();
  this.lastMessage    = now;
  this.receivedIDs    = {};
  this.previousValues = {};

  var storageHandler = function() {
    self._onStorageEvent.apply(self, arguments);
  };

  // If we're in node.js, skip event registration
  if (typeof document === 'undefined') {
    return;
  }

  if (document.attachEvent) {
    document.attachEvent('onstorage', storageHandler);
  } else {
    global.addEventListener('storage', storageHandler, false);
  }
}

Intercom.prototype._transaction = function(fn) {
  var TIMEOUT   = 1000;
  var WAIT      = 20;
  var self      = this;
  var executed  = false;
  var listening = false;
  var waitTimer = null;

  function lock() {
    if (executed) {
      return;
    }

    var now = Date.now();
    var activeLock = localStorage.getItem(INDEX_LOCK)|0;
    if (activeLock && now - activeLock < TIMEOUT) {
      if (!listening) {
        self._on('storage', lock);
        listening = true;
      }
      waitTimer = setTimeout(lock, WAIT);
      return;
    }
    executed = true;
    localStorage.setItem(INDEX_LOCK, now);

    fn();
    unlock();
  }

  function unlock() {
    if (listening) {
      self._off('storage', lock);
    }
    if (waitTimer) {
      clearTimeout(waitTimer);
    }
    localStorage.removeItem(INDEX_LOCK);
  }

  lock();
};

Intercom.prototype._cleanup_emit = throttle(100, function() {
  var self = this;

  self._transaction(function() {
    var now = Date.now();
    var threshold = now - THRESHOLD_TTL_EMIT;
    var changed = 0;
    var messages;

    try {
      messages = JSON.parse(localStorage.getItem(INDEX_EMIT) || '[]');
    } catch(e) {
      messages = [];
    }
    for (var i = messages.length - 1; i >= 0; i--) {
      if (messages[i].timestamp < threshold) {
        messages.splice(i, 1);
        changed++;
      }
    }
    if (changed > 0) {
      localStorage.setItem(INDEX_EMIT, JSON.stringify(messages));
    }
  });
});

Intercom.prototype._cleanup_once = throttle(100, function() {
  var self = this;

  self._transaction(function() {
    var timestamp, ttl, key;
    var table;
    var now  = Date.now();
    var changed = 0;

    try {
      table = JSON.parse(localStorage.getItem(INDEX_ONCE) || '{}');
    } catch(e) {
      table = {};
    }
    for (key in table) {
      if (self._once_expired(key, table)) {
        delete table[key];
        changed++;
      }
    }

    if (changed > 0) {
      localStorage.setItem(INDEX_ONCE, JSON.stringify(table));
    }
  });
});

Intercom.prototype._once_expired = function(key, table) {
  if (!table) {
    return true;
  }
  if (!table.hasOwnProperty(key)) {
    return true;
  }
  if (typeof table[key] !== 'object') {
    return true;
  }

  var ttl = table[key].ttl || THRESHOLD_TTL_ONCE;
  var now = Date.now();
  var timestamp = table[key].timestamp;
  return timestamp < now - ttl;
};

Intercom.prototype._localStorageChanged = function(event, field) {
  if (event && event.key) {
    return event.key === field;
  }

  var currentValue = localStorage.getItem(field);
  if (currentValue === this.previousValues[field]) {
    return false;
  }
  this.previousValues[field] = currentValue;
  return true;
};

Intercom.prototype._onStorageEvent = function(event) {
  event = event || global.event;
  var self = this;

  if (this._localStorageChanged(event, INDEX_EMIT)) {
    this._transaction(function() {
      var now = Date.now();
      var data = localStorage.getItem(INDEX_EMIT);
      var messages;

      try {
        messages = JSON.parse(data || '[]');
      } catch(e) {
        messages = [];
      }
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].origin === self.origin) continue;
        if (messages[i].timestamp < self.lastMessage) continue;
        if (messages[i].id) {
          if (self.receivedIDs.hasOwnProperty(messages[i].id)) continue;
          self.receivedIDs[messages[i].id] = true;
        }
        self.trigger(messages[i].name, messages[i].payload);
      }
      self.lastMessage = now;
    });
  }

  this._trigger('storage', event);
};

Intercom.prototype._emit = function(name, message, id) {
  id = (typeof id === 'string' || typeof id === 'number') ? String(id) : null;
  if (id && id.length) {
    if (this.receivedIDs.hasOwnProperty(id)) return;
    this.receivedIDs[id] = true;
  }

  var packet = {
    id        : id,
    name      : name,
    origin    : this.origin,
    timestamp : Date.now(),
    payload   : message
  };

  var self = this;
  this._transaction(function() {
    var data = localStorage.getItem(INDEX_EMIT) || '[]';
    var delimiter = (data === '[]') ? '' : ',';
    data = [data.substring(0, data.length - 1), delimiter, JSON.stringify(packet), ']'].join('');
    localStorage.setItem(INDEX_EMIT, data);
    self.trigger(name, message);

    setTimeout(function() {
      self._cleanup_emit();
    }, 50);
  });
};

Intercom.prototype.emit = function(name, message) {
  this._emit.apply(this, arguments);
  this._trigger('emit', name, message);
};

Intercom.prototype.once = function(key, fn, ttl) {
  if (!Intercom.supported) {
    return;
  }

  var self = this;
  this._transaction(function() {
    var data;
    try {
      data = JSON.parse(localStorage.getItem(INDEX_ONCE) || '{}');
    } catch(e) {
      data = {};
    }
    if (!self._once_expired(key, data)) {
      return;
    }

    data[key] = {};
    data[key].timestamp = Date.now();
    if (typeof ttl === 'number') {
      data[key].ttl = ttl * 1000;
    }

    localStorage.setItem(INDEX_ONCE, JSON.stringify(data));
    fn();

    setTimeout(function() {
      self._cleanup_once();
    }, 50);
  });
};

extend(Intercom.prototype, EventEmitter.prototype);

Intercom.supported = (typeof localStorage !== 'undefined');

var INDEX_EMIT = 'intercom';
var INDEX_ONCE = 'intercom_once';
var INDEX_LOCK = 'intercom_lock';

var THRESHOLD_TTL_EMIT = 50000;
var THRESHOLD_TTL_ONCE = 1000 * 3600;

Intercom.destroy = function() {
  localStorage.removeItem(INDEX_LOCK);
  localStorage.removeItem(INDEX_EMIT);
  localStorage.removeItem(INDEX_ONCE);
};

Intercom.getInstance = (function() {
  var intercom;
  return function() {
    if (!intercom) {
      intercom = new Intercom();
    }
    return intercom;
  };
})();

module.exports = Intercom;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/shared.js":71,"./eventemitter.js":51}],53:[function(require,module,exports){
// Cherry-picked bits of underscore.js, lodash.js

/**
 * Lo-Dash 2.4.0 <http://lodash.com/>
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var ArrayProto = Array.prototype;
var nativeForEach = ArrayProto.forEach;
var nativeIndexOf = ArrayProto.indexOf;
var nativeSome = ArrayProto.some;

var ObjProto = Object.prototype;
var hasOwnProperty = ObjProto.hasOwnProperty;
var nativeKeys = Object.keys;

var breaker = {};

function has(obj, key) {
  return hasOwnProperty.call(obj, key);
}

var keys = nativeKeys || function(obj) {
  if (obj !== Object(obj)) throw new TypeError('Invalid object');
  var keys = [];
  for (var key in obj) if (has(obj, key)) keys.push(key);
  return keys;
};

function size(obj) {
  if (obj == null) return 0;
  return (obj.length === +obj.length) ? obj.length : keys(obj).length;
}

function identity(value) {
  return value;
}

function each(obj, iterator, context) {
  var i, length;
  if (obj == null) return;
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (i = 0, length = obj.length; i < length; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker) return;
    }
  } else {
    var keys = keys(obj);
    for (i = 0, length = keys.length; i < length; i++) {
      if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
    }
  }
};

function any(obj, iterator, context) {
  iterator || (iterator = identity);
  var result = false;
  if (obj == null) return result;
  if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
  each(obj, function(value, index, list) {
    if (result || (result = iterator.call(context, value, index, list))) return breaker;
  });
  return !!result;
};

function contains(obj, target) {
  if (obj == null) return false;
  if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
  return any(obj, function(value) {
    return value === target;
  });
};

function Wrapped(value) {
  this.value = value;
}
Wrapped.prototype.has = function(key) {
  return has(this.value, key);
};
Wrapped.prototype.contains = function(target) {
  return contains(this.value, target);
};
Wrapped.prototype.size = function() {
  return size(this.value);
};

function nodash(value) {
  // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
  return (value && typeof value == 'object' && !Array.isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
    ? value
    : new Wrapped(value);
}

module.exports = nodash;

},{}],54:[function(require,module,exports){
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  "use strict";

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");

},{}],55:[function(require,module,exports){
(function (Buffer){
function FilerBuffer (subject, encoding, nonZero) {

  // Automatically turn ArrayBuffer into Uint8Array so that underlying
  // Buffer code doesn't just throw away and ignore ArrayBuffer data.
  if (subject instanceof ArrayBuffer) {
    subject = new Uint8Array(subject);
  }

  return new Buffer(subject, encoding, nonZero);
};

// Inherit prototype from Buffer
FilerBuffer.prototype = Object.create(Buffer.prototype);
FilerBuffer.prototype.constructor = FilerBuffer;

// Also copy static methods onto FilerBuffer ctor
Object.keys(Buffer).forEach(function (p) {
  if (Buffer.hasOwnProperty(p)) {
    FilerBuffer[p] = Buffer[p];
  }
});

module.exports = FilerBuffer;

}).call(this,require("buffer").Buffer)
},{"buffer":18}],56:[function(require,module,exports){
var O_READ = 'READ';
var O_WRITE = 'WRITE';
var O_CREATE = 'CREATE';
var O_EXCLUSIVE = 'EXCLUSIVE';
var O_TRUNCATE = 'TRUNCATE';
var O_APPEND = 'APPEND';
var XATTR_CREATE = 'CREATE';
var XATTR_REPLACE = 'REPLACE';

module.exports = {
  FILE_SYSTEM_NAME: 'local',

  FILE_STORE_NAME: 'files',

  IDB_RO: 'readonly',
  IDB_RW: 'readwrite',

  WSQL_VERSION: "1",
  WSQL_SIZE: 5 * 1024 * 1024,
  WSQL_DESC: "FileSystem Storage",

  MODE_FILE: 'FILE',
  MODE_DIRECTORY: 'DIRECTORY',
  MODE_SYMBOLIC_LINK: 'SYMLINK',
  MODE_META: 'META',

  SYMLOOP_MAX: 10,

  BINARY_MIME_TYPE: 'application/octet-stream',
  JSON_MIME_TYPE: 'application/json',

  ROOT_DIRECTORY_NAME: '/', // basename(normalize(path))

  // FS Mount Flags
  FS_FORMAT: 'FORMAT',
  FS_NOCTIME: 'NOCTIME',
  FS_NOMTIME: 'NOMTIME',
  FS_NODUPEIDCHECK: 'FS_NODUPEIDCHECK',

  // FS File Open Flags
  O_READ: O_READ,
  O_WRITE: O_WRITE,
  O_CREATE: O_CREATE,
  O_EXCLUSIVE: O_EXCLUSIVE,
  O_TRUNCATE: O_TRUNCATE,
  O_APPEND: O_APPEND,

  O_FLAGS: {
    'r': [O_READ],
    'r+': [O_READ, O_WRITE],
    'w': [O_WRITE, O_CREATE, O_TRUNCATE],
    'w+': [O_WRITE, O_READ, O_CREATE, O_TRUNCATE],
    'wx': [O_WRITE, O_CREATE, O_EXCLUSIVE, O_TRUNCATE],
    'wx+': [O_WRITE, O_READ, O_CREATE, O_EXCLUSIVE, O_TRUNCATE],
    'a': [O_WRITE, O_CREATE, O_APPEND],
    'a+': [O_WRITE, O_READ, O_CREATE, O_APPEND],
    'ax': [O_WRITE, O_CREATE, O_EXCLUSIVE, O_APPEND],
    'ax+': [O_WRITE, O_READ, O_CREATE, O_EXCLUSIVE, O_APPEND]
  },

  XATTR_CREATE: XATTR_CREATE,
  XATTR_REPLACE: XATTR_REPLACE,

  FS_READY: 'READY',
  FS_PENDING: 'PENDING',
  FS_ERROR: 'ERROR',

  SUPER_NODE_ID: '00000000-0000-0000-0000-000000000000',

  // Reserved File Descriptors for streams
  STDIN: 0,
  STDOUT: 1,
  STDERR: 2,
  FIRST_DESCRIPTOR: 3,

  ENVIRONMENT: {
    TMP: '/tmp',
    PATH: ''
  }
};

},{}],57:[function(require,module,exports){
var MODE_FILE = require('./constants.js').MODE_FILE;

module.exports = function DirectoryEntry(id, type) {
  this.id = id;
  this.type = type || MODE_FILE;
};

},{"./constants.js":56}],58:[function(require,module,exports){
(function (Buffer){
// Adapt encodings to work with Buffer or Uint8Array, they expect the latter
function decode(buf) {
  return buf.toString('utf8');
}

function encode(string) {
  return new Buffer(string, 'utf8');
}

module.exports = {
  encode: encode,
  decode: decode
};

}).call(this,require("buffer").Buffer)
},{"buffer":18}],59:[function(require,module,exports){
var errors = {};
[
  /**
   * node.js errors - we only use some of these, add as needed.
   */
  //'-1:UNKNOWN:unknown error',
  //'0:OK:success',
  //'1:EOF:end of file',
  //'2:EADDRINFO:getaddrinfo error',
  //'3:EACCES:permission denied',
  //'4:EAGAIN:resource temporarily unavailable',
  //'5:EADDRINUSE:address already in use',
  //'6:EADDRNOTAVAIL:address not available',
  //'7:EAFNOSUPPORT:address family not supported',
  //'8:EALREADY:connection already in progress',
  '9:EBADF:bad file descriptor',
  '10:EBUSY:resource busy or locked',
  //'11:ECONNABORTED:software caused connection abort',
  //'12:ECONNREFUSED:connection refused',
  //'13:ECONNRESET:connection reset by peer',
  //'14:EDESTADDRREQ:destination address required',
  //'15:EFAULT:bad address in system call argument',
  //'16:EHOSTUNREACH:host is unreachable',
  //'17:EINTR:interrupted system call',
  '18:EINVAL:invalid argument',
  //'19:EISCONN:socket is already connected',
  //'20:EMFILE:too many open files',
  //'21:EMSGSIZE:message too long',
  //'22:ENETDOWN:network is down',
  //'23:ENETUNREACH:network is unreachable',
  //'24:ENFILE:file table overflow',
  //'25:ENOBUFS:no buffer space available',
  //'26:ENOMEM:not enough memory',
  '27:ENOTDIR:not a directory',
  '28:EISDIR:illegal operation on a directory',
  //'29:ENONET:machine is not on the network',
  // errno 30 skipped, as per https://github.com/rvagg/node-errno/blob/master/errno.js
  //'31:ENOTCONN:socket is not connected',
  //'32:ENOTSOCK:socket operation on non-socket',
  //'33:ENOTSUP:operation not supported on socket',
  '34:ENOENT:no such file or directory',
  //'35:ENOSYS:function not implemented',
  //'36:EPIPE:broken pipe',
  //'37:EPROTO:protocol error',
  //'38:EPROTONOSUPPORT:protocol not supported',
  //'39:EPROTOTYPE:protocol wrong type for socket',
  //'40:ETIMEDOUT:connection timed out',
  //'41:ECHARSET:invalid Unicode character',
  //'42:EAIFAMNOSUPPORT:address family for hostname not supported',
  // errno 43 skipped, as per https://github.com/rvagg/node-errno/blob/master/errno.js
  //'44:EAISERVICE:servname not supported for ai_socktype',
  //'45:EAISOCKTYPE:ai_socktype not supported',
  //'46:ESHUTDOWN:cannot send after transport endpoint shutdown',
  '47:EEXIST:file already exists',
  //'48:ESRCH:no such process',
  //'49:ENAMETOOLONG:name too long',
  //'50:EPERM:operation not permitted',
  '51:ELOOP:too many symbolic links encountered',
  //'52:EXDEV:cross-device link not permitted',
  '53:ENOTEMPTY:directory not empty',
  //'54:ENOSPC:no space left on device',
  '55:EIO:i/o error',
  //'56:EROFS:read-only file system',
  //'57:ENODEV:no such device',
  //'58:ESPIPE:invalid seek',
  //'59:ECANCELED:operation canceled',

  /**
   * Filer specific errors
   */
  '1000:ENOTMOUNTED:not mounted',
  '1001:EFILESYSTEMERROR:missing super node, use \'FORMAT\' flag to format filesystem.',
  '1002:ENOATTR:attribute does not exist'

].forEach(function(e) {
  e = e.split(':');
  var errno = +e[0];
  var errName = e[1];
  var defaultMessage = e[2];

  function FilerError(msg, path) {
    Error.call(this);

    this.name = errName;
    this.code = errName;
    this.errno = errno;
    this.message = msg || defaultMessage;
    if(path) {
      this.path = path;
    }
    this.stack = (new Error(this.message)).stack;
  }
  FilerError.prototype = Object.create(Error.prototype);
  FilerError.prototype.constructor = FilerError;
  FilerError.prototype.toString = function() {
    var pathInfo = this.path ? (', \'' + this.path + '\'') : '';
    return this.name + ': ' + this.message + pathInfo;
  };

  // We expose the error as both Errors.EINVAL and Errors[18]
  errors[errName] = errors[errno] = FilerError;
});

module.exports = errors;

},{}],60:[function(require,module,exports){
var _ = require('../../lib/nodash.js');

var Path = require('../path.js');
var normalize = Path.normalize;
var dirname = Path.dirname;
var basename = Path.basename;
var isAbsolutePath = Path.isAbsolute;
var isNullPath = Path.isNull;

var Constants = require('../constants.js');
var MODE_FILE = Constants.MODE_FILE;
var MODE_DIRECTORY = Constants.MODE_DIRECTORY;
var MODE_SYMBOLIC_LINK = Constants.MODE_SYMBOLIC_LINK;
var MODE_META = Constants.MODE_META;

var ROOT_DIRECTORY_NAME = Constants.ROOT_DIRECTORY_NAME;
var SUPER_NODE_ID = Constants.SUPER_NODE_ID;
var SYMLOOP_MAX = Constants.SYMLOOP_MAX;

var O_READ = Constants.O_READ;
var O_WRITE = Constants.O_WRITE;
var O_CREATE = Constants.O_CREATE;
var O_EXCLUSIVE = Constants.O_EXCLUSIVE;
var O_TRUNCATE = Constants.O_TRUNCATE;
var O_APPEND = Constants.O_APPEND;
var O_FLAGS = Constants.O_FLAGS;

var XATTR_CREATE = Constants.XATTR_CREATE;
var XATTR_REPLACE = Constants.XATTR_REPLACE;
var FS_NOMTIME = Constants.FS_NOMTIME;
var FS_NOCTIME = Constants.FS_NOCTIME;

var Encoding = require('../encoding.js');
var Errors = require('../errors.js');
var DirectoryEntry = require('../directory-entry.js');
var OpenFileDescription = require('../open-file-description.js');
var SuperNode = require('../super-node.js');
var Node = require('../node.js');
var Stats = require('../stats.js');
var Buffer = require('../buffer.js');

/**
 * Many functions below use this callback pattern. If it's not
 * re-defined, we use this to generate a callback. NOTE: this
 * can be use for callbacks of both forms without problem (i.e.,
 * since result will be undefined if not returned):
 *  - callback(error)
 *  - callback(error, result)
 */
function standard_check_result_cb(callback) {
  return function(error, result) {
    if(error) {
      callback(error);
    } else {
      callback(null, result);
    }
  };
}

/**
 * Update node times. Only passed times are modified (undefined times are ignored)
 * and filesystem flags are examined in order to override update logic.
 */
function update_node_times(context, path, node, times, callback) {
  // Honour mount flags for how we update times
  var flags = context.flags;
  if(_(flags).contains(FS_NOCTIME)) {
    delete times.ctime;
  }
  if(_(flags).contains(FS_NOMTIME)) {
    delete times.mtime;
  }

  // Only do the update if required (i.e., times are still present)
  var update = false;
  if(times.ctime) {
    node.ctime = times.ctime;
    // We don't do atime tracking for perf reasons, but do mirror ctime
    node.atime = times.ctime;
    update = true;
  }
  if(times.atime) {
    // The only time we explicitly pass atime is when utimes(), futimes() is called.
    // Override ctime mirror here if so
    node.atime = times.atime;
    update = true;
  }
  if(times.mtime) {
    node.mtime = times.mtime;
    update = true;
  }

  function complete(error) {
    // Queue this change so we can send watch events.
    // Unlike node.js, we send the full path vs. basename/dirname only.
    context.changes.push({ event: 'change', path: path });
    callback(error);
  }

  if(update) {
    context.putObject(node.id, node, complete);
  } else {
    complete();
  }
}

/**
 * make_node()
 */
// in: file or directory path
// out: new node representing file/directory
function make_node(context, path, mode, callback) {
  if(mode !== MODE_DIRECTORY && mode !== MODE_FILE) {
    return callback(new Errors.EINVAL('mode must be a directory or file', path));
  }

  path = normalize(path);

  var name = basename(path);
  var parentPath = dirname(path);
  var parentNode;
  var parentNodeData;
  var node;

  // Check if the parent node exists
  function create_node_in_parent(error, parentDirectoryNode) {
    if(error) {
      callback(error);
    } else if(parentDirectoryNode.mode !== MODE_DIRECTORY) {
      callback(new Errors.ENOTDIR('a component of the path prefix is not a directory', path));
    } else {
      parentNode = parentDirectoryNode;
      find_node(context, path, check_if_node_exists);
    }
  }

  // Check if the node to be created already exists
  function check_if_node_exists(error, result) {
    if(!error && result) {
      callback(new Errors.EEXIST('path name already exists', path));
    } else if(error && !(error instanceof Errors.ENOENT)) {
      callback(error);
    } else {
      context.getObject(parentNode.data, create_node);
    }
  }

  // Create the new node
  function create_node(error, result) {
    if(error) {
      callback(error);
    } else {
      parentNodeData = result;
      Node.create({guid: context.guid, mode: mode}, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        node = result;
        node.nlinks += 1;
        context.putObject(node.id, node, update_parent_node_data);
      });
    }
  }

  // Update parent node time
  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      var now = Date.now();
      update_node_times(context, parentPath, node, { mtime: now, ctime: now }, callback);
    }
  }

  // Update the parent nodes data
  function update_parent_node_data(error) {
    if(error) {
      callback(error);
    } else {
      parentNodeData[name] = new DirectoryEntry(node.id, mode);
      context.putObject(parentNode.data, parentNodeData, update_time);
    }
  }

  // Find the parent node
  find_node(context, parentPath, create_node_in_parent);
}

/**
 * find_node
 */
// in: file or directory path
// out: node structure, or error
function find_node(context, path, callback) {
  path = normalize(path);
  if(!path) {
    return callback(new Errors.ENOENT('path is an empty string'));
  }
  var name = basename(path);
  var parentPath = dirname(path);
  var followedCount = 0;

  function read_root_directory_node(error, superNode) {
    if(error) {
      callback(error);
    } else if(!superNode || superNode.mode !== MODE_META || !superNode.rnode) {
      callback(new Errors.EFILESYSTEMERROR());
    } else {
      context.getObject(superNode.rnode, check_root_directory_node);
    }
  }

  function check_root_directory_node(error, rootDirectoryNode) {
    if(error) {
      callback(error);
    } else if(!rootDirectoryNode) {
      callback(new Errors.ENOENT());
    } else {
      callback(null, rootDirectoryNode);
    }
  }

  // in: parent directory node
  // out: parent directory data
  function read_parent_directory_data(error, parentDirectoryNode) {
    if(error) {
      callback(error);
    } else if(parentDirectoryNode.mode !== MODE_DIRECTORY || !parentDirectoryNode.data) {
      callback(new Errors.ENOTDIR('a component of the path prefix is not a directory', path));
    } else {
      context.getObject(parentDirectoryNode.data, get_node_from_parent_directory_data);
    }
  }

  // in: parent directory data
  // out: searched node
  function get_node_from_parent_directory_data(error, parentDirectoryData) {
    if(error) {
      callback(error);
    } else {
      if(!_(parentDirectoryData).has(name)) {
        callback(new Errors.ENOENT(null, path));
      } else {
        var nodeId = parentDirectoryData[name].id;
        context.getObject(nodeId, is_symbolic_link);
      }
    }
  }

  function is_symbolic_link(error, node) {
    if(error) {
      callback(error);
    } else {
      if(node.mode == MODE_SYMBOLIC_LINK) {
        followedCount++;
        if(followedCount > SYMLOOP_MAX){
          callback(new Errors.ELOOP(null, path));
        } else {
          follow_symbolic_link(node.data);
        }
      } else {
        callback(null, node);
      }
    }
  }

  function follow_symbolic_link(data) {
    data = normalize(data);
    parentPath = dirname(data);
    name = basename(data);
    if(ROOT_DIRECTORY_NAME == name) {
      context.getObject(SUPER_NODE_ID, read_root_directory_node);
    } else {
      find_node(context, parentPath, read_parent_directory_data);
    }
  }

  if(ROOT_DIRECTORY_NAME == name) {
    context.getObject(SUPER_NODE_ID, read_root_directory_node);
  } else {
    find_node(context, parentPath, read_parent_directory_data);
  }
}


/**
 * set extended attribute (refactor)
 */
function set_extended_attribute (context, path_or_fd, name, value, flag, callback) {
  var path;

  function set_xattr (error, node) {
    var xattr = (node ? node.xattrs[name] : null);

    function update_time(error) {
      if(error) {
        callback(error);
      } else {
        update_node_times(context, path, node, { ctime: Date.now() }, callback);
      }
    }

    if (error) {
      callback(error);
    }
    else if (flag === XATTR_CREATE && node.xattrs.hasOwnProperty(name)) {
      callback(new Errors.EEXIST('attribute already exists', path_or_fd));
    }
    else if (flag === XATTR_REPLACE && !node.xattrs.hasOwnProperty(name)) {
      callback(new Errors.ENOATTR(null, path_or_fd));
    }
    else {
      node.xattrs[name] = value;
      context.putObject(node.id, node, update_time);
    }
  }

  if (typeof path_or_fd == 'string') {
    path = path_or_fd;
    find_node(context, path_or_fd, set_xattr);
  }
  else if (typeof path_or_fd == 'object' && typeof path_or_fd.id == 'string') {
    path = path_or_fd.path;
    context.getObject(path_or_fd.id, set_xattr);
  }
  else {
    callback(new Errors.EINVAL('path or file descriptor of wrong type', path_or_fd));
  }
}

/**
 * ensure_root_directory. Creates a root node if necessary.
 *
 * Note: this should only be invoked when formatting a new file system.
 * Multiple invocations of this by separate instances will still result
 * in only a single super node.
 */
function ensure_root_directory(context, callback) {
  var superNode;
  var directoryNode;
  var directoryData;

  function ensure_super_node(error, existingNode) {
    if(!error && existingNode) {
      // Another instance has beat us and already created the super node.
      callback();
    } else if(error && !(error instanceof Errors.ENOENT)) {
      callback(error);
    } else {
      SuperNode.create({guid: context.guid}, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        superNode = result;
        context.putObject(superNode.id, superNode, write_directory_node);
      });
    }
  }

  function write_directory_node(error) {
    if(error) {
      callback(error);
    } else {
      Node.create({guid: context.guid, id: superNode.rnode, mode: MODE_DIRECTORY}, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        directoryNode = result;
        directoryNode.nlinks += 1;
        context.putObject(directoryNode.id, directoryNode, write_directory_data);
      });
    }
  }

  function write_directory_data(error) {
    if(error) {
      callback(error);
    } else {
      directoryData = {};
      context.putObject(directoryNode.data, directoryData, callback);
    }
  }

  context.getObject(SUPER_NODE_ID, ensure_super_node);
}

/**
 * make_directory
 */
function make_directory(context, path, callback) {
  path = normalize(path);
  var name = basename(path);
  var parentPath = dirname(path);

  var directoryNode;
  var directoryData;
  var parentDirectoryNode;
  var parentDirectoryData;

  function check_if_directory_exists(error, result) {
    if(!error && result) {
      callback(new Errors.EEXIST(null, path));
    } else if(error && !(error instanceof Errors.ENOENT)) {
      callback(error);
    } else {
      find_node(context, parentPath, read_parent_directory_data);
    }
  }

  function read_parent_directory_data(error, result) {
    if(error) {
      callback(error);
    } else {
      parentDirectoryNode = result;
      context.getObject(parentDirectoryNode.data, write_directory_node);
    }
  }

  function write_directory_node(error, result) {
    if(error) {
      callback(error);
    } else {
      parentDirectoryData = result;
      Node.create({guid: context.guid, mode: MODE_DIRECTORY}, function(error, result) {
        if(error) {
          callback(error);
          return;
        }
        directoryNode = result;
        directoryNode.nlinks += 1;
        context.putObject(directoryNode.id, directoryNode, write_directory_data);
      });
    }
  }

  function write_directory_data(error) {
    if(error) {
      callback(error);
    } else {
      directoryData = {};
      context.putObject(directoryNode.data, directoryData, update_parent_directory_data);
    }
  }

  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      var now = Date.now();
      update_node_times(context, parentPath, parentDirectoryNode, { mtime: now, ctime: now }, callback);
    }
  }

  function update_parent_directory_data(error) {
    if(error) {
      callback(error);
    } else {
      parentDirectoryData[name] = new DirectoryEntry(directoryNode.id, MODE_DIRECTORY);
      context.putObject(parentDirectoryNode.data, parentDirectoryData, update_time);
    }
  }

  find_node(context, path, check_if_directory_exists);
}

/**
 * remove_directory
 */
function remove_directory(context, path, callback) {
  path = normalize(path);
  var name = basename(path);
  var parentPath = dirname(path);

  var directoryNode;
  var directoryData;
  var parentDirectoryNode;
  var parentDirectoryData;

  function read_parent_directory_data(error, result) {
    if(error) {
      callback(error);
    } else {
      parentDirectoryNode = result;
      context.getObject(parentDirectoryNode.data, check_if_node_exists);
    }
  }

  function check_if_node_exists(error, result) {
    if(error) {
      callback(error);
    } else if(ROOT_DIRECTORY_NAME == name) {
      callback(new Errors.EBUSY(null, path));
    } else if(!_(result).has(name)) {
      callback(new Errors.ENOENT(null, path));
    } else {
      parentDirectoryData = result;
      directoryNode = parentDirectoryData[name].id;
      context.getObject(directoryNode, check_if_node_is_directory);
    }
  }

  function check_if_node_is_directory(error, result) {
    if(error) {
      callback(error);
    } else if(result.mode != MODE_DIRECTORY) {
      callback(new Errors.ENOTDIR(null, path));
    } else {
      directoryNode = result;
      context.getObject(directoryNode.data, check_if_directory_is_empty);
    }
  }

  function check_if_directory_is_empty(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryData = result;
      if(_(directoryData).size() > 0) {
        callback(new Errors.ENOTEMPTY(null, path));
      } else {
        remove_directory_entry_from_parent_directory_node();
      }
    }
  }

  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      var now = Date.now();
      update_node_times(context, parentPath, parentDirectoryNode, { mtime: now, ctime: now }, remove_directory_node);
    }
  }

  function remove_directory_entry_from_parent_directory_node() {
    delete parentDirectoryData[name];
    context.putObject(parentDirectoryNode.data, parentDirectoryData, update_time);
  }

  function remove_directory_node(error) {
    if(error) {
      callback(error);
    } else {
      context.delete(directoryNode.id, remove_directory_data);
    }
  }

  function remove_directory_data(error) {
    if(error) {
      callback(error);
    } else {
      context.delete(directoryNode.data, callback);
    }
  }

  find_node(context, parentPath, read_parent_directory_data);
}

function open_file(context, path, flags, callback) {
  path = normalize(path);
  var name = basename(path);
  var parentPath = dirname(path);

  var directoryNode;
  var directoryData;
  var directoryEntry;
  var fileNode;
  var fileData;

  var followedCount = 0;

  if(ROOT_DIRECTORY_NAME == name) {
    if(_(flags).contains(O_WRITE)) {
      callback(new Errors.EISDIR('the named file is a directory and O_WRITE is set', path));
    } else {
      find_node(context, path, set_file_node);
    }
  } else {
    find_node(context, parentPath, read_directory_data);
  }

  function read_directory_data(error, result) {
    if(error) {
      callback(error);
    } else if(result.mode !== MODE_DIRECTORY) {
      callback(new Errors.ENOENT(null, path));
    } else {
      directoryNode = result;
      context.getObject(directoryNode.data, check_if_file_exists);
    }
  }

  function check_if_file_exists(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryData = result;
      if(_(directoryData).has(name)) {
        if(_(flags).contains(O_EXCLUSIVE)) {
          callback(new Errors.ENOENT('O_CREATE and O_EXCLUSIVE are set, and the named file exists', path));
        } else {
          directoryEntry = directoryData[name];
          if(directoryEntry.type == MODE_DIRECTORY && _(flags).contains(O_WRITE)) {
            callback(new Errors.EISDIR('the named file is a directory and O_WRITE is set', path));
          } else {
            context.getObject(directoryEntry.id, check_if_symbolic_link);
          }
        }
      } else {
        if(!_(flags).contains(O_CREATE)) {
          callback(new Errors.ENOENT('O_CREATE is not set and the named file does not exist', path));
        } else {
          write_file_node();
        }
      }
    }
  }

  function check_if_symbolic_link(error, result) {
    if(error) {
      callback(error);
    } else {
      var node = result;
      if(node.mode == MODE_SYMBOLIC_LINK) {
        followedCount++;
        if(followedCount > SYMLOOP_MAX){
          callback(new Errors.ELOOP(null, path));
        } else {
          follow_symbolic_link(node.data);
        }
      } else {
        set_file_node(undefined, node);
      }
    }
  }

  function follow_symbolic_link(data) {
    data = normalize(data);
    parentPath = dirname(data);
    name = basename(data);
    if(ROOT_DIRECTORY_NAME == name) {
      if(_(flags).contains(O_WRITE)) {
        callback(new Errors.EISDIR('the named file is a directory and O_WRITE is set', path));
      } else {
        find_node(context, path, set_file_node);
      }
    }
    find_node(context, parentPath, read_directory_data);
  }

  function set_file_node(error, result) {
    if(error) {
      callback(error);
    } else {
      fileNode = result;
      callback(null, fileNode);
    }
  }

  function write_file_node() {
    Node.create({guid: context.guid, mode: MODE_FILE}, function(error, result) {
      if(error) {
        callback(error);
        return;
      }
      fileNode = result;
      fileNode.nlinks += 1;
      context.putObject(fileNode.id, fileNode, write_file_data);
    });
  }

  function write_file_data(error) {
    if(error) {
      callback(error);
    } else {
      fileData = new Buffer(0);
      fileData.fill(0);
      context.putBuffer(fileNode.data, fileData, update_directory_data);
    }
  }

  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      var now = Date.now();
      update_node_times(context, parentPath, directoryNode, { mtime: now, ctime: now }, handle_update_result);
    }
  }

  function update_directory_data(error) {
    if(error) {
      callback(error);
    } else {
      directoryData[name] = new DirectoryEntry(fileNode.id, MODE_FILE);
      context.putObject(directoryNode.data, directoryData, update_time);
    }
  }

  function handle_update_result(error) {
    if(error) {
      callback(error);
    } else {
      callback(null, fileNode);
    }
  }
}

function replace_data(context, ofd, buffer, offset, length, callback) {
  var fileNode;

  function return_nbytes(error) {
    if(error) {
      callback(error);
    } else {
      callback(null, length);
    }
  }

  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      var now = Date.now();
      update_node_times(context, ofd.path, fileNode, { mtime: now, ctime: now }, return_nbytes);
    }
  }

  function update_file_node(error) {
    if(error) {
      callback(error);
    } else {
      context.putObject(fileNode.id, fileNode, update_time);
    }
  }

  function write_file_data(error, result) {
    if(error) {
      callback(error);
    } else {
      fileNode = result;
      var newData = new Buffer(length);
      newData.fill(0);
      buffer.copy(newData, 0, offset, offset + length);
      ofd.position = length;

      fileNode.size = length;
      fileNode.version += 1;

      context.putBuffer(fileNode.data, newData, update_file_node);
    }
  }

  context.getObject(ofd.id, write_file_data);
}

function write_data(context, ofd, buffer, offset, length, position, callback) {
  var fileNode;
  var fileData;

  function return_nbytes(error) {
    if(error) {
      callback(error);
    } else {
      callback(null, length);
    }
  }

  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      var now = Date.now();
      update_node_times(context, ofd.path, fileNode, { mtime: now, ctime: now }, return_nbytes);
    }
  }

  function update_file_node(error) {
    if(error) {
      callback(error);
    } else {
      context.putObject(fileNode.id, fileNode, update_time);
    }
  }

  function update_file_data(error, result) {
    if(error) {
      callback(error);
    } else {
      fileData = result;
      if(!fileData) {
        return callback(new Errors.EIO('Expected Buffer'));
      }
      var _position = (!(undefined === position || null === position)) ? position : ofd.position;
      var newSize = Math.max(fileData.length, _position + length);
      var newData = new Buffer(newSize);
      newData.fill(0);
      if(fileData) {
        fileData.copy(newData);
      }
      buffer.copy(newData, _position, offset, offset + length);
      if(undefined === position) {
        ofd.position += length;
      }

      fileNode.size = newSize;
      fileNode.version += 1;

      context.putBuffer(fileNode.data, newData, update_file_node);
    }
  }

  function read_file_data(error, result) {
    if(error) {
      callback(error);
    } else {
      fileNode = result;
      context.getBuffer(fileNode.data, update_file_data);
    }
  }

  context.getObject(ofd.id, read_file_data);
}

function read_data(context, ofd, buffer, offset, length, position, callback) {
  var fileNode;
  var fileData;

  function handle_file_data(error, result) {
    if(error) {
      callback(error);
    } else {
      fileData = result;
      if(!fileData) {
        return callback(new Errors.EIO('Expected Buffer'));
      }
      var _position = (!(undefined === position || null === position)) ? position : ofd.position;
      length = (_position + length > buffer.length) ? length - _position : length;
      fileData.copy(buffer, offset, _position, _position + length);
      if(undefined === position) {
        ofd.position += length;
      }
      callback(null, length);
    }
  }

  function read_file_data(error, result) {
    if(error) {
      callback(error);
    } else {
      fileNode = result;
      context.getBuffer(fileNode.data, handle_file_data);
    }
  }

  context.getObject(ofd.id, read_file_data);
}

function stat_file(context, path, callback) {
  path = normalize(path);
  var name = basename(path);
  find_node(context, path, standard_check_result_cb(callback));
}

function fstat_file(context, ofd, callback) {
  context.getObject(ofd.id, standard_check_result_cb(callback));
}

function lstat_file(context, path, callback) {
  path = normalize(path);
  var name = basename(path);
  var parentPath = dirname(path);

  var directoryNode;
  var directoryData;

  if(ROOT_DIRECTORY_NAME == name) {
    find_node(context, path, standard_check_result_cb(callback));
  } else {
    find_node(context, parentPath, read_directory_data);
  }

  function read_directory_data(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryNode = result;
      context.getObject(directoryNode.data, check_if_file_exists);
    }
  }

  function check_if_file_exists(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryData = result;
      if(!_(directoryData).has(name)) {
        callback(new Errors.ENOENT('a component of the path does not name an existing file', path));
      } else {
        context.getObject(directoryData[name].id, standard_check_result_cb(callback));
      }
    }
  }
}

function link_node(context, oldpath, newpath, callback) {
  oldpath = normalize(oldpath);
  var oldname = basename(oldpath);
  var oldParentPath = dirname(oldpath);

  newpath = normalize(newpath);
  var newname = basename(newpath);
  var newParentPath = dirname(newpath);

  var oldDirectoryNode;
  var oldDirectoryData;
  var newDirectoryNode;
  var newDirectoryData;
  var fileNode;

  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      update_node_times(context, newpath,  fileNode, { ctime: Date.now() }, callback);
    }
  }

  function update_file_node(error, result) {
    if(error) {
      callback(error);
    } else {
      fileNode = result;
      fileNode.nlinks += 1;
      context.putObject(fileNode.id, fileNode, update_time);
    }
  }

  function read_directory_entry(error, result) {
    if(error) {
      callback(error);
    } else {
      context.getObject(newDirectoryData[newname].id, update_file_node);
    }
  }

  function check_if_new_file_exists(error, result) {
    if(error) {
      callback(error);
    } else {
      newDirectoryData = result;
      if(_(newDirectoryData).has(newname)) {
        callback(new Errors.EEXIST('newpath resolves to an existing file', newname));
      } else {
        newDirectoryData[newname] = oldDirectoryData[oldname];
        context.putObject(newDirectoryNode.data, newDirectoryData, read_directory_entry);
      }
    }
  }

  function read_new_directory_data(error, result) {
    if(error) {
      callback(error);
    } else {
      newDirectoryNode = result;
      context.getObject(newDirectoryNode.data, check_if_new_file_exists);
    }
  }

  function check_if_old_file_exists(error, result) {
    if(error) {
      callback(error);
    } else {
      oldDirectoryData = result;
      if(!_(oldDirectoryData).has(oldname)) {
        callback(new Errors.ENOENT('a component of either path prefix does not exist', oldname));
      } else {
        find_node(context, newParentPath, read_new_directory_data);
      }
    }
  }

  function read_old_directory_data(error, result) {
    if(error) {
      callback(error);
    } else {
      oldDirectoryNode = result;
      context.getObject(oldDirectoryNode.data, check_if_old_file_exists);
    }
  }

  find_node(context, oldParentPath, read_old_directory_data);
}

function unlink_node(context, path, callback) {
  path = normalize(path);
  var name = basename(path);
  var parentPath = dirname(path);

  var directoryNode;
  var directoryData;
  var fileNode;

  function update_directory_data(error) {
    if(error) {
      callback(error);
    } else {
      delete directoryData[name];
      context.putObject(directoryNode.data, directoryData, function(error) {
        var now = Date.now();
        update_node_times(context, parentPath, directoryNode, { mtime: now, ctime: now }, callback);
      });
    }
  }

  function delete_file_data(error) {
    if(error) {
      callback(error);
    } else {
      context.delete(fileNode.data, update_directory_data);
    }
  }

  function update_file_node(error, result) {
    if(error) {
      callback(error);
    } else {
      fileNode = result;
      fileNode.nlinks -= 1;
      if(fileNode.nlinks < 1) {
        context.delete(fileNode.id, delete_file_data);
      } else {
        context.putObject(fileNode.id, fileNode, function(error) {
          update_node_times(context, path, fileNode, { ctime: Date.now() }, update_directory_data);
        });
      }
    }
  }

  function check_if_file_exists(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryData = result;
      if(!_(directoryData).has(name)) {
        callback(new Errors.ENOENT('a component of the path does not name an existing file', name));
      } else {
        context.getObject(directoryData[name].id, update_file_node);
      }
    }
  }

  function read_directory_data(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryNode = result;
      context.getObject(directoryNode.data, check_if_file_exists);
    }
  }

  find_node(context, parentPath, read_directory_data);
}

function read_directory(context, path, callback) {
  path = normalize(path);
  var name = basename(path);

  var directoryNode;
  var directoryData;

  function handle_directory_data(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryData = result;
      var files = Object.keys(directoryData);
      callback(null, files);
    }
  }

  function read_directory_data(error, result) {
    if(error) {
      callback(error);
    } else if(result.mode !== MODE_DIRECTORY) {
      callback(new Errors.ENOTDIR(null, path));
    } else {
      directoryNode = result;
      context.getObject(directoryNode.data, handle_directory_data);
    }
  }

  find_node(context, path, read_directory_data);
}

function make_symbolic_link(context, srcpath, dstpath, callback) {
  dstpath = normalize(dstpath);
  var name = basename(dstpath);
  var parentPath = dirname(dstpath);

  var directoryNode;
  var directoryData;
  var fileNode;

  if(ROOT_DIRECTORY_NAME == name) {
    callback(new Errors.EEXIST(null, name));
  } else {
    find_node(context, parentPath, read_directory_data);
  }

  function read_directory_data(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryNode = result;
      context.getObject(directoryNode.data, check_if_file_exists);
    }
  }

  function check_if_file_exists(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryData = result;
      if(_(directoryData).has(name)) {
        callback(new Errors.EEXIST(null, name));
      } else {
        write_file_node();
      }
    }
  }

  function write_file_node() {
    Node.create({guid: context.guid, mode: MODE_SYMBOLIC_LINK}, function(error, result) {
      if(error) {
        callback(error);
        return;
      }
      fileNode = result;
      fileNode.nlinks += 1;
      fileNode.size = srcpath.length;
      fileNode.data = srcpath;
      context.putObject(fileNode.id, fileNode, update_directory_data);
    });
  }

  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      var now = Date.now();
      update_node_times(context, parentPath, directoryNode, { mtime: now, ctime: now }, callback);
    }
  }

  function update_directory_data(error) {
    if(error) {
      callback(error);
    } else {
      directoryData[name] = new DirectoryEntry(fileNode.id, MODE_SYMBOLIC_LINK);
      context.putObject(directoryNode.data, directoryData, update_time);
    }
  }
}

function read_link(context, path, callback) {
  path = normalize(path);
  var name = basename(path);
  var parentPath = dirname(path);

  var directoryNode;
  var directoryData;

  find_node(context, parentPath, read_directory_data);

  function read_directory_data(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryNode = result;
      context.getObject(directoryNode.data, check_if_file_exists);
    }
  }

  function check_if_file_exists(error, result) {
    if(error) {
      callback(error);
    } else {
      directoryData = result;
      if(!_(directoryData).has(name)) {
        callback(new Errors.ENOENT('a component of the path does not name an existing file', name));
      } else {
        context.getObject(directoryData[name].id, check_if_symbolic);
      }
    }
  }

  function check_if_symbolic(error, result) {
    if(error) {
      callback(error);
    } else {
      if(result.mode != MODE_SYMBOLIC_LINK) {
        callback(new Errors.EINVAL('path not a symbolic link', path));
      } else {
        callback(null, result.data);
      }
    }
  }
}

function truncate_file(context, path, length, callback) {
  path = normalize(path);

  var fileNode;

  function read_file_data (error, node) {
    if (error) {
      callback(error);
    } else if(node.mode == MODE_DIRECTORY ) {
      callback(new Errors.EISDIR(null, path));
    } else{
      fileNode = node;
      context.getBuffer(fileNode.data, truncate_file_data);
    }
  }

  function truncate_file_data(error, fileData) {
    if (error) {
      callback(error);
    } else {
      if(!fileData) {
        return callback(new Errors.EIO('Expected Buffer'));
      }
      var data = new Buffer(length);
      data.fill(0);
      if(fileData) {
        fileData.copy(data);
      }
      context.putBuffer(fileNode.data, data, update_file_node);
    }
  }

  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      var now = Date.now();
      update_node_times(context, path, fileNode, { mtime: now, ctime: now }, callback);
    }
  }

  function update_file_node (error) {
    if(error) {
      callback(error);
    } else {
      fileNode.size = length;
      fileNode.version += 1;
      context.putObject(fileNode.id, fileNode, update_time);
    }
  }

  if(length < 0) {
    callback(new Errors.EINVAL('length cannot be negative'));
  } else {
    find_node(context, path, read_file_data);
  }
}

function ftruncate_file(context, ofd, length, callback) {
  var fileNode;

  function read_file_data (error, node) {
    if (error) {
      callback(error);
    } else if(node.mode == MODE_DIRECTORY ) {
      callback(new Errors.EISDIR());
    } else{
      fileNode = node;
      context.getBuffer(fileNode.data, truncate_file_data);
    }
  }

  function truncate_file_data(error, fileData) {
    if (error) {
      callback(error);
    } else {
      var data;
      if(!fileData) {
        return callback(new Errors.EIO('Expected Buffer'));
      }
      if(fileData) {
        data = fileData.slice(0, length);
      } else {
        data = new Buffer(length);
        data.fill(0);
      }
      context.putBuffer(fileNode.data, data, update_file_node);
    }
  }

  function update_time(error) {
    if(error) {
      callback(error);
    } else {
      var now = Date.now();
      update_node_times(context, ofd.path, fileNode, { mtime: now, ctime: now }, callback);
    }
  }

  function update_file_node (error) {
    if(error) {
      callback(error);
    } else {
      fileNode.size = length;
      fileNode.version += 1;
      context.putObject(fileNode.id, fileNode, update_time);
    }
  }

  if(length < 0) {
    callback(new Errors.EINVAL('length cannot be negative'));
  } else {
    context.getObject(ofd.id, read_file_data);
  }
}

function utimes_file(context, path, atime, mtime, callback) {
  path = normalize(path);

  function update_times(error, node) {
    if (error) {
      callback(error);
    } else {
      update_node_times(context, path, node, { atime: atime, ctime: mtime, mtime: mtime }, callback);
    }
  }

  if (typeof atime != 'number' || typeof mtime != 'number') {
    callback(new Errors.EINVAL('atime and mtime must be number', path));
  }
  else if (atime < 0 || mtime < 0) {
    callback(new Errors.EINVAL('atime and mtime must be positive integers', path));
  }
  else {
    find_node(context, path, update_times);
  }
}

function futimes_file(context, ofd, atime, mtime, callback) {

  function update_times (error, node) {
    if (error) {
      callback(error);
    } else {
      update_node_times(context, ofd.path, node, { atime: atime, ctime: mtime, mtime: mtime }, callback);
    }
  }

  if (typeof atime != 'number' || typeof mtime != 'number') {
    callback(new Errors.EINVAL('atime and mtime must be a number'));
  }
  else if (atime < 0 || mtime < 0) {
    callback(new Errors.EINVAL('atime and mtime must be positive integers'));
  }
  else {
    context.getObject(ofd.id, update_times);
  }
}

function setxattr_file(context, path, name, value, flag, callback) {
  path = normalize(path);

  if (typeof name != 'string') {
    callback(new Errors.EINVAL('attribute name must be a string', path));
  }
  else if (!name) {
    callback(new Errors.EINVAL('attribute name cannot be an empty string', path));
  }
  else if (flag !== null &&
           flag !== XATTR_CREATE && flag !== XATTR_REPLACE) {
    callback(new Errors.EINVAL('invalid flag, must be null, XATTR_CREATE or XATTR_REPLACE', path));
  }
  else {
    set_extended_attribute(context, path, name, value, flag, callback);
  }
}

function fsetxattr_file (context, ofd, name, value, flag, callback) {
  if (typeof name != 'string') {
    callback(new Errors.EINVAL('attribute name must be a string'));
  }
  else if (!name) {
    callback(new Errors.EINVAL('attribute name cannot be an empty string'));
  }
  else if (flag !== null &&
           flag !== XATTR_CREATE && flag !== XATTR_REPLACE) {
    callback(new Errors.EINVAL('invalid flag, must be null, XATTR_CREATE or XATTR_REPLACE'));
  }
  else {
    set_extended_attribute(context, ofd, name, value, flag, callback);
  }
}

function getxattr_file (context, path, name, callback) {
  path = normalize(path);

  function get_xattr(error, node) {
    var xattr = (node ? node.xattrs[name] : null);

    if (error) {
      callback (error);
    }
    else if (!node.xattrs.hasOwnProperty(name)) {
      callback(new Errors.ENOATTR(null, path));
    }
    else {
      callback(null, node.xattrs[name]);
    }
  }

  if (typeof name != 'string') {
    callback(new Errors.EINVAL('attribute name must be a string', path));
  }
  else if (!name) {
    callback(new Errors.EINVAL('attribute name cannot be an empty string', path));
  }
  else {
    find_node(context, path, get_xattr);
  }
}

function fgetxattr_file (context, ofd, name, callback) {

  function get_xattr (error, node) {
    var xattr = (node ? node.xattrs[name] : null);

    if (error) {
      callback(error);
    }
    else if (!node.xattrs.hasOwnProperty(name)) {
      callback(new Errors.ENOATTR());
    }
    else {
      callback(null, node.xattrs[name]);
    }
  }

  if (typeof name != 'string') {
    callback(new Errors.EINVAL());
  }
  else if (!name) {
    callback(new Errors.EINVAL('attribute name cannot be an empty string'));
  }
  else {
    context.getObject(ofd.id, get_xattr);
  }
}

function removexattr_file (context, path, name, callback) {
  path = normalize(path);

  function remove_xattr (error, node) {
    var xattr = (node ? node.xattrs : null);

    function update_time(error) {
      if(error) {
        callback(error);
      } else {
        update_node_times(context, path, node, { ctime: Date.now() }, callback);
      }
    }

    if (error) {
      callback(error);
    }
    else if (!xattr.hasOwnProperty(name)) {
      callback(new Errors.ENOATTR(null, path));
    }
    else {
      delete node.xattrs[name];
      context.putObject(node.id, node, update_time);
    }
  }

  if (typeof name != 'string') {
    callback(new Errors.EINVAL('attribute name must be a string', path));
  }
  else if (!name) {
    callback(new Errors.EINVAL('attribute name cannot be an empty string', path));
  }
  else {
    find_node(context, path, remove_xattr);
  }
}

function fremovexattr_file (context, ofd, name, callback) {

  function remove_xattr (error, node) {
    function update_time(error) {
      if(error) {
        callback(error);
      } else {
        update_node_times(context, ofd.path, node, { ctime: Date.now() }, callback);
      }
    }

    if (error) {
      callback(error);
    }
    else if (!node.xattrs.hasOwnProperty(name)) {
      callback(new Errors.ENOATTR());
    }
    else {
      delete node.xattrs[name];
      context.putObject(node.id, node, update_time);
    }
  }

  if (typeof name != 'string') {
    callback(new Errors.EINVAL('attribute name must be a string'));
  }
  else if (!name) {
    callback(new Errors.EINVAL('attribute name cannot be an empty string'));
  }
  else {
    context.getObject(ofd.id, remove_xattr);
  }
}

function validate_flags(flags) {
  if(!_(O_FLAGS).has(flags)) {
    return null;
  }
  return O_FLAGS[flags];
}

function validate_file_options(options, enc, fileMode){
  if(!options) {
    options = { encoding: enc, flag: fileMode };
  } else if(typeof options === "function") {
    options = { encoding: enc, flag: fileMode };
  } else if(typeof options === "string") {
    options = { encoding: options, flag: fileMode };
  }
  return options;
}

function pathCheck(path, callback) {
  var err;

  if(!path) {
    err = new Errors.EINVAL('Path must be a string', path);
  } else if(isNullPath(path)) {
    err = new Errors.EINVAL('Path must be a string without null bytes.', path);
  } else if(!isAbsolutePath(path)) {
    err = new Errors.EINVAL('Path must be absolute.', path);
  }

  if(err) {
    callback(err);
    return false;
  }
  return true;
}


function open(fs, context, path, flags, mode, callback) {
  // NOTE: we support the same signature as node with a `mode` arg,
  // but ignore it.
  callback = arguments[arguments.length - 1];
  if(!pathCheck(path, callback)) return;

  function check_result(error, fileNode) {
    if(error) {
      callback(error);
    } else {
      var position;
      if(_(flags).contains(O_APPEND)) {
        position = fileNode.size;
      } else {
        position = 0;
      }
      var openFileDescription = new OpenFileDescription(path, fileNode.id, flags, position);
      var fd = fs.allocDescriptor(openFileDescription);
      callback(null, fd);
    }
  }

  flags = validate_flags(flags);
  if(!flags) {
    callback(new Errors.EINVAL('flags is not valid'), path);
  }

  open_file(context, path, flags, check_result);
}

function close(fs, context, fd, callback) {
  if(!_(fs.openFiles).has(fd)) {
    callback(new Errors.EBADF());
  } else {
    fs.releaseDescriptor(fd);
    callback(null);
  }
}

function mknod(fs, context, path, mode, callback) {
  if(!pathCheck(path, callback)) return;
  make_node(context, path, mode, callback);
}

function mkdir(fs, context, path, mode, callback) {
  // NOTE: we support passing a mode arg, but we ignore it internally for now.
  callback = arguments[arguments.length - 1];
  if(!pathCheck(path, callback)) return;
  make_directory(context, path, standard_check_result_cb(callback));
}

function rmdir(fs, context, path, callback) {
  if(!pathCheck(path, callback)) return;
  remove_directory(context, path, standard_check_result_cb(callback));
}

function stat(fs, context, path, callback) {
  if(!pathCheck(path, callback)) return;

  function check_result(error, result) {
    if(error) {
      callback(error);
    } else {
      var stats = new Stats(result, fs.name);
      callback(null, stats);
    }
  }

  stat_file(context, path, check_result);
}

function fstat(fs, context, fd, callback) {
  function check_result(error, result) {
    if(error) {
      callback(error);
    } else {
      var stats = new Stats(result, fs.name);
      callback(null, stats);
    }
  }

  var ofd = fs.openFiles[fd];
  if(!ofd) {
    callback(new Errors.EBADF());
  } else {
    fstat_file(context, ofd, check_result);
  }
}

function link(fs, context, oldpath, newpath, callback) {
  if(!pathCheck(oldpath, callback)) return;
  if(!pathCheck(newpath, callback)) return;
  link_node(context, oldpath, newpath, standard_check_result_cb(callback));
}

function unlink(fs, context, path, callback) {
  if(!pathCheck(path, callback)) return;
  unlink_node(context, path, standard_check_result_cb(callback));
}

function read(fs, context, fd, buffer, offset, length, position, callback) {
  // Follow how node.js does this
  function wrapped_cb(err, bytesRead) {
    // Retain a reference to buffer so that it can't be GC'ed too soon.
    callback(err, bytesRead || 0, buffer);
  }

  offset = (undefined === offset) ? 0 : offset;
  length = (undefined === length) ? buffer.length - offset : length;
  callback = arguments[arguments.length - 1];

  var ofd = fs.openFiles[fd];
  if(!ofd) {
    callback(new Errors.EBADF());
  } else if(!_(ofd.flags).contains(O_READ)) {
    callback(new Errors.EBADF('descriptor does not permit reading'));
  } else {
    read_data(context, ofd, buffer, offset, length, position, standard_check_result_cb(wrapped_cb));
  }
}

function readFile(fs, context, path, options, callback) {
  callback = arguments[arguments.length - 1];
  options = validate_file_options(options, null, 'r');

  if(!pathCheck(path, callback)) return;

  var flags = validate_flags(options.flag || 'r');
  if(!flags) {
    return callback(new Errors.EINVAL('flags is not valid', path));
  }

  open_file(context, path, flags, function(err, fileNode) {
    if(err) {
      return callback(err);
    }
    var ofd = new OpenFileDescription(path, fileNode.id, flags, 0);
    var fd = fs.allocDescriptor(ofd);

    function cleanup() {
      fs.releaseDescriptor(fd);
    }

    fstat_file(context, ofd, function(err, fstatResult) {
      if(err) {
        cleanup();
        return callback(err);
      }

      var stats = new Stats(fstatResult, fs.name);

      if(stats.isDirectory()) {
        cleanup();
        return callback(new Errors.EISDIR('illegal operation on directory', path));
      }

      var size = stats.size;
      var buffer = new Buffer(size);
      buffer.fill(0);

      read_data(context, ofd, buffer, 0, size, 0, function(err, nbytes) {
        cleanup();

        if(err) {
          return callback(err);
        }

        var data;
        if(options.encoding === 'utf8') {
          data = Encoding.decode(buffer);
        } else {
          data = buffer;
        }
        callback(null, data);
      });
    });
  });
}

function write(fs, context, fd, buffer, offset, length, position, callback) {
  callback = arguments[arguments.length - 1];
  offset = (undefined === offset) ? 0 : offset;
  length = (undefined === length) ? buffer.length - offset : length;

  var ofd = fs.openFiles[fd];
  if(!ofd) {
    callback(new Errors.EBADF());
  } else if(!_(ofd.flags).contains(O_WRITE)) {
    callback(new Errors.EBADF('descriptor does not permit writing'));
  } else if(buffer.length - offset < length) {
    callback(new Errors.EIO('intput buffer is too small'));
  } else {
    write_data(context, ofd, buffer, offset, length, position, standard_check_result_cb(callback));
  }
}

function writeFile(fs, context, path, data, options, callback) {
  callback = arguments[arguments.length - 1];
  options = validate_file_options(options, 'utf8', 'w');

  if(!pathCheck(path, callback)) return;

  var flags = validate_flags(options.flag || 'w');
  if(!flags) {
    return callback(new Errors.EINVAL('flags is not valid', path));
  }

  data = data || '';
  if(typeof data === "number") {
    data = '' + data;
  }
  if(typeof data === "string" && options.encoding === 'utf8') {
    data = Encoding.encode(data);
  }

  open_file(context, path, flags, function(err, fileNode) {
    if(err) {
      return callback(err);
    }
    var ofd = new OpenFileDescription(path, fileNode.id, flags, 0);
    var fd = fs.allocDescriptor(ofd);

    replace_data(context, ofd, data, 0, data.length, function(err, nbytes) {
      fs.releaseDescriptor(fd);

      if(err) {
        return callback(err);
      }
      callback(null);
    });
  });
}

function appendFile(fs, context, path, data, options, callback) {
  callback = arguments[arguments.length - 1];
  options = validate_file_options(options, 'utf8', 'a');

  if(!pathCheck(path, callback)) return;

  var flags = validate_flags(options.flag || 'a');
  if(!flags) {
    return callback(new Errors.EINVAL('flags is not valid', path));
  }

  data = data || '';
  if(typeof data === "number") {
    data = '' + data;
  }
  if(typeof data === "string" && options.encoding === 'utf8') {
    data = Encoding.encode(data);
  }

  open_file(context, path, flags, function(err, fileNode) {
    if(err) {
      return callback(err);
    }
    var ofd = new OpenFileDescription(path, fileNode.id, flags, fileNode.size);
    var fd = fs.allocDescriptor(ofd);

    write_data(context, ofd, data, 0, data.length, ofd.position, function(err, nbytes) {
      fs.releaseDescriptor(fd);

      if(err) {
        return callback(err);
      }
      callback(null);
    });
  });
}

function exists(fs, context, path, callback) {
  function cb(err, stats) {
    callback(err ? false : true);
  }
  stat(fs, context, path, cb);
}

function getxattr(fs, context, path, name, callback) {
  if (!pathCheck(path, callback)) return;
  getxattr_file(context, path, name, standard_check_result_cb(callback));
}

function fgetxattr(fs, context, fd, name, callback) {
  var ofd = fs.openFiles[fd];
  if (!ofd) {
    callback(new Errors.EBADF());
  }
  else {
    fgetxattr_file(context, ofd, name, standard_check_result_cb(callback));
  }
}

function setxattr(fs, context, path, name, value, flag, callback) {
  if(typeof flag === 'function') {
    callback = flag;
    flag = null;
  }

  if (!pathCheck(path, callback)) return;
  setxattr_file(context, path, name, value, flag, standard_check_result_cb(callback));
}

function fsetxattr(fs, context, fd, name, value, flag, callback) {
  if(typeof flag === 'function') {
    callback = flag;
    flag = null;
  }

  var ofd = fs.openFiles[fd];
  if (!ofd) {
    callback(new Errors.EBADF());
  }
  else if (!_(ofd.flags).contains(O_WRITE)) {
    callback(new Errors.EBADF('descriptor does not permit writing'));
  }
  else {
    fsetxattr_file(context, ofd, name, value, flag, standard_check_result_cb(callback));
  }
}

function removexattr(fs, context, path, name, callback) {
  if (!pathCheck(path, callback)) return;
  removexattr_file(context, path, name, standard_check_result_cb(callback));
}

function fremovexattr(fs, context, fd, name, callback) {
  var ofd = fs.openFiles[fd];
  if (!ofd) {
    callback(new Errors.EBADF());
  }
  else if (!_(ofd.flags).contains(O_WRITE)) {
    callback(new Errors.EBADF('descriptor does not permit writing'));
  }
  else {
    fremovexattr_file(context, ofd, name, standard_check_result_cb(callback));
  }
}

function lseek(fs, context, fd, offset, whence, callback) {
  function update_descriptor_position(error, stats) {
    if(error) {
      callback(error);
    } else {
      if(stats.size + offset < 0) {
        callback(new Errors.EINVAL('resulting file offset would be negative'));
      } else {
        ofd.position = stats.size + offset;
        callback(null, ofd.position);
      }
    }
  }

  var ofd = fs.openFiles[fd];
  if(!ofd) {
    callback(new Errors.EBADF());
  }

  if('SET' === whence) {
    if(offset < 0) {
      callback(new Errors.EINVAL('resulting file offset would be negative'));
    } else {
      ofd.position = offset;
      callback(null, ofd.position);
    }
  } else if('CUR' === whence) {
    if(ofd.position + offset < 0) {
      callback(new Errors.EINVAL('resulting file offset would be negative'));
    } else {
      ofd.position += offset;
      callback(null, ofd.position);
    }
  } else if('END' === whence) {
    fstat_file(context, ofd, update_descriptor_position);
  } else {
    callback(new Errors.EINVAL('whence argument is not a proper value'));
  }
}

function readdir(fs, context, path, callback) {
  if(!pathCheck(path, callback)) return;
  read_directory(context, path, standard_check_result_cb(callback));
}

function utimes(fs, context, path, atime, mtime, callback) {
  if(!pathCheck(path, callback)) return;

  var currentTime = Date.now();
  atime = (atime) ? atime : currentTime;
  mtime = (mtime) ? mtime : currentTime;

  utimes_file(context, path, atime, mtime, standard_check_result_cb(callback));
}

function futimes(fs, context, fd, atime, mtime, callback) {
  var currentTime = Date.now();
  atime = (atime) ? atime : currentTime;
  mtime = (mtime) ? mtime : currentTime;

  var ofd = fs.openFiles[fd];
  if(!ofd) {
    callback(new Errors.EBADF());
  } else if(!_(ofd.flags).contains(O_WRITE)) {
    callback(new Errors.EBADF('descriptor does not permit writing'));
  } else {
    futimes_file(context, ofd, atime, mtime, standard_check_result_cb(callback));
  }
}

function rename(fs, context, oldpath, newpath, callback) {
  if(!pathCheck(oldpath, callback)) return;
  if(!pathCheck(newpath, callback)) return;

  function unlink_old_node(error) {
    if(error) {
      callback(error);
    } else {
      unlink_node(context, oldpath, standard_check_result_cb(callback));
    }
  }

  link_node(context, oldpath, newpath, unlink_old_node);
}

function symlink(fs, context, srcpath, dstpath, type, callback) {
  // NOTE: we support passing the `type` arg, but ignore it.
  callback = arguments[arguments.length - 1];
  if(!pathCheck(srcpath, callback)) return;
  if(!pathCheck(dstpath, callback)) return;
  make_symbolic_link(context, srcpath, dstpath, standard_check_result_cb(callback));
}

function readlink(fs, context, path, callback) {
  if(!pathCheck(path, callback)) return;
  read_link(context, path, standard_check_result_cb(callback));
}

function lstat(fs, context, path, callback) {
  if(!pathCheck(path, callback)) return;

  function check_result(error, result) {
    if(error) {
      callback(error);
    } else {
      var stats = new Stats(result, fs.name);
      callback(null, stats);
    }
  }

  lstat_file(context, path, check_result);
}

function truncate(fs, context, path, length, callback) {
  // NOTE: length is optional
  callback = arguments[arguments.length - 1];
  length = length || 0;

  if(!pathCheck(path, callback)) return;
  truncate_file(context, path, length, standard_check_result_cb(callback));
}

function ftruncate(fs, context, fd, length, callback) {
  // NOTE: length is optional
  callback = arguments[arguments.length - 1];
  length = length || 0;

  var ofd = fs.openFiles[fd];
  if(!ofd) {
    callback(new Errors.EBADF());
  } else if(!_(ofd.flags).contains(O_WRITE)) {
    callback(new Errors.EBADF('descriptor does not permit writing'));
  } else {
    ftruncate_file(context, ofd, length, standard_check_result_cb(callback));
  }
}

module.exports = {
  ensureRootDirectory: ensure_root_directory,
  open: open,
  close: close,
  mknod: mknod,
  mkdir: mkdir,
  rmdir: rmdir,
  unlink: unlink,
  stat: stat,
  fstat: fstat,
  link: link,
  read: read,
  readFile: readFile,
  write: write,
  writeFile: writeFile,
  appendFile: appendFile,
  exists: exists,
  getxattr: getxattr,
  fgetxattr: fgetxattr,
  setxattr: setxattr,
  fsetxattr: fsetxattr,
  removexattr: removexattr,
  fremovexattr: fremovexattr,
  lseek: lseek,
  readdir: readdir,
  utimes: utimes,
  futimes: futimes,
  rename: rename,
  symlink: symlink,
  readlink: readlink,
  lstat: lstat,
  truncate: truncate,
  ftruncate: ftruncate
};

},{"../../lib/nodash.js":53,"../buffer.js":55,"../constants.js":56,"../directory-entry.js":57,"../encoding.js":58,"../errors.js":59,"../node.js":64,"../open-file-description.js":65,"../path.js":66,"../stats.js":74,"../super-node.js":75}],61:[function(require,module,exports){
var _ = require('../../lib/nodash.js');

var isNullPath = require('../path.js').isNull;
var nop = require('../shared.js').nop;

var Constants = require('../constants.js');
var FILE_SYSTEM_NAME = Constants.FILE_SYSTEM_NAME;
var FS_FORMAT = Constants.FS_FORMAT;
var FS_READY = Constants.FS_READY;
var FS_PENDING = Constants.FS_PENDING;
var FS_ERROR = Constants.FS_ERROR;
var FS_NODUPEIDCHECK = Constants.FS_NODUPEIDCHECK;

var providers = require('../providers/index.js');

var Shell = require('../shell/shell.js');
var Intercom = require('../../lib/intercom.js');
var FSWatcher = require('../fs-watcher.js');
var Errors = require('../errors.js');
var defaultGuidFn = require('../shared.js').guid;

var STDIN = Constants.STDIN;
var STDOUT = Constants.STDOUT;
var STDERR = Constants.STDERR;
var FIRST_DESCRIPTOR = Constants.FIRST_DESCRIPTOR;

// The core fs operations live on impl
var impl = require('./implementation.js');

// node.js supports a calling pattern that leaves off a callback.
function maybeCallback(callback) {
  if(typeof callback === "function") {
    return callback;
  }
  return function(err) {
    if(err) {
      throw err;
    }
  };
}

/**
 * FileSystem
 *
 * A FileSystem takes an `options` object, which can specify a number of,
 * options.  All options are optional, and include:
 *
 * name: the name of the file system, defaults to "local"
 *
 * flags: one or more flags to use when creating/opening the file system.
 *        For example: "FORMAT" will cause the file system to be formatted.
 *        No explicit flags are set by default.
 *
 * provider: an explicit storage provider to use for the file
 *           system's database context provider.  A number of context
 *           providers are included (see /src/providers), and users
 *           can write one of their own and pass it in to be used.
 *           By default an IndexedDB provider is used.
 *
 * guid: a function for generating unique IDs for nodes in the filesystem.
 *       Use this to override the built-in UUID generation. (Used mainly for tests).
 *
 * callback: a callback function to be executed when the file system becomes
 *           ready for use. Depending on the context provider used, this might
 *           be right away, or could take some time. The callback should expect
 *           an `error` argument, which will be null if everything worked.  Also
 *           users should check the file system's `readyState` and `error`
 *           properties to make sure it is usable.
 */
function FileSystem(options, callback) {
  options = options || {};
  callback = callback || nop;

  var flags = options.flags;
  var guid = options.guid ? options.guid : defaultGuidFn;
  var provider = options.provider || new providers.Default(options.name || FILE_SYSTEM_NAME);
  // If we're given a provider, match its name unless we get an explicit name
  var name = options.name || provider.name;
  var forceFormatting = _(flags).contains(FS_FORMAT);

  var fs = this;
  fs.readyState = FS_PENDING;
  fs.name = name;
  fs.error = null;

  fs.stdin = STDIN;
  fs.stdout = STDOUT;
  fs.stderr = STDERR;

  // Safely expose the list of open files and file
  // descriptor management functions
  var openFiles = {};
  var nextDescriptor = FIRST_DESCRIPTOR;
  Object.defineProperty(this, "openFiles", {
    get: function() { return openFiles; }
  });
  this.allocDescriptor = function(openFileDescription) {
    var fd = nextDescriptor ++;
    openFiles[fd] = openFileDescription;
    return fd;
  };
  this.releaseDescriptor = function(fd) {
    delete openFiles[fd];
  };

  // Safely expose the operation queue
  var queue = [];
  this.queueOrRun = function(operation) {
    var error;

    if(FS_READY == fs.readyState) {
      operation.call(fs);
    } else if(FS_ERROR == fs.readyState) {
      error = new Errors.EFILESYSTEMERROR('unknown error');
    } else {
      queue.push(operation);
    }

    return error;
  };
  function runQueued() {
    queue.forEach(function(operation) {
      operation.call(this);
    }.bind(fs));
    queue = null;
  }

  // We support the optional `options` arg from node, but ignore it
  this.watch = function(filename, options, listener) {
    if(isNullPath(filename)) {
      throw new Error('Path must be a string without null bytes.');
    }
    if(typeof options === 'function') {
      listener = options;
      options = {};
    }
    options = options || {};
    listener = listener || nop;

    var watcher = new FSWatcher();
    watcher.start(filename, false, options.recursive);
    watcher.on('change', listener);

    return watcher;
  };

  // Deal with various approaches to node ID creation
  function wrappedGuidFn(context) {
    return function(callback) {
      // Skip the duplicate ID check if asked to
      if(_(flags).contains(FS_NODUPEIDCHECK)) {
        callback(null, guid());
        return;
      }

      // Otherwise (default) make sure this id is unused first
      function guidWithCheck(callback) {
        var id = guid();
        context.getObject(id, function(err, value) {
          if(err) {
            callback(err);
            return;
          }

          // If this id is unused, use it, otherwise find another
          if(!value) {
            callback(null, id);
          } else {
            guidWithCheck(callback);
          }
        });
      }
      guidWithCheck(callback);
    };
  }

  // Let other instances (in this or other windows) know about
  // any changes to this fs instance.
  function broadcastChanges(changes) {
    if(!changes.length) {
      return;
    }
    var intercom = Intercom.getInstance();
    changes.forEach(function(change) {
      intercom.emit(change.event, change.path);
    });
  }

  // Open file system storage provider
  provider.open(function(err) {
    function complete(error) {
      function wrappedContext(methodName) {
        var context = provider[methodName]();
        context.flags = flags;
        context.changes = [];
        context.guid = wrappedGuidFn(context);

        // When the context is finished, let the fs deal with any change events
        context.close = function() {
          var changes = context.changes;
          broadcastChanges(changes);
          changes.length = 0;
        };

        return context;
      }

      // Wrap the provider so we can extend the context with fs flags and
      // an array of changes (e.g., watch event 'change' and 'rename' events
      // for paths updated during the lifetime of the context). From this
      // point forward we won't call open again, so it's safe to drop it.
      fs.provider = {
        openReadWriteContext: function() {
          return wrappedContext('getReadWriteContext');
        },
        openReadOnlyContext: function() {
          return wrappedContext('getReadOnlyContext');
        }
      };

      if(error) {
        fs.readyState = FS_ERROR;
      } else {
        fs.readyState = FS_READY;
      }
      runQueued();
      callback(error, fs);
    }

    if(err) {
      return complete(err);
    }

    var context = provider.getReadWriteContext();
    context.guid = wrappedGuidFn(context);

    // Mount the filesystem, formatting if necessary
    if(forceFormatting) {
      // Wipe the storage provider, then write root block
      context.clear(function(err) {
        if(err) {
          return complete(err);
        }
        impl.ensureRootDirectory(context, complete);
      });
    } else {
      // Use existing (or create new) root and mount
      impl.ensureRootDirectory(context, complete);
    }
  });
}

// Expose storage providers on FileSystem constructor
FileSystem.providers = providers;

/**
 * Public API for FileSystem
 */
[
  'open',
  'close',
  'mknod',
  'mkdir',
  'rmdir',
  'stat',
  'fstat',
  'link',
  'unlink',
  'read',
  'readFile',
  'write',
  'writeFile',
  'appendFile',
  'exists',
  'lseek',
  'readdir',
  'rename',
  'readlink',
  'symlink',
  'lstat',
  'truncate',
  'ftruncate',
  'utimes',
  'futimes',
  'setxattr',
  'getxattr',
  'fsetxattr',
  'fgetxattr',
  'removexattr',
  'fremovexattr'
].forEach(function(methodName) {
  FileSystem.prototype[methodName] = function() {
    var fs = this;
    var args = Array.prototype.slice.call(arguments, 0);
    var lastArgIndex = args.length - 1;

    // We may or may not get a callback, and since node.js supports
    // fire-and-forget style fs operations, we have to dance a bit here.
    var missingCallback = typeof args[lastArgIndex] !== 'function';
    var callback = maybeCallback(args[lastArgIndex]);

    var error = fs.queueOrRun(function() {
      var context = fs.provider.openReadWriteContext();

      // Fail early if the filesystem is in an error state (e.g.,
      // provider failed to open.
      if(FS_ERROR === fs.readyState) {
        var err = new Errors.EFILESYSTEMERROR('filesystem unavailable, operation canceled');
        return callback.call(fs, err);
      }

      // Wrap the callback so we can explicitly close the context
      function complete() {
        context.close();
        callback.apply(fs, arguments);
      }

      // Either add or replace the callback with our wrapper complete()
      if(missingCallback) {
        args.push(complete);
      } else {
        args[lastArgIndex] = complete;
      }

      // Forward this call to the impl's version, using the following
      // call signature, with complete() as the callback/last-arg now:
      // fn(fs, context, arg0, arg1, ... , complete);
      var fnArgs = [fs, context].concat(args);
      impl[methodName].apply(null, fnArgs);
    });
    if(error) {
      callback(error);
    }
  };
});

FileSystem.prototype.Shell = function(options) {
  return new Shell(this, options);
};

module.exports = FileSystem;

},{"../../lib/intercom.js":52,"../../lib/nodash.js":53,"../constants.js":56,"../errors.js":59,"../fs-watcher.js":62,"../path.js":66,"../providers/index.js":67,"../shared.js":71,"../shell/shell.js":73,"./implementation.js":60}],62:[function(require,module,exports){
var EventEmitter = require('../lib/eventemitter.js');
var Path = require('./path.js');
var Intercom = require('../lib/intercom.js');

/**
 * FSWatcher based on node.js' FSWatcher
 * see https://github.com/joyent/node/blob/master/lib/fs.js
 */
function FSWatcher() {
  EventEmitter.call(this);
  var self = this;
  var recursive = false;
  var recursivePathPrefix;
  var filename;

  function onchange(path) {
    // Watch for exact filename, or parent path when recursive is true.
    if(filename === path || (recursive && path.indexOf(recursivePathPrefix) === 0)) {
      self.trigger('change', 'change', path);
    }
  }

  // We support, but ignore the second arg, which node.js uses.
  self.start = function(filename_, persistent_, recursive_) {
    // Bail if we've already started (and therefore have a filename);
    if(filename) {
      return;
    }

    if(Path.isNull(filename_)) {
      throw new Error('Path must be a string without null bytes.');
    }

    // TODO: get realpath for symlinks on filename...

    // Filer's Path.normalize strips trailing slashes, which we use here.
    // See https://github.com/js-platform/filer/issues/105
    filename = Path.normalize(filename_);

    // Whether to watch beneath this path or not
    recursive = recursive_ === true;
    // If recursive, construct a path prefix portion for comparisons later
    // (i.e., '/path' becomes '/path/' so we can search within a filename for the
    // prefix). We also take care to allow for '/' on its own.
    if(recursive) {
      recursivePathPrefix = filename === '/' ? '/' : filename + '/';
    }

    var intercom = Intercom.getInstance();
    intercom.on('change', onchange);
  };

  self.close = function() {
    var intercom = Intercom.getInstance();
    intercom.off('change', onchange);
    self.removeAllListeners('change');
  };
}
FSWatcher.prototype = new EventEmitter();
FSWatcher.prototype.constructor = FSWatcher;

module.exports = FSWatcher;

},{"../lib/eventemitter.js":51,"../lib/intercom.js":52,"./path.js":66}],63:[function(require,module,exports){
module.exports = {
  FileSystem: require('./filesystem/interface.js'),
  Buffer: require('./buffer.js'),
  Path: require('./path.js'),
  Errors: require('./errors.js')
};

},{"./buffer.js":55,"./errors.js":59,"./filesystem/interface.js":61,"./path.js":66}],64:[function(require,module,exports){
var MODE_FILE = require('./constants.js').MODE_FILE;

function Node(options) {
  var now = Date.now();

  this.id = options.id;
  this.mode = options.mode || MODE_FILE;  // node type (file, directory, etc)
  this.size = options.size || 0; // size (bytes for files, entries for directories)
  this.atime = options.atime || now; // access time (will mirror ctime after creation)
  this.ctime = options.ctime || now; // creation/change time
  this.mtime = options.mtime || now; // modified time
  this.flags = options.flags || []; // file flags
  this.xattrs = options.xattrs || {}; // extended attributes
  this.nlinks = options.nlinks || 0; // links count
  this.version = options.version || 0; // node version
  this.blksize = undefined; // block size
  this.nblocks = 1; // blocks count
  this.data = options.data; // id for data object
}

// Make sure the options object has an id on property,
// either from caller or one we generate using supplied guid fn.
function ensureID(options, prop, callback) {
  if(options[prop]) {
    callback(null);
  } else {
    options.guid(function(err, id) {
      options[prop] = id;
      callback(err);
    });
  }
}

Node.create = function(options, callback) {
  // We expect both options.id and options.data to be provided/generated.
  ensureID(options, 'id', function(err) {
    if(err) {
      callback(err);
      return;
    }

    ensureID(options, 'data', function(err) {
      if(err) {
        callback(err);
        return;
      }

      callback(null, new Node(options));
    });
  });
};

module.exports = Node;

},{"./constants.js":56}],65:[function(require,module,exports){
module.exports = function OpenFileDescription(path, id, flags, position) {
  this.path = path;
  this.id = id;
  this.flags = flags;
  this.position = position;
};

},{}],66:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// Based on https://github.com/joyent/node/blob/41e53e557992a7d552a8e23de035f9463da25c99/lib/path.js

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
      /^(\/?)([\s\S]+\/(?!$)|\/)?((?:\.{1,2}$|[\s\S]+?)?(\.[^.\/]*)?)$/;
var splitPath = function(filename) {
  var result = splitPathRe.exec(filename);
  return [result[1] || '', result[2] || '', result[3] || '', result[4] || ''];
};

// path.resolve([from ...], to)
function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    // XXXidbfs: we don't have process.cwd() so we use '/' as a fallback
    var path = (i >= 0) ? arguments[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string' || !path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(resolvedPath.split('/').filter(function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
}

// path.normalize(path)
function normalize(path) {
  var isAbsolute = path.charAt(0) === '/',
      trailingSlash = path.substr(-1) === '/';

  // Normalize the path
  path = normalizeArray(path.split('/').filter(function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  /*
   if (path && trailingSlash) {
   path += '/';
   }
   */

  return (isAbsolute ? '/' : '') + path;
}

function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(paths.filter(function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
}

// path.relative(from, to)
function relative(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

function basename(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  // XXXidbfs: node.js just does `return f`
  return f === "" ? "/" : f;
}

function extname(path) {
  return splitPath(path)[3];
}

function isAbsolute(path) {
  if(path.charAt(0) === '/') {
    return true;
  }
  return false;
}

function isNull(path) {
  if (('' + path).indexOf('\u0000') !== -1) {
    return true;
  }
  return false;
}

// XXXidbfs: we don't support path.exists() or path.existsSync(), which
// are deprecated, and need a FileSystem instance to work. Use fs.stat().

module.exports = {
  normalize: normalize,
  resolve: resolve,
  join: join,
  relative: relative,
  sep: '/',
  delimiter: ':',
  dirname: dirname,
  basename: basename,
  extname: extname,
  isAbsolute: isAbsolute,
  isNull: isNull
};

},{}],67:[function(require,module,exports){
var IndexedDB = require('./indexeddb.js');
var WebSQL = require('./websql.js');
var Memory = require('./memory.js');

module.exports = {
  IndexedDB: IndexedDB,
  WebSQL: WebSQL,
  Memory: Memory,

  /**
   * Convenience Provider references
   */

  // The default provider to use when none is specified
  Default: IndexedDB,

  // The Fallback provider does automatic fallback checks
  Fallback: (function() {
    if(IndexedDB.isSupported()) {
      return IndexedDB;
    }

    if(WebSQL.isSupported()) {
      return WebSQL;
    }

    function NotSupported() {
      throw "[Filer Error] Your browser doesn't support IndexedDB or WebSQL.";
    }
    NotSupported.isSupported = function() {
      return false;
    };
    return NotSupported;
  }())
};

},{"./indexeddb.js":68,"./memory.js":69,"./websql.js":70}],68:[function(require,module,exports){
(function (global){
var FILE_SYSTEM_NAME = require('../constants.js').FILE_SYSTEM_NAME;
var FILE_STORE_NAME = require('../constants.js').FILE_STORE_NAME;
var IDB_RW = require('../constants.js').IDB_RW;
var IDB_RO = require('../constants.js').IDB_RO;
var Errors = require('../errors.js');
var FilerBuffer = require('../buffer.js');

var indexedDB = global.indexedDB       ||
                global.mozIndexedDB    ||
                global.webkitIndexedDB ||
                global.msIndexedDB;

function IndexedDBContext(db, mode) {
  var transaction = db.transaction(FILE_STORE_NAME, mode);
  this.objectStore = transaction.objectStore(FILE_STORE_NAME);
}

IndexedDBContext.prototype.clear = function(callback) {
  try {
    var request = this.objectStore.clear();
    request.onsuccess = function(event) {
      callback();
    };
    request.onerror = function(error) {
      callback(error);
    };
  } catch(e) {
    callback(e);
  }
};

function _get(objectStore, key, callback) {
  try {
    var request = objectStore.get(key);
    request.onsuccess = function onsuccess(event) {
      var result = event.target.result;
      callback(null, result);
    };
    request.onerror = function onerror(error) {
      callback(error);
    };
  } catch(e) {
    callback(e);
  }
}
IndexedDBContext.prototype.getObject = function(key, callback) {
  _get(this.objectStore, key, callback);
};
IndexedDBContext.prototype.getBuffer = function(key, callback) {
  _get(this.objectStore, key, function(err, arrayBuffer) {
    if(err) {
      return callback(err);
    }
    callback(null, new FilerBuffer(arrayBuffer));
  });
};

function _put(objectStore, key, value, callback) {
  try {
    var request = objectStore.put(value, key);
    request.onsuccess = function onsuccess(event) {
      var result = event.target.result;
      callback(null, result);
    };
    request.onerror = function onerror(error) {
      callback(error);
    };
  } catch(e) {
    callback(e);
  }
}
IndexedDBContext.prototype.putObject = function(key, value, callback) {
  _put(this.objectStore, key, value, callback);
};
IndexedDBContext.prototype.putBuffer = function(key, uint8BackedBuffer, callback) {
  _put(this.objectStore, key, uint8BackedBuffer.buffer, callback);
};

IndexedDBContext.prototype.delete = function(key, callback) {
  try {
    var request = this.objectStore.delete(key);
    request.onsuccess = function onsuccess(event) {
      var result = event.target.result;
      callback(null, result);
    };
    request.onerror = function(error) {
      callback(error);
    };
  } catch(e) {
    callback(e);
  }
};


function IndexedDB(name) {
  this.name = name || FILE_SYSTEM_NAME;
  this.db = null;
}
IndexedDB.isSupported = function() {
  return !!indexedDB;
};

IndexedDB.prototype.open = function(callback) {
  var that = this;

  // Bail if we already have a db open
  if(that.db) {
    return callback();
  }

  // NOTE: we're not using versioned databases.
  var openRequest = indexedDB.open(that.name);

  // If the db doesn't exist, we'll create it
  openRequest.onupgradeneeded = function onupgradeneeded(event) {
    var db = event.target.result;

    if(db.objectStoreNames.contains(FILE_STORE_NAME)) {
      db.deleteObjectStore(FILE_STORE_NAME);
    }
    db.createObjectStore(FILE_STORE_NAME);
  };

  openRequest.onsuccess = function onsuccess(event) {
    that.db = event.target.result;
    callback();
  };
  openRequest.onerror = function onerror(error) {
    callback(new Errors.EINVAL('IndexedDB cannot be accessed. If private browsing is enabled, disable it.'));
  };
};
IndexedDB.prototype.getReadOnlyContext = function() {
  // Due to timing issues in Chrome with readwrite vs. readonly indexeddb transactions
  // always use readwrite so we can make sure pending commits finish before callbacks.
  // See https://github.com/js-platform/filer/issues/128
  return new IndexedDBContext(this.db, IDB_RW);
};
IndexedDB.prototype.getReadWriteContext = function() {
  return new IndexedDBContext(this.db, IDB_RW);
};

module.exports = IndexedDB;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../buffer.js":55,"../constants.js":56,"../errors.js":59}],69:[function(require,module,exports){
var FILE_SYSTEM_NAME = require('../constants.js').FILE_SYSTEM_NAME;
// NOTE: prefer setImmediate to nextTick for proper recursion yielding.
// see https://github.com/js-platform/filer/pull/24
var asyncCallback = require('../../lib/async.js').setImmediate;

/**
 * Make shared in-memory DBs possible when using the same name.
 */
var createDB = (function() {
  var pool = {};
  return function getOrCreate(name) {
    if(!pool.hasOwnProperty(name)) {
      pool[name] = {};
    }
    return pool[name];
  };
}());

function MemoryContext(db, readOnly) {
  this.readOnly = readOnly;
  this.objectStore = db;
}

MemoryContext.prototype.clear = function(callback) {
  if(this.readOnly) {
    asyncCallback(function() {
      callback("[MemoryContext] Error: write operation on read only context");
    });
    return;
  }
  var objectStore = this.objectStore;
  Object.keys(objectStore).forEach(function(key){
    delete objectStore[key];
  });
  asyncCallback(callback);
};

// Memory context doesn't care about differences between Object and Buffer
MemoryContext.prototype.getObject =
MemoryContext.prototype.getBuffer =
function(key, callback) {
  var that = this;
  asyncCallback(function() {
    callback(null, that.objectStore[key]);
  });
};
MemoryContext.prototype.putObject =
MemoryContext.prototype.putBuffer =
function(key, value, callback) {
  if(this.readOnly) {
    asyncCallback(function() {
      callback("[MemoryContext] Error: write operation on read only context");
    });
    return;
  }
  this.objectStore[key] = value;
  asyncCallback(callback);
};

MemoryContext.prototype.delete = function(key, callback) {
  if(this.readOnly) {
    asyncCallback(function() {
      callback("[MemoryContext] Error: write operation on read only context");
    });
    return;
  }
  delete this.objectStore[key];
  asyncCallback(callback);
};


function Memory(name) {
  this.name = name || FILE_SYSTEM_NAME;
}
Memory.isSupported = function() {
  return true;
};

Memory.prototype.open = function(callback) {
  this.db = createDB(this.name);
  asyncCallback(callback);
};
Memory.prototype.getReadOnlyContext = function() {
  return new MemoryContext(this.db, true);
};
Memory.prototype.getReadWriteContext = function() {
  return new MemoryContext(this.db, false);
};

module.exports = Memory;

},{"../../lib/async.js":50,"../constants.js":56}],70:[function(require,module,exports){
(function (global){
var FILE_SYSTEM_NAME = require('../constants.js').FILE_SYSTEM_NAME;
var FILE_STORE_NAME = require('../constants.js').FILE_STORE_NAME;
var WSQL_VERSION = require('../constants.js').WSQL_VERSION;
var WSQL_SIZE = require('../constants.js').WSQL_SIZE;
var WSQL_DESC = require('../constants.js').WSQL_DESC;
var Errors = require('../errors.js');
var FilerBuffer = require('../buffer.js');
var base64ArrayBuffer = require('base64-arraybuffer');

function WebSQLContext(db, isReadOnly) {
  var that = this;
  this.getTransaction = function(callback) {
    if(that.transaction) {
      callback(that.transaction);
      return;
    }
    // Either do readTransaction() (read-only) or transaction() (read/write)
    db[isReadOnly ? 'readTransaction' : 'transaction'](function(transaction) {
      that.transaction = transaction;
      callback(transaction);
    });
  };
}

WebSQLContext.prototype.clear = function(callback) {
  function onError(transaction, error) {
    callback(error);
  }
  function onSuccess(transaction, result) {
    callback(null);
  }
  this.getTransaction(function(transaction) {
    transaction.executeSql("DELETE FROM " + FILE_STORE_NAME + ";",
                           [], onSuccess, onError);
  });
};

function _get(getTransaction, key, callback) {
  function onSuccess(transaction, result) {
    // If the key isn't found, return null
    var value = result.rows.length === 0 ? null : result.rows.item(0).data;
    callback(null, value);
  }
  function onError(transaction, error) {
    callback(error);
  }
  getTransaction(function(transaction) {
    transaction.executeSql("SELECT data FROM " + FILE_STORE_NAME + " WHERE id = ? LIMIT 1;",
                           [key], onSuccess, onError);
  });
}
WebSQLContext.prototype.getObject = function(key, callback) {
  _get(this.getTransaction, key, function(err, result) {
    if(err) {
      return callback(err);
    }

    try {
      if(result) {
        result = JSON.parse(result);
      }
    } catch(e) {
      return callback(e);
    }

    callback(null, result);
  });
};
WebSQLContext.prototype.getBuffer = function(key, callback) {
  _get(this.getTransaction, key, function(err, result) {
    if(err) {
      return callback(err);
    }

    // Deal with zero-length ArrayBuffers, which will be encoded as ''
    if(result || result === '') {
      var arrayBuffer = base64ArrayBuffer.decode(result);
      result = new FilerBuffer(arrayBuffer);
    }

    callback(null, result);
  });
};

function _put(getTransaction, key, value, callback) {
  function onSuccess(transaction, result) {
    callback(null);
  }
  function onError(transaction, error) {
    callback(error);
  }
  getTransaction(function(transaction) {
    transaction.executeSql("INSERT OR REPLACE INTO " + FILE_STORE_NAME + " (id, data) VALUES (?, ?);",
                           [key, value], onSuccess, onError);
  });
}
WebSQLContext.prototype.putObject = function(key, value, callback) {
  var json = JSON.stringify(value);
  _put(this.getTransaction, key, json, callback);
};
WebSQLContext.prototype.putBuffer = function(key, uint8BackedBuffer, callback) {
  var base64 = base64ArrayBuffer.encode(uint8BackedBuffer.buffer);
  _put(this.getTransaction, key, base64, callback);
};

WebSQLContext.prototype.delete = function(key, callback) {
  function onSuccess(transaction, result) {
    callback(null);
  }
  function onError(transaction, error) {
    callback(error);
  }
  this.getTransaction(function(transaction) {
    transaction.executeSql("DELETE FROM " + FILE_STORE_NAME + " WHERE id = ?;",
                           [key], onSuccess, onError);
  });
};


function WebSQL(name) {
  this.name = name || FILE_SYSTEM_NAME;
  this.db = null;
}
WebSQL.isSupported = function() {
  return !!global.openDatabase;
};

WebSQL.prototype.open = function(callback) {
  var that = this;

  // Bail if we already have a db open
  if(that.db) {
    return callback();
  }

  var db = global.openDatabase(that.name, WSQL_VERSION, WSQL_DESC, WSQL_SIZE);
  if(!db) {
    callback("[WebSQL] Unable to open database.");
    return;
  }

  function onError(transaction, error) {
    if (error.code === 5) {
      callback(new Errors.EINVAL('WebSQL cannot be accessed. If private browsing is enabled, disable it.'));
    }
    callback(error);
  }
  function onSuccess(transaction, result) {
    that.db = db;
    callback();
  }

  // Create the table and index we'll need to store the fs data.
  db.transaction(function(transaction) {
    function createIndex(transaction) {
      transaction.executeSql("CREATE INDEX IF NOT EXISTS idx_" + FILE_STORE_NAME + "_id" +
                             " on " + FILE_STORE_NAME + " (id);",
                             [], onSuccess, onError);
    }
    transaction.executeSql("CREATE TABLE IF NOT EXISTS " + FILE_STORE_NAME + " (id unique, data TEXT);",
                           [], createIndex, onError);
  });
};
WebSQL.prototype.getReadOnlyContext = function() {
  return new WebSQLContext(this.db, true);
};
WebSQL.prototype.getReadWriteContext = function() {
  return new WebSQLContext(this.db, false);
};

module.exports = WebSQL;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../buffer.js":55,"../constants.js":56,"../errors.js":59,"base64-arraybuffer":54}],71:[function(require,module,exports){
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  }).toUpperCase();
}

function nop() {}

/**
 * Convert a Uint8Array to a regular array
 */
function u8toArray(u8) {
  var array = [];
  var len = u8.length;
  for(var i = 0; i < len; i++) {
    array[i] = u8[i];
  }
  return array;
}

module.exports = {
  guid: guid,
  u8toArray: u8toArray,
  nop: nop
};

},{}],72:[function(require,module,exports){
var defaults = require('../constants.js').ENVIRONMENT;

module.exports = function Environment(env) {
  env = env || {};
  env.TMP = env.TMP || defaults.TMP;
  env.PATH = env.PATH || defaults.PATH;

  this.get = function(name) {
    return env[name];
  };

  this.set = function(name, value) {
    env[name] = value;
  };
};

},{"../constants.js":56}],73:[function(require,module,exports){
var Path = require('../path.js');
var Errors = require('../errors.js');
var Environment = require('./environment.js');
var async = require('../../lib/async.js');
var Encoding = require('../encoding.js');

function Shell(fs, options) {
  options = options || {};

  var env = new Environment(options.env);
  var cwd = '/';

  /**
   * The bound FileSystem (cannot be changed)
   */
  Object.defineProperty(this, 'fs', {
    get: function() { return fs; },
    enumerable: true
  });

  /**
   * The shell's environment (e.g., for things like
   * path, tmp, and other env vars). Use env.get()
   * and env.set() to work with variables.
   */
  Object.defineProperty(this, 'env', {
    get: function() { return env; },
    enumerable: true
  });

  /**
   * Change the current working directory. We
   * include `cd` on the `this` vs. proto so that
   * we can access cwd without exposing it externally.
   */
  this.cd = function(path, callback) {
    path = Path.resolve(cwd, path);
    // Make sure the path actually exists, and is a dir
    fs.stat(path, function(err, stats) {
      if(err) {
        callback(new Errors.ENOTDIR(null, path));
        return;
      }
      if(stats.type === 'DIRECTORY') {
        cwd = path;
        callback();
      } else {
        callback(new Errors.ENOTDIR(null, path));
      }
    });
  };

  /**
   * Get the current working directory (changed with `cd()`)
   */
  this.pwd = function() {
    return cwd;
  };
}

/**
 * Execute the .js command located at `path`. Such commands
 * should assume the existence of 3 arguments, which will be
 * defined at runtime:
 *
 *   * fs - the current shell's bound filesystem object
 *   * args - a list of arguments for the command, or an empty list if none
 *   * callback - a callback function(error, result) to call when done.
 *
 * The .js command's contents should be the body of a function
 * that looks like this:
 *
 * function(fs, args, callback) {
 *   // .js code here
 * }
 */
Shell.prototype.exec = function(path, args, callback) {
  /* jshint evil:true */
  var sh = this;
  var fs = sh.fs;
  if(typeof args === 'function') {
    callback = args;
    args = [];
  }
  args = args || [];
  callback = callback || function(){};
  path = Path.resolve(sh.pwd(), path);

  fs.readFile(path, "utf8", function(error, data) {
    if(error) {
      callback(error);
      return;
    }
    try {
      var cmd = new Function('fs', 'args', 'callback', data);
      cmd(fs, args, callback);
    } catch(e) {
      callback(e);
    }
  });
};

/**
 * Create a file if it does not exist, or update access and
 * modified times if it does. Valid options include:
 *
 *  * updateOnly - whether to create the file if missing (defaults to false)
 *  * date - use the provided Date value instead of current date/time
 */
Shell.prototype.touch = function(path, options, callback) {
  var sh = this;
  var fs = sh.fs;
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  callback = callback || function(){};
  path = Path.resolve(sh.pwd(), path);

  function createFile(path) {
    fs.writeFile(path, '', callback);
  }

  function updateTimes(path) {
    var now = Date.now();
    var atime = options.date || now;
    var mtime = options.date || now;

    fs.utimes(path, atime, mtime, callback);
  }

  fs.stat(path, function(error, stats) {
    if(error) {
      if(options.updateOnly === true) {
        callback();
      } else {
        createFile(path);
      }
    } else {
      updateTimes(path);
    }
  });
};

/**
 * Concatenate multiple files into a single String, with each
 * file separated by a newline. The `files` argument should
 * be a String (path to single file) or an Array of Strings
 * (multiple file paths).
 */
Shell.prototype.cat = function(files, callback) {
  var sh = this;
  var fs = sh.fs;
  var all = '';
  callback = callback || function(){};

  if(!files) {
    callback(new Errors.EINVAL('Missing files argument'));
    return;
  }

  files = typeof files === 'string' ? [ files ] : files;

  function append(item, callback) {
    var filename = Path.resolve(sh.pwd(), item);
    fs.readFile(filename, 'utf8', function(error, data) {
      if(error) {
        callback(error);
        return;
      }
      all += data + '\n';
      callback();
    });
  }

  async.eachSeries(files, append, function(error) {
    if(error) {
      callback(error);
    } else {
      callback(null, all.replace(/\n$/, ''));
    }
  });
};

/**
 * Get the listing of a directory, returning an array of
 * file entries in the following form:
 *
 * {
 *   path: <String> the basename of the directory entry
 *   links: <Number> the number of links to the entry
 *   size: <Number> the size in bytes of the entry
 *   modified: <Number> the last modified date/time
 *   type: <String> the type of the entry
 *   contents: <Array> an optional array of child entries
 * }
 *
 * By default ls() gives a shallow listing. If you want
 * to follow directories as they are encountered, use
 * the `recursive=true` option.
 */
Shell.prototype.ls = function(dir, options, callback) {
  var sh = this;
  var fs = sh.fs;
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  callback = callback || function(){};

  if(!dir) {
    callback(new Errors.EINVAL('Missing dir argument'));
    return;
  }

  function list(path, callback) {
    var pathname = Path.resolve(sh.pwd(), path);
    var result = [];

    fs.readdir(pathname, function(error, entries) {
      if(error) {
        callback(error);
        return;
      }

      function getDirEntry(name, callback) {
        name = Path.join(pathname, name);
        fs.stat(name, function(error, stats) {
          if(error) {
            callback(error);
            return;
          }
          var entry = {
            path: Path.basename(name),
            links: stats.nlinks,
            size: stats.size,
            modified: stats.mtime,
            type: stats.type
          };

          if(options.recursive && stats.type === 'DIRECTORY') {
            list(Path.join(pathname, entry.path), function(error, items) {
              if(error) {
                callback(error);
                return;
              }
              entry.contents = items;
              result.push(entry);
              callback();
            });
          } else {
            result.push(entry);
            callback();
          }
        });
      }

      async.eachSeries(entries, getDirEntry, function(error) {
        callback(error, result);
      });
    });
  }

  list(dir, callback);
};

/**
 * Removes the file or directory at `path`. If `path` is a file
 * it will be removed. If `path` is a directory, it will be
 * removed if it is empty, otherwise the callback will receive
 * an error. In order to remove non-empty directories, use the
 * `recursive=true` option.
 */
Shell.prototype.rm = function(path, options, callback) {
  var sh = this;
  var fs = sh.fs;
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  callback = callback || function(){};

  if(!path) {
    callback(new Errors.EINVAL('Missing path argument'));
    return;
  }

  function remove(pathname, callback) {
    pathname = Path.resolve(sh.pwd(), pathname);
    fs.stat(pathname, function(error, stats) {
      if(error) {
        callback(error);
        return;
      }

      // If this is a file, delete it and we're done
      if(stats.type === 'FILE') {
        fs.unlink(pathname, callback);
        return;
      }

      // If it's a dir, check if it's empty
      fs.readdir(pathname, function(error, entries) {
        if(error) {
          callback(error);
          return;
        }

        // If dir is empty, delete it and we're done
        if(entries.length === 0) {
          fs.rmdir(pathname, callback);
          return;
        }

        // If not, see if we're allowed to delete recursively
        if(!options.recursive) {
          callback(new Errors.ENOTEMPTY(null, pathname));
          return;
        }

        // Remove each dir entry recursively, then delete the dir.
        entries = entries.map(function(filename) {
          // Root dir entries absolutely
          return Path.join(pathname, filename);
        });
        async.eachSeries(entries, remove, function(error) {
          if(error) {
            callback(error);
            return;
          }
          fs.rmdir(pathname, callback);
        });
      });
    });
  }

  remove(path, callback);
};

/**
 * Gets the path to the temporary directory, creating it if not
 * present. The directory used is the one specified in
 * env.TMP. The callback receives (error, tempDirName).
 */
Shell.prototype.tempDir = function(callback) {
  var sh = this;
  var fs = sh.fs;
  var tmp = sh.env.get('TMP');
  callback = callback || function(){};

  // Try and create it, and it will either work or fail
  // but either way it's now there.
  fs.mkdir(tmp, function(err) {
    callback(null, tmp);
  });
};

/**
 * Recursively creates the directory at `path`. If the parent
 * of `path` does not exist, it will be created.
 * Based off EnsureDir by Sam X. Xu
 * https://www.npmjs.org/package/ensureDir
 * MIT License
 */
Shell.prototype.mkdirp = function(path, callback) {
  var sh = this;
  var fs = sh.fs;
  callback = callback || function(){};

  if(!path) {
    callback(new Errors.EINVAL('Missing path argument'));
    return;
  }
  else if (path === '/') {
    callback();
    return;
  }
  function _mkdirp(path, callback) {
    fs.stat(path, function (err, stat) {
      if(stat) {
        if(stat.isDirectory()) {
          callback();
          return;
        }
        else if (stat.isFile()) {
          callback(new Errors.ENOTDIR(null, path));
          return;
        }
      }
      else if (err && err.code !== 'ENOENT') {
        callback(err);
        return;
      }
      else {
        var parent = Path.dirname(path);
        if(parent === '/') {
          fs.mkdir(path, function (err) {
            if (err && err.code != 'EEXIST') {
              callback(err);
              return;
            }
            callback();
            return;
          });
        }
        else {
          _mkdirp(parent, function (err) {
            if (err) return callback(err);
            fs.mkdir(path, function (err) {
              if (err && err.code != 'EEXIST') {
                callback(err);
                return;
              }
              callback();
              return;
            });
          });
        }
      }
    });
  }

  _mkdirp(path, callback);
};

module.exports = Shell;

},{"../../lib/async.js":50,"../encoding.js":58,"../errors.js":59,"../path.js":66,"./environment.js":72}],74:[function(require,module,exports){
var Constants = require('./constants.js');

function Stats(fileNode, devName) {
  this.node = fileNode.id;
  this.dev = devName;
  this.size = fileNode.size;
  this.nlinks = fileNode.nlinks;
  this.atime = fileNode.atime;
  this.mtime = fileNode.mtime;
  this.ctime = fileNode.ctime;
  this.type = fileNode.mode;
}

Stats.prototype.isFile = function() {
  return this.type === Constants.MODE_FILE;
};

Stats.prototype.isDirectory = function() {
  return this.type === Constants.MODE_DIRECTORY;
};

Stats.prototype.isSymbolicLink = function() {
  return this.type === Constants.MODE_SYMBOLIC_LINK;
};

// These will always be false in Filer.
Stats.prototype.isSocket          =
Stats.prototype.isFIFO            =
Stats.prototype.isCharacterDevice =
Stats.prototype.isBlockDevice     =
function() {
  return false;
};

module.exports = Stats;

},{"./constants.js":56}],75:[function(require,module,exports){
var Constants = require('./constants.js');

function SuperNode(options) {
  var now = Date.now();

  this.id = Constants.SUPER_NODE_ID;
  this.mode = Constants.MODE_META;
  this.atime = options.atime || now;
  this.ctime = options.ctime || now;
  this.mtime = options.mtime || now;
  // root node id (randomly generated)
  this.rnode = options.rnode;
}

SuperNode.create = function(options, callback) {
  options.guid(function(err, rnode) {
    if(err) {
      callback(err);
      return;
    }
    options.rnode = options.rnode || rnode;
    callback(null, new SuperNode(options));
  });
};

module.exports = SuperNode;

},{"./constants.js":56}],76:[function(require,module,exports){

;(function(){

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' == typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' == typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    // show <path> with [state]
    } else if ('string' == typeof path) {
      page.show(path, fn);
    // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path){
    if (0 == arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options){
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) window.addEventListener('click', onclick, false);
    if (!dispatch) return;
    var url = location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function(){
    running = false;
    removeEventListener('click', onclick, false);
    removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @param {Boolean} dispatch
   * @return {Context}
   * @api public
   */

  page.show = function(path, state, dispatch){
    var ctx = new Context(path, state);
    if (false !== dispatch) page.dispatch(ctx);
    if (!ctx.unhandled) ctx.pushState();
    return ctx;
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */

  page.replace = function(path, state, init, dispatch){
    var ctx = new Context(path, state);
    ctx.init = init;
    if (null == dispatch) dispatch = true;
    if (dispatch) page.dispatch(ctx);
    ctx.save();
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx){
    var i = 0;

    function next() {
      var fn = page.callbacks[i++];
      if (!fn) return unhandled(ctx);
      fn(ctx, next);
    }

    next();
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    var current = window.location.pathname + window.location.search;
    if (current == ctx.canonicalPath) return;
    page.stop();
    ctx.unhandled = true;
    window.location = ctx.canonicalPath;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' == path[0] && 0 != path.indexOf(base)) path = base + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? path.slice(i + 1) : '';
    this.pathname = ~i ? path.slice(0, i) : path;
    this.params = [];

    // fragment
    this.hash = '';
    if (!~this.path.indexOf('#')) return;
    var parts = this.path.split('#');
    this.path = parts[0];
    this.hash = parts[1] || '';
    this.querystring = this.querystring.split('#')[0];
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function(){
    history.pushState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function(){
    history.replaceState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn){
    var self = this;
    return function(ctx, next){
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Array} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params){
    var keys = this.keys
      , qsIndex = path.indexOf('?')
      , pathname = ~qsIndex ? path.slice(0, qsIndex) : path
      , m = this.regexp.exec(pathname);

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' == typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = undefined !== params[key.name]
          ? params[key.name]
          : val;
      } else {
        params.push(val);
      }
    }

    return true;
  };

  /**
   * Normalize the given path string,
   * returning a regular expression.
   *
   * An empty array should be passed,
   * which will contain the placeholder
   * key names. For example "/user/:id" will
   * then contain ["id"].
   *
   * @param  {String|RegExp|Array} path
   * @param  {Array} keys
   * @param  {Boolean} sensitive
   * @param  {Boolean} strict
   * @return {RegExp}
   * @api private
   */

  function pathtoRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  }

  /**
   * Handle "populate" events.
   */

  function onpopstate(e) {
    if (e.state) {
      var path = e.state.path;
      page.replace(path, e.state);
    }
  }

  /**
   * Handle "click" events.
   */

  function onclick(e) {
    if (1 != which(e)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    var el = e.target;
    while (el && 'A' != el.nodeName) el = el.parentNode;
    if (!el || 'A' != el.nodeName) return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (el.pathname == location.pathname && (el.hash || '#' == link)) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;

    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // same page
    var orig = path + el.hash;

    path = path.replace(base, '');
    if (base && orig == path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null == e.which
      ? e.button
      : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return 0 == href.indexOf(origin);
  }

  /**
   * Expose `page`.
   */

  if ('undefined' == typeof module) {
    window.page = page;
  } else {
    module.exports = page;
  }

})();

},{}],77:[function(require,module,exports){
var utils = require('./utils')

function Batcher () {
    this.reset()
}

var BatcherProto = Batcher.prototype

BatcherProto.push = function (job) {
    if (!job.id || !this.has[job.id]) {
        this.queue.push(job)
        this.has[job.id] = job
        if (!this.waiting) {
            this.waiting = true
            utils.nextTick(utils.bind(this.flush, this))
        }
    } else if (job.override) {
        var oldJob = this.has[job.id]
        oldJob.cancelled = true
        this.queue.push(job)
        this.has[job.id] = job
    }
}

BatcherProto.flush = function () {
    // before flush hook
    if (this._preFlush) this._preFlush()
    // do not cache length because more jobs might be pushed
    // as we execute existing jobs
    for (var i = 0; i < this.queue.length; i++) {
        var job = this.queue[i]
        if (!job.cancelled) {
            job.execute()
        }
    }
    this.reset()
}

BatcherProto.reset = function () {
    this.has = utils.hash()
    this.queue = []
    this.waiting = false
}

module.exports = Batcher
},{"./utils":102}],78:[function(require,module,exports){
var Batcher        = require('./batcher'),
    bindingBatcher = new Batcher(),
    bindingId      = 1

/**
 *  Binding class.
 *
 *  each property on the viewmodel has one corresponding Binding object
 *  which has multiple directive instances on the DOM
 *  and multiple computed property dependents
 */
function Binding (compiler, key, isExp, isFn) {
    this.id = bindingId++
    this.value = undefined
    this.isExp = !!isExp
    this.isFn = isFn
    this.root = !this.isExp && key.indexOf('.') === -1
    this.compiler = compiler
    this.key = key
    this.dirs = []
    this.subs = []
    this.deps = []
    this.unbound = false
}

var BindingProto = Binding.prototype

/**
 *  Update value and queue instance updates.
 */
BindingProto.update = function (value) {
    if (!this.isComputed || this.isFn) {
        this.value = value
    }
    if (this.dirs.length || this.subs.length) {
        var self = this
        bindingBatcher.push({
            id: this.id,
            execute: function () {
                if (!self.unbound) {
                    self._update()
                }
            }
        })
    }
}

/**
 *  Actually update the directives.
 */
BindingProto._update = function () {
    var i = this.dirs.length,
        value = this.val()
    while (i--) {
        this.dirs[i].$update(value)
    }
    this.pub()
}

/**
 *  Return the valuated value regardless
 *  of whether it is computed or not
 */
BindingProto.val = function () {
    return this.isComputed && !this.isFn
        ? this.value.$get()
        : this.value
}

/**
 *  Notify computed properties that depend on this binding
 *  to update themselves
 */
BindingProto.pub = function () {
    var i = this.subs.length
    while (i--) {
        this.subs[i].update()
    }
}

/**
 *  Unbind the binding, remove itself from all of its dependencies
 */
BindingProto.unbind = function () {
    // Indicate this has been unbound.
    // It's possible this binding will be in
    // the batcher's flush queue when its owner
    // compiler has already been destroyed.
    this.unbound = true
    var i = this.dirs.length
    while (i--) {
        this.dirs[i].$unbind()
    }
    i = this.deps.length
    var subs
    while (i--) {
        subs = this.deps[i].subs
        var j = subs.indexOf(this)
        if (j > -1) subs.splice(j, 1)
    }
}

module.exports = Binding
},{"./batcher":77}],79:[function(require,module,exports){
var Emitter     = require('./emitter'),
    Observer    = require('./observer'),
    config      = require('./config'),
    utils       = require('./utils'),
    Binding     = require('./binding'),
    Directive   = require('./directive'),
    TextParser  = require('./text-parser'),
    DepsParser  = require('./deps-parser'),
    ExpParser   = require('./exp-parser'),
    ViewModel,
    
    // cache methods
    slice       = [].slice,
    extend      = utils.extend,
    hasOwn      = ({}).hasOwnProperty,
    def         = Object.defineProperty,

    // hooks to register
    hooks = [
        'created', 'ready',
        'beforeDestroy', 'afterDestroy',
        'attached', 'detached'
    ],

    // list of priority directives
    // that needs to be checked in specific order
    priorityDirectives = [
        'if',
        'repeat',
        'view',
        'component'
    ]

/**
 *  The DOM compiler
 *  scans a DOM node and compile bindings for a ViewModel
 */
function Compiler (vm, options) {

    var compiler = this,
        key, i

    // default state
    compiler.init       = true
    compiler.destroyed  = false

    // process and extend options
    options = compiler.options = options || {}
    utils.processOptions(options)

    // copy compiler options
    extend(compiler, options.compilerOptions)
    // repeat indicates this is a v-repeat instance
    compiler.repeat   = compiler.repeat || false
    // expCache will be shared between v-repeat instances
    compiler.expCache = compiler.expCache || {}

    // initialize element
    var el = compiler.el = compiler.setupElement(options)
    utils.log('\nnew VM instance: ' + el.tagName + '\n')

    // set other compiler properties
    compiler.vm       = el.vue_vm = vm
    compiler.bindings = utils.hash()
    compiler.dirs     = []
    compiler.deferred = []
    compiler.computed = []
    compiler.children = []
    compiler.emitter  = new Emitter(vm)

    // VM ---------------------------------------------------------------------

    // set VM properties
    vm.$         = {}
    vm.$el       = el
    vm.$options  = options
    vm.$compiler = compiler
    vm.$event    = null

    // set parent & root
    var parentVM = options.parent
    if (parentVM) {
        compiler.parent = parentVM.$compiler
        parentVM.$compiler.children.push(compiler)
        vm.$parent = parentVM
        // inherit lazy option
        if (!('lazy' in options)) {
            options.lazy = compiler.parent.options.lazy
        }
    }
    vm.$root = getRoot(compiler).vm

    // DATA -------------------------------------------------------------------

    // setup observer
    // this is necesarry for all hooks and data observation events
    compiler.setupObserver()

    // create bindings for computed properties
    if (options.methods) {
        for (key in options.methods) {
            compiler.createBinding(key)
        }
    }

    // create bindings for methods
    if (options.computed) {
        for (key in options.computed) {
            compiler.createBinding(key)
        }
    }

    // initialize data
    var data = compiler.data = options.data || {},
        defaultData = options.defaultData
    if (defaultData) {
        for (key in defaultData) {
            if (!hasOwn.call(data, key)) {
                data[key] = defaultData[key]
            }
        }
    }

    // copy paramAttributes
    var params = options.paramAttributes
    if (params) {
        i = params.length
        while (i--) {
            data[params[i]] = utils.checkNumber(
                compiler.eval(
                    el.getAttribute(params[i])
                )
            )
        }
    }

    // copy data properties to vm
    // so user can access them in the created hook
    extend(vm, data)
    vm.$data = data

    // beforeCompile hook
    compiler.execHook('created')

    // the user might have swapped the data ...
    data = compiler.data = vm.$data

    // user might also set some properties on the vm
    // in which case we should copy back to $data
    var vmProp
    for (key in vm) {
        vmProp = vm[key]
        if (
            key.charAt(0) !== '$' &&
            data[key] !== vmProp &&
            typeof vmProp !== 'function'
        ) {
            data[key] = vmProp
        }
    }

    // now we can observe the data.
    // this will convert data properties to getter/setters
    // and emit the first batch of set events, which will
    // in turn create the corresponding bindings.
    compiler.observeData(data)

    // COMPILE ----------------------------------------------------------------

    // before compiling, resolve content insertion points
    if (options.template) {
        this.resolveContent()
    }

    // now parse the DOM and bind directives.
    // During this stage, we will also create bindings for
    // encountered keypaths that don't have a binding yet.
    compiler.compile(el, true)

    // Any directive that creates child VMs are deferred
    // so that when they are compiled, all bindings on the
    // parent VM have been created.
    i = compiler.deferred.length
    while (i--) {
        compiler.bindDirective(compiler.deferred[i])
    }
    compiler.deferred = null

    // extract dependencies for computed properties.
    // this will evaluated all collected computed bindings
    // and collect get events that are emitted.
    if (this.computed.length) {
        DepsParser.parse(this.computed)
    }

    // done!
    compiler.init = false

    // post compile / ready hook
    compiler.execHook('ready')
}

var CompilerProto = Compiler.prototype

/**
 *  Initialize the VM/Compiler's element.
 *  Fill it in with the template if necessary.
 */
CompilerProto.setupElement = function (options) {
    // create the node first
    var el = typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el || document.createElement(options.tagName || 'div')

    var template = options.template,
        child, replacer, i, attr, attrs

    if (template) {
        // collect anything already in there
        if (el.hasChildNodes()) {
            this.rawContent = document.createElement('div')
            /* jshint boss: true */
            while (child = el.firstChild) {
                this.rawContent.appendChild(child)
            }
        }
        // replace option: use the first node in
        // the template directly
        if (options.replace && template.firstChild === template.lastChild) {
            replacer = template.firstChild.cloneNode(true)
            if (el.parentNode) {
                el.parentNode.insertBefore(replacer, el)
                el.parentNode.removeChild(el)
            }
            // copy over attributes
            if (el.hasAttributes()) {
                i = el.attributes.length
                while (i--) {
                    attr = el.attributes[i]
                    replacer.setAttribute(attr.name, attr.value)
                }
            }
            // replace
            el = replacer
        } else {
            el.appendChild(template.cloneNode(true))
        }

    }

    // apply element options
    if (options.id) el.id = options.id
    if (options.className) el.className = options.className
    attrs = options.attributes
    if (attrs) {
        for (attr in attrs) {
            el.setAttribute(attr, attrs[attr])
        }
    }

    return el
}

/**
 *  Deal with <content> insertion points
 *  per the Web Components spec
 */
CompilerProto.resolveContent = function () {

    var outlets = slice.call(this.el.getElementsByTagName('content')),
        raw = this.rawContent,
        outlet, select, i, j, main

    i = outlets.length
    if (i) {
        // first pass, collect corresponding content
        // for each outlet.
        while (i--) {
            outlet = outlets[i]
            if (raw) {
                select = outlet.getAttribute('select')
                if (select) { // select content
                    outlet.content =
                        slice.call(raw.querySelectorAll(select))
                } else { // default content
                    main = outlet
                }
            } else { // fallback content
                outlet.content =
                    slice.call(outlet.childNodes)
            }
        }
        // second pass, actually insert the contents
        for (i = 0, j = outlets.length; i < j; i++) {
            outlet = outlets[i]
            if (outlet === main) continue
            insert(outlet, outlet.content)
        }
        // finally insert the main content
        if (raw && main) {
            insert(main, slice.call(raw.childNodes))
        }
    }

    function insert (outlet, contents) {
        var parent = outlet.parentNode,
            i = 0, j = contents.length
        for (; i < j; i++) {
            parent.insertBefore(contents[i], outlet)
        }
        parent.removeChild(outlet)
    }

    this.rawContent = null
}

/**
 *  Setup observer.
 *  The observer listens for get/set/mutate events on all VM
 *  values/objects and trigger corresponding binding updates.
 *  It also listens for lifecycle hooks.
 */
CompilerProto.setupObserver = function () {

    var compiler = this,
        bindings = compiler.bindings,
        options  = compiler.options,
        observer = compiler.observer = new Emitter(compiler.vm)

    // a hash to hold event proxies for each root level key
    // so they can be referenced and removed later
    observer.proxies = {}

    // add own listeners which trigger binding updates
    observer
        .on('get', onGet)
        .on('set', onSet)
        .on('mutate', onSet)

    // register hooks
    var i = hooks.length, j, hook, fns
    while (i--) {
        hook = hooks[i]
        fns = options[hook]
        if (Array.isArray(fns)) {
            j = fns.length
            // since hooks were merged with child at head,
            // we loop reversely.
            while (j--) {
                registerHook(hook, fns[j])
            }
        } else if (fns) {
            registerHook(hook, fns)
        }
    }

    // broadcast attached/detached hooks
    observer
        .on('hook:attached', function () {
            broadcast(1)
        })
        .on('hook:detached', function () {
            broadcast(0)
        })

    function onGet (key) {
        check(key)
        DepsParser.catcher.emit('get', bindings[key])
    }

    function onSet (key, val, mutation) {
        observer.emit('change:' + key, val, mutation)
        check(key)
        bindings[key].update(val)
    }

    function registerHook (hook, fn) {
        observer.on('hook:' + hook, function () {
            fn.call(compiler.vm)
        })
    }

    function broadcast (event) {
        var children = compiler.children
        if (children) {
            var child, i = children.length
            while (i--) {
                child = children[i]
                if (child.el.parentNode) {
                    event = 'hook:' + (event ? 'attached' : 'detached')
                    child.observer.emit(event)
                    child.emitter.emit(event)
                }
            }
        }
    }

    function check (key) {
        if (!bindings[key]) {
            compiler.createBinding(key)
        }
    }
}

CompilerProto.observeData = function (data) {

    var compiler = this,
        observer = compiler.observer

    // recursively observe nested properties
    Observer.observe(data, '', observer)

    // also create binding for top level $data
    // so it can be used in templates too
    var $dataBinding = compiler.bindings['$data'] = new Binding(compiler, '$data')
    $dataBinding.update(data)

    // allow $data to be swapped
    def(compiler.vm, '$data', {
        get: function () {
            compiler.observer.emit('get', '$data')
            return compiler.data
        },
        set: function (newData) {
            var oldData = compiler.data
            Observer.unobserve(oldData, '', observer)
            compiler.data = newData
            Observer.copyPaths(newData, oldData)
            Observer.observe(newData, '', observer)
            update()
        }
    })

    // emit $data change on all changes
    observer
        .on('set', onSet)
        .on('mutate', onSet)

    function onSet (key) {
        if (key !== '$data') update()
    }

    function update () {
        $dataBinding.update(compiler.data)
        observer.emit('change:$data', compiler.data)
    }
}

/**
 *  Compile a DOM node (recursive)
 */
CompilerProto.compile = function (node, root) {
    var nodeType = node.nodeType
    if (nodeType === 1 && node.tagName !== 'SCRIPT') { // a normal node
        this.compileElement(node, root)
    } else if (nodeType === 3 && config.interpolate) {
        this.compileTextNode(node)
    }
}

/**
 *  Check for a priority directive
 *  If it is present and valid, return true to skip the rest
 */
CompilerProto.checkPriorityDir = function (dirname, node, root) {
    var expression, directive, Ctor
    if (
        dirname === 'component' &&
        root !== true &&
        (Ctor = this.resolveComponent(node, undefined, true))
    ) {
        directive = this.parseDirective(dirname, '', node)
        directive.Ctor = Ctor
    } else {
        expression = utils.attr(node, dirname)
        directive = expression && this.parseDirective(dirname, expression, node)
    }
    if (directive) {
        if (root === true) {
            utils.warn(
                'Directive v-' + dirname + ' cannot be used on an already instantiated ' +
                'VM\'s root node. Use it from the parent\'s template instead.'
            )
            return
        }
        this.deferred.push(directive)
        return true
    }
}

/**
 *  Compile normal directives on a node
 */
CompilerProto.compileElement = function (node, root) {

    // textarea is pretty annoying
    // because its value creates childNodes which
    // we don't want to compile.
    if (node.tagName === 'TEXTAREA' && node.value) {
        node.value = this.eval(node.value)
    }

    // only compile if this element has attributes
    // or its tagName contains a hyphen (which means it could
    // potentially be a custom element)
    if (node.hasAttributes() || node.tagName.indexOf('-') > -1) {

        // skip anything with v-pre
        if (utils.attr(node, 'pre') !== null) {
            return
        }

        var i, l, j, k

        // check priority directives.
        // if any of them are present, it will take over the node with a childVM
        // so we can skip the rest
        for (i = 0, l = priorityDirectives.length; i < l; i++) {
            if (this.checkPriorityDir(priorityDirectives[i], node, root)) {
                return
            }
        }

        // check transition & animation properties
        node.vue_trans  = utils.attr(node, 'transition')
        node.vue_anim   = utils.attr(node, 'animation')
        node.vue_effect = this.eval(utils.attr(node, 'effect'))

        var prefix = config.prefix + '-',
            params = this.options.paramAttributes,
            attr, attrname, isDirective, exp, directives, directive, dirname

        // v-with has special priority among the rest
        // it needs to pull in the value from the parent before
        // computed properties are evaluated, because at this stage
        // the computed properties have not set up their dependencies yet.
        if (root) {
            var withExp = utils.attr(node, 'with')
            if (withExp) {
                directives = this.parseDirective('with', withExp, node, true)
                for (j = 0, k = directives.length; j < k; j++) {
                    this.bindDirective(directives[j], this.parent)
                }
            }
        }

        var attrs = slice.call(node.attributes)
        for (i = 0, l = attrs.length; i < l; i++) {

            attr = attrs[i]
            attrname = attr.name
            isDirective = false

            if (attrname.indexOf(prefix) === 0) {
                // a directive - split, parse and bind it.
                isDirective = true
                dirname = attrname.slice(prefix.length)
                // build with multiple: true
                directives = this.parseDirective(dirname, attr.value, node, true)
                // loop through clauses (separated by ",")
                // inside each attribute
                for (j = 0, k = directives.length; j < k; j++) {
                    this.bindDirective(directives[j])
                }
            } else if (config.interpolate) {
                // non directive attribute, check interpolation tags
                exp = TextParser.parseAttr(attr.value)
                if (exp) {
                    directive = this.parseDirective('attr', exp, node)
                    directive.arg = attrname
                    if (params && params.indexOf(attrname) > -1) {
                        // a param attribute... we should use the parent binding
                        // to avoid circular updates like size={{size}}
                        this.bindDirective(directive, this.parent)
                    } else {
                        this.bindDirective(directive)
                    }
                }
            }

            if (isDirective && dirname !== 'cloak') {
                node.removeAttribute(attrname)
            }
        }

    }

    // recursively compile childNodes
    if (node.hasChildNodes()) {
        slice.call(node.childNodes).forEach(this.compile, this)
    }
}

/**
 *  Compile a text node
 */
CompilerProto.compileTextNode = function (node) {

    var tokens = TextParser.parse(node.nodeValue)
    if (!tokens) return
    var el, token, directive

    for (var i = 0, l = tokens.length; i < l; i++) {

        token = tokens[i]
        directive = null

        if (token.key) { // a binding
            if (token.key.charAt(0) === '>') { // a partial
                el = document.createComment('ref')
                directive = this.parseDirective('partial', token.key.slice(1), el)
            } else {
                if (!token.html) { // text binding
                    el = document.createTextNode('')
                    directive = this.parseDirective('text', token.key, el)
                } else { // html binding
                    el = document.createComment(config.prefix + '-html')
                    directive = this.parseDirective('html', token.key, el)
                }
            }
        } else { // a plain string
            el = document.createTextNode(token)
        }

        // insert node
        node.parentNode.insertBefore(el, node)
        // bind directive
        this.bindDirective(directive)

    }
    node.parentNode.removeChild(node)
}

/**
 *  Parse a directive name/value pair into one or more
 *  directive instances
 */
CompilerProto.parseDirective = function (name, value, el, multiple) {
    var compiler = this,
        definition = compiler.getOption('directives', name)
    if (definition) {
        // parse into AST-like objects
        var asts = Directive.parse(value)
        return multiple
            ? asts.map(build)
            : build(asts[0])
    }
    function build (ast) {
        return new Directive(name, ast, definition, compiler, el)
    }
}

/**
 *  Add a directive instance to the correct binding & viewmodel
 */
CompilerProto.bindDirective = function (directive, bindingOwner) {

    if (!directive) return

    // keep track of it so we can unbind() later
    this.dirs.push(directive)

    // for empty or literal directives, simply call its bind()
    // and we're done.
    if (directive.isEmpty || directive.isLiteral) {
        if (directive.bind) directive.bind()
        return
    }

    // otherwise, we got more work to do...
    var binding,
        compiler = bindingOwner || this,
        key      = directive.key

    if (directive.isExp) {
        // expression bindings are always created on current compiler
        binding = compiler.createBinding(key, directive)
    } else {
        // recursively locate which compiler owns the binding
        while (compiler) {
            if (compiler.hasKey(key)) {
                break
            } else {
                compiler = compiler.parent
            }
        }
        compiler = compiler || this
        binding = compiler.bindings[key] || compiler.createBinding(key)
    }
    binding.dirs.push(directive)
    directive.binding = binding

    var value = binding.val()
    // invoke bind hook if exists
    if (directive.bind) {
        directive.bind(value)
    }
    // set initial value
    directive.$update(value, true)
}

/**
 *  Create binding and attach getter/setter for a key to the viewmodel object
 */
CompilerProto.createBinding = function (key, directive) {

    utils.log('  created binding: ' + key)

    var compiler = this,
        methods  = compiler.options.methods,
        isExp    = directive && directive.isExp,
        isFn     = (directive && directive.isFn) || (methods && methods[key]),
        bindings = compiler.bindings,
        computed = compiler.options.computed,
        binding  = new Binding(compiler, key, isExp, isFn)

    if (isExp) {
        // expression bindings are anonymous
        compiler.defineExp(key, binding, directive)
    } else if (isFn) {
        bindings[key] = binding
        compiler.defineVmProp(key, binding, methods[key])
    } else {
        bindings[key] = binding
        if (binding.root) {
            // this is a root level binding. we need to define getter/setters for it.
            if (computed && computed[key]) {
                // computed property
                compiler.defineComputed(key, binding, computed[key])
            } else if (key.charAt(0) !== '$') {
                // normal property
                compiler.defineDataProp(key, binding)
            } else {
                // properties that start with $ are meta properties
                // they should be kept on the vm but not in the data object.
                compiler.defineVmProp(key, binding, compiler.data[key])
                delete compiler.data[key]
            }
        } else if (computed && computed[utils.baseKey(key)]) {
            // nested path on computed property
            compiler.defineExp(key, binding)
        } else {
            // ensure path in data so that computed properties that
            // access the path don't throw an error and can collect
            // dependencies
            Observer.ensurePath(compiler.data, key)
            var parentKey = key.slice(0, key.lastIndexOf('.'))
            if (!bindings[parentKey]) {
                // this is a nested value binding, but the binding for its parent
                // has not been created yet. We better create that one too.
                compiler.createBinding(parentKey)
            }
        }
    }
    return binding
}

/**
 *  Define the getter/setter to proxy a root-level
 *  data property on the VM
 */
CompilerProto.defineDataProp = function (key, binding) {
    var compiler = this,
        data     = compiler.data,
        ob       = data.__emitter__

    // make sure the key is present in data
    // so it can be observed
    if (!(hasOwn.call(data, key))) {
        data[key] = undefined
    }

    // if the data object is already observed, but the key
    // is not observed, we need to add it to the observed keys.
    if (ob && !(hasOwn.call(ob.values, key))) {
        Observer.convertKey(data, key)
    }

    binding.value = data[key]

    def(compiler.vm, key, {
        get: function () {
            return compiler.data[key]
        },
        set: function (val) {
            compiler.data[key] = val
        }
    })
}

/**
 *  Define a vm property, e.g. $index, $key, or mixin methods
 *  which are bindable but only accessible on the VM,
 *  not in the data.
 */
CompilerProto.defineVmProp = function (key, binding, value) {
    var ob = this.observer
    binding.value = value
    def(this.vm, key, {
        get: function () {
            if (Observer.shouldGet) ob.emit('get', key)
            return binding.value
        },
        set: function (val) {
            ob.emit('set', key, val)
        }
    })
}

/**
 *  Define an expression binding, which is essentially
 *  an anonymous computed property
 */
CompilerProto.defineExp = function (key, binding, directive) {
    var computedKey = directive && directive.computedKey,
        exp         = computedKey ? directive.expression : key,
        getter      = this.expCache[exp]
    if (!getter) {
        getter = this.expCache[exp] = ExpParser.parse(computedKey || key, this)
    }
    if (getter) {
        this.markComputed(binding, getter)
    }
}

/**
 *  Define a computed property on the VM
 */
CompilerProto.defineComputed = function (key, binding, value) {
    this.markComputed(binding, value)
    def(this.vm, key, {
        get: binding.value.$get,
        set: binding.value.$set
    })
}

/**
 *  Process a computed property binding
 *  so its getter/setter are bound to proper context
 */
CompilerProto.markComputed = function (binding, value) {
    binding.isComputed = true
    // bind the accessors to the vm
    if (binding.isFn) {
        binding.value = value
    } else {
        if (typeof value === 'function') {
            value = { $get: value }
        }
        binding.value = {
            $get: utils.bind(value.$get, this.vm),
            $set: value.$set
                ? utils.bind(value.$set, this.vm)
                : undefined
        }
    }
    // keep track for dep parsing later
    this.computed.push(binding)
}

/**
 *  Retrive an option from the compiler
 */
CompilerProto.getOption = function (type, id, silent) {
    var opts = this.options,
        parent = this.parent,
        globalAssets = config.globalAssets,
        res = (opts[type] && opts[type][id]) || (
            parent
                ? parent.getOption(type, id, silent)
                : globalAssets[type] && globalAssets[type][id]
        )
    if (!res && !silent && typeof id === 'string') {
        utils.warn('Unknown ' + type.slice(0, -1) + ': ' + id)
    }
    return res
}

/**
 *  Emit lifecycle events to trigger hooks
 */
CompilerProto.execHook = function (event) {
    event = 'hook:' + event
    this.observer.emit(event)
    this.emitter.emit(event)
}

/**
 *  Check if a compiler's data contains a keypath
 */
CompilerProto.hasKey = function (key) {
    var baseKey = utils.baseKey(key)
    return hasOwn.call(this.data, baseKey) ||
        hasOwn.call(this.vm, baseKey)
}

/**
 *  Do a one-time eval of a string that potentially
 *  includes bindings. It accepts additional raw data
 *  because we need to dynamically resolve v-component
 *  before a childVM is even compiled...
 */
CompilerProto.eval = function (exp, data) {
    var parsed = TextParser.parseAttr(exp)
    return parsed
        ? ExpParser.eval(parsed, this, data)
        : exp
}

/**
 *  Resolve a Component constructor for an element
 *  with the data to be used
 */
CompilerProto.resolveComponent = function (node, data, test) {

    // late require to avoid circular deps
    ViewModel = ViewModel || require('./viewmodel')

    var exp     = utils.attr(node, 'component'),
        tagName = node.tagName,
        id      = this.eval(exp, data),
        tagId   = (tagName.indexOf('-') > 0 && tagName.toLowerCase()),
        Ctor    = this.getOption('components', id || tagId, true)

    if (id && !Ctor) {
        utils.warn('Unknown component: ' + id)
    }

    return test
        ? exp === ''
            ? ViewModel
            : Ctor
        : Ctor || ViewModel
}

/**
 *  Unbind and remove element
 */
CompilerProto.destroy = function (noRemove) {

    // avoid being called more than once
    // this is irreversible!
    if (this.destroyed) return

    var compiler = this,
        i, j, key, dir, dirs, binding,
        vm          = compiler.vm,
        el          = compiler.el,
        directives  = compiler.dirs,
        computed    = compiler.computed,
        bindings    = compiler.bindings,
        children    = compiler.children,
        parent      = compiler.parent

    compiler.execHook('beforeDestroy')

    // unobserve data
    Observer.unobserve(compiler.data, '', compiler.observer)

    // destroy all children
    // do not remove their elements since the parent
    // may have transitions and the children may not
    i = children.length
    while (i--) {
        children[i].destroy(true)
    }

    // unbind all direcitves
    i = directives.length
    while (i--) {
        dir = directives[i]
        // if this directive is an instance of an external binding
        // e.g. a directive that refers to a variable on the parent VM
        // we need to remove it from that binding's directives
        // * empty and literal bindings do not have binding.
        if (dir.binding && dir.binding.compiler !== compiler) {
            dirs = dir.binding.dirs
            if (dirs) {
                j = dirs.indexOf(dir)
                if (j > -1) dirs.splice(j, 1)
            }
        }
        dir.$unbind()
    }

    // unbind all computed, anonymous bindings
    i = computed.length
    while (i--) {
        computed[i].unbind()
    }

    // unbind all keypath bindings
    for (key in bindings) {
        binding = bindings[key]
        if (binding) {
            binding.unbind()
        }
    }

    // remove self from parent
    if (parent) {
        j = parent.children.indexOf(compiler)
        if (j > -1) parent.children.splice(j, 1)
    }

    // finally remove dom element
    if (!noRemove) {
        if (el === document.body) {
            el.innerHTML = ''
        } else {
            vm.$remove()
        }
    }
    el.vue_vm = null

    compiler.destroyed = true
    // emit destroy hook
    compiler.execHook('afterDestroy')

    // finally, unregister all listeners
    compiler.observer.off()
    compiler.emitter.off()
}

// Helpers --------------------------------------------------------------------

/**
 *  shorthand for getting root compiler
 */
function getRoot (compiler) {
    while (compiler.parent) {
        compiler = compiler.parent
    }
    return compiler
}

module.exports = Compiler
},{"./binding":78,"./config":80,"./deps-parser":81,"./directive":82,"./emitter":93,"./exp-parser":94,"./observer":98,"./text-parser":100,"./utils":102,"./viewmodel":103}],80:[function(require,module,exports){
var TextParser = require('./text-parser')

module.exports = {
    prefix         : 'v',
    debug          : false,
    silent         : false,
    enterClass     : 'v-enter',
    leaveClass     : 'v-leave',
    interpolate    : true
}

Object.defineProperty(module.exports, 'delimiters', {
    get: function () {
        return TextParser.delimiters
    },
    set: function (delimiters) {
        TextParser.setDelimiters(delimiters)
    }
})
},{"./text-parser":100}],81:[function(require,module,exports){
var Emitter  = require('./emitter'),
    utils    = require('./utils'),
    Observer = require('./observer'),
    catcher  = new Emitter()

/**
 *  Auto-extract the dependencies of a computed property
 *  by recording the getters triggered when evaluating it.
 */
function catchDeps (binding) {
    if (binding.isFn) return
    utils.log('\n- ' + binding.key)
    var got = utils.hash()
    binding.deps = []
    catcher.on('get', function (dep) {
        var has = got[dep.key]
        if (
            // avoid duplicate bindings
            (has && has.compiler === dep.compiler) ||
            // avoid repeated items as dependency
            // only when the binding is from self or the parent chain
            (dep.compiler.repeat && !isParentOf(dep.compiler, binding.compiler))
        ) {
            return
        }
        got[dep.key] = dep
        utils.log('  - ' + dep.key)
        binding.deps.push(dep)
        dep.subs.push(binding)
    })
    binding.value.$get()
    catcher.off('get')
}

/**
 *  Test if A is a parent of or equals B
 */
function isParentOf (a, b) {
    while (b) {
        if (a === b) {
            return true
        }
        b = b.parent
    }
}

module.exports = {

    /**
     *  the observer that catches events triggered by getters
     */
    catcher: catcher,

    /**
     *  parse a list of computed property bindings
     */
    parse: function (bindings) {
        utils.log('\nparsing dependencies...')
        Observer.shouldGet = true
        bindings.forEach(catchDeps)
        Observer.shouldGet = false
        utils.log('\ndone.')
    }
    
}
},{"./emitter":93,"./observer":98,"./utils":102}],82:[function(require,module,exports){
var dirId           = 1,
    ARG_RE          = /^[\w\$-]+$/,
    FILTER_TOKEN_RE = /[^\s'"]+|'[^']+'|"[^"]+"/g,
    NESTING_RE      = /^\$(parent|root)\./,
    SINGLE_VAR_RE   = /^[\w\.$]+$/,
    QUOTE_RE        = /"/g,
    TextParser      = require('./text-parser')

/**
 *  Directive class
 *  represents a single directive instance in the DOM
 */
function Directive (name, ast, definition, compiler, el) {

    this.id             = dirId++
    this.name           = name
    this.compiler       = compiler
    this.vm             = compiler.vm
    this.el             = el
    this.computeFilters = false
    this.key            = ast.key
    this.arg            = ast.arg
    this.expression     = ast.expression

    var isEmpty = this.expression === ''

    // mix in properties from the directive definition
    if (typeof definition === 'function') {
        this[isEmpty ? 'bind' : 'update'] = definition
    } else {
        for (var prop in definition) {
            this[prop] = definition[prop]
        }
    }

    // empty expression, we're done.
    if (isEmpty || this.isEmpty) {
        this.isEmpty = true
        return
    }

    if (TextParser.Regex.test(this.key)) {
        this.key = compiler.eval(this.key)
        if (this.isLiteral) {
            this.expression = this.key
        }
    }

    var filters = ast.filters,
        filter, fn, i, l, computed
    if (filters) {
        this.filters = []
        for (i = 0, l = filters.length; i < l; i++) {
            filter = filters[i]
            fn = this.compiler.getOption('filters', filter.name)
            if (fn) {
                filter.apply = fn
                this.filters.push(filter)
                if (fn.computed) {
                    computed = true
                }
            }
        }
    }

    if (!this.filters || !this.filters.length) {
        this.filters = null
    }

    if (computed) {
        this.computedKey = Directive.inlineFilters(this.key, this.filters)
        this.filters = null
    }

    this.isExp =
        computed ||
        !SINGLE_VAR_RE.test(this.key) ||
        NESTING_RE.test(this.key)

}

var DirProto = Directive.prototype

/**
 *  called when a new value is set 
 *  for computed properties, this will only be called once
 *  during initialization.
 */
DirProto.$update = function (value, init) {
    if (this.$lock) return
    if (init || value !== this.value || (value && typeof value === 'object')) {
        this.value = value
        if (this.update) {
            this.update(
                this.filters && !this.computeFilters
                    ? this.$applyFilters(value)
                    : value,
                init
            )
        }
    }
}

/**
 *  pipe the value through filters
 */
DirProto.$applyFilters = function (value) {
    var filtered = value, filter
    for (var i = 0, l = this.filters.length; i < l; i++) {
        filter = this.filters[i]
        filtered = filter.apply.apply(this.vm, [filtered].concat(filter.args))
    }
    return filtered
}

/**
 *  Unbind diretive
 */
DirProto.$unbind = function () {
    // this can be called before the el is even assigned...
    if (!this.el || !this.vm) return
    if (this.unbind) this.unbind()
    this.vm = this.el = this.binding = this.compiler = null
}

// Exposed static methods -----------------------------------------------------

/**
 *  Parse a directive string into an Array of
 *  AST-like objects representing directives
 */
Directive.parse = function (str) {

    var inSingle = false,
        inDouble = false,
        curly    = 0,
        square   = 0,
        paren    = 0,
        begin    = 0,
        argIndex = 0,
        dirs     = [],
        dir      = {},
        lastFilterIndex = 0,
        arg

    for (var c, i = 0, l = str.length; i < l; i++) {
        c = str.charAt(i)
        if (inSingle) {
            // check single quote
            if (c === "'") inSingle = !inSingle
        } else if (inDouble) {
            // check double quote
            if (c === '"') inDouble = !inDouble
        } else if (c === ',' && !paren && !curly && !square) {
            // reached the end of a directive
            pushDir()
            // reset & skip the comma
            dir = {}
            begin = argIndex = lastFilterIndex = i + 1
        } else if (c === ':' && !dir.key && !dir.arg) {
            // argument
            arg = str.slice(begin, i).trim()
            if (ARG_RE.test(arg)) {
                argIndex = i + 1
                dir.arg = arg
            }
        } else if (c === '|' && str.charAt(i + 1) !== '|' && str.charAt(i - 1) !== '|') {
            if (dir.key === undefined) {
                // first filter, end of key
                lastFilterIndex = i + 1
                dir.key = str.slice(argIndex, i).trim()
            } else {
                // already has filter
                pushFilter()
            }
        } else if (c === '"') {
            inDouble = true
        } else if (c === "'") {
            inSingle = true
        } else if (c === '(') {
            paren++
        } else if (c === ')') {
            paren--
        } else if (c === '[') {
            square++
        } else if (c === ']') {
            square--
        } else if (c === '{') {
            curly++
        } else if (c === '}') {
            curly--
        }
    }
    if (i === 0 || begin !== i) {
        pushDir()
    }

    function pushDir () {
        dir.expression = str.slice(begin, i).trim()
        if (dir.key === undefined) {
            dir.key = str.slice(argIndex, i).trim()
        } else if (lastFilterIndex !== begin) {
            pushFilter()
        }
        if (i === 0 || dir.key) {
            dirs.push(dir)
        }
    }

    function pushFilter () {
        var exp = str.slice(lastFilterIndex, i).trim(),
            filter
        if (exp) {
            filter = {}
            var tokens = exp.match(FILTER_TOKEN_RE)
            filter.name = tokens[0]
            filter.args = tokens.length > 1 ? tokens.slice(1) : null
        }
        if (filter) {
            (dir.filters = dir.filters || []).push(filter)
        }
        lastFilterIndex = i + 1
    }

    return dirs
}

/**
 *  Inline computed filters so they become part
 *  of the expression
 */
Directive.inlineFilters = function (key, filters) {
    var args, filter
    for (var i = 0, l = filters.length; i < l; i++) {
        filter = filters[i]
        args = filter.args
            ? ',"' + filter.args.map(escapeQuote).join('","') + '"'
            : ''
        key = 'this.$compiler.getOption("filters", "' +
                filter.name +
            '").call(this,' +
                key + args +
            ')'
    }
    return key
}

/**
 *  Convert double quotes to single quotes
 *  so they don't mess up the generated function body
 */
function escapeQuote (v) {
    return v.indexOf('"') > -1
        ? v.replace(QUOTE_RE, '\'')
        : v
}

module.exports = Directive
},{"./text-parser":100}],83:[function(require,module,exports){
var utils = require('../utils'),
    slice = [].slice

/**
 *  Binding for innerHTML
 */
module.exports = {

    bind: function () {
        // a comment node means this is a binding for
        // {{{ inline unescaped html }}}
        if (this.el.nodeType === 8) {
            // hold nodes
            this.nodes = []
        }
    },

    update: function (value) {
        value = utils.guard(value)
        if (this.nodes) {
            this.swap(value)
        } else {
            this.el.innerHTML = value
        }
    },

    swap: function (value) {
        var parent = this.el.parentNode,
            nodes  = this.nodes,
            i      = nodes.length
        // remove old nodes
        while (i--) {
            parent.removeChild(nodes[i])
        }
        // convert new value to a fragment
        var frag = utils.toFragment(value)
        // save a reference to these nodes so we can remove later
        this.nodes = slice.call(frag.childNodes)
        parent.insertBefore(frag, this.el)
    }
}
},{"../utils":102}],84:[function(require,module,exports){
var utils    = require('../utils')

/**
 *  Manages a conditional child VM
 */
module.exports = {

    bind: function () {
        
        this.parent = this.el.parentNode
        this.ref    = document.createComment('vue-if')
        this.Ctor   = this.compiler.resolveComponent(this.el)

        // insert ref
        this.parent.insertBefore(this.ref, this.el)
        this.parent.removeChild(this.el)

        if (utils.attr(this.el, 'view')) {
            utils.warn(
                'Conflict: v-if cannot be used together with v-view. ' +
                'Just set v-view\'s binding value to empty string to empty it.'
            )
        }
        if (utils.attr(this.el, 'repeat')) {
            utils.warn(
                'Conflict: v-if cannot be used together with v-repeat. ' +
                'Use `v-show` or the `filterBy` filter instead.'
            )
        }
    },

    update: function (value) {

        if (!value) {
            this.unbind()
        } else if (!this.childVM) {
            this.childVM = new this.Ctor({
                el: this.el.cloneNode(true),
                parent: this.vm
            })
            if (this.compiler.init) {
                this.parent.insertBefore(this.childVM.$el, this.ref)
            } else {
                this.childVM.$before(this.ref)
            }
        }
        
    },

    unbind: function () {
        if (this.childVM) {
            this.childVM.$destroy()
            this.childVM = null
        }
    }
}
},{"../utils":102}],85:[function(require,module,exports){
var utils      = require('../utils'),
    config     = require('../config'),
    transition = require('../transition'),
    directives = module.exports = utils.hash()

/**
 *  Nest and manage a Child VM
 */
directives.component = {
    isLiteral: true,
    bind: function () {
        if (!this.el.vue_vm) {
            this.childVM = new this.Ctor({
                el: this.el,
                parent: this.vm
            })
        }
    },
    unbind: function () {
        if (this.childVM) {
            this.childVM.$destroy()
        }
    }
}

/**
 *  Binding HTML attributes
 */
directives.attr = {
    bind: function () {
        var params = this.vm.$options.paramAttributes
        this.isParam = params && params.indexOf(this.arg) > -1
    },
    update: function (value) {
        if (value || value === 0) {
            this.el.setAttribute(this.arg, value)
        } else {
            this.el.removeAttribute(this.arg)
        }
        if (this.isParam) {
            this.vm[this.arg] = utils.checkNumber(value)
        }
    }
}

/**
 *  Binding textContent
 */
directives.text = {
    bind: function () {
        this.attr = this.el.nodeType === 3
            ? 'nodeValue'
            : 'textContent'
    },
    update: function (value) {
        this.el[this.attr] = utils.guard(value)
    }
}

/**
 *  Binding CSS display property
 */
directives.show = function (value) {
    var el = this.el,
        target = value ? '' : 'none',
        change = function () {
            el.style.display = target
        }
    transition(el, value ? 1 : -1, change, this.compiler)
}

/**
 *  Binding CSS classes
 */
directives['class'] = function (value) {
    if (this.arg) {
        utils[value ? 'addClass' : 'removeClass'](this.el, this.arg)
    } else {
        if (this.lastVal) {
            utils.removeClass(this.el, this.lastVal)
        }
        if (value) {
            utils.addClass(this.el, value)
            this.lastVal = value
        }
    }
}

/**
 *  Only removed after the owner VM is ready
 */
directives.cloak = {
    isEmpty: true,
    bind: function () {
        var el = this.el
        this.compiler.observer.once('hook:ready', function () {
            el.removeAttribute(config.prefix + '-cloak')
        })
    }
}

/**
 *  Store a reference to self in parent VM's $
 */
directives.ref = {
    isLiteral: true,
    bind: function () {
        var id = this.expression
        if (id) {
            this.vm.$parent.$[id] = this.vm
        }
    },
    unbind: function () {
        var id = this.expression
        if (id) {
            delete this.vm.$parent.$[id]
        }
    }
}

directives.on      = require('./on')
directives.repeat  = require('./repeat')
directives.model   = require('./model')
directives['if']   = require('./if')
directives['with'] = require('./with')
directives.html    = require('./html')
directives.style   = require('./style')
directives.partial = require('./partial')
directives.view    = require('./view')
},{"../config":80,"../transition":101,"../utils":102,"./html":83,"./if":84,"./model":86,"./on":87,"./partial":88,"./repeat":89,"./style":90,"./view":91,"./with":92}],86:[function(require,module,exports){
var utils = require('../utils'),
    isIE9 = navigator.userAgent.indexOf('MSIE 9.0') > 0,
    filter = [].filter

/**
 *  Returns an array of values from a multiple select
 */
function getMultipleSelectOptions (select) {
    return filter
        .call(select.options, function (option) {
            return option.selected
        })
        .map(function (option) {
            return option.value || option.text
        })
}

/**
 *  Two-way binding for form input elements
 */
module.exports = {

    bind: function () {

        var self = this,
            el   = self.el,
            type = el.type,
            tag  = el.tagName

        self.lock = false
        self.ownerVM = self.binding.compiler.vm

        // determine what event to listen to
        self.event =
            (self.compiler.options.lazy ||
            tag === 'SELECT' ||
            type === 'checkbox' || type === 'radio')
                ? 'change'
                : 'input'

        // determine the attribute to change when updating
        self.attr = type === 'checkbox'
            ? 'checked'
            : (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA')
                ? 'value'
                : 'innerHTML'

        // select[multiple] support
        if(tag === 'SELECT' && el.hasAttribute('multiple')) {
            this.multi = true
        }

        var compositionLock = false
        self.cLock = function () {
            compositionLock = true
        }
        self.cUnlock = function () {
            compositionLock = false
        }
        el.addEventListener('compositionstart', this.cLock)
        el.addEventListener('compositionend', this.cUnlock)

        // attach listener
        self.set = self.filters
            ? function () {
                if (compositionLock) return
                // if this directive has filters
                // we need to let the vm.$set trigger
                // update() so filters are applied.
                // therefore we have to record cursor position
                // so that after vm.$set changes the input
                // value we can put the cursor back at where it is
                var cursorPos
                try { cursorPos = el.selectionStart } catch (e) {}

                self._set()

                // since updates are async
                // we need to reset cursor position async too
                utils.nextTick(function () {
                    if (cursorPos !== undefined) {
                        el.setSelectionRange(cursorPos, cursorPos)
                    }
                })
            }
            : function () {
                if (compositionLock) return
                // no filters, don't let it trigger update()
                self.lock = true

                self._set()

                utils.nextTick(function () {
                    self.lock = false
                })
            }
        el.addEventListener(self.event, self.set)

        // fix shit for IE9
        // since it doesn't fire input on backspace / del / cut
        if (isIE9) {
            self.onCut = function () {
                // cut event fires before the value actually changes
                utils.nextTick(function () {
                    self.set()
                })
            }
            self.onDel = function (e) {
                if (e.keyCode === 46 || e.keyCode === 8) {
                    self.set()
                }
            }
            el.addEventListener('cut', self.onCut)
            el.addEventListener('keyup', self.onDel)
        }
    },

    _set: function () {
        this.ownerVM.$set(
            this.key, this.multi
                ? getMultipleSelectOptions(this.el)
                : this.el[this.attr]
        )
    },

    update: function (value, init) {
        /* jshint eqeqeq: false */
        // sync back inline value if initial data is undefined
        if (init && value === undefined) {
            return this._set()
        }
        if (this.lock) return
        var el = this.el
        if (el.tagName === 'SELECT') { // select dropdown
            el.selectedIndex = -1
            if(this.multi && Array.isArray(value)) {
                value.forEach(this.updateSelect, this)
            } else {
                this.updateSelect(value)
            }
        } else if (el.type === 'radio') { // radio button
            el.checked = value == el.value
        } else if (el.type === 'checkbox') { // checkbox
            el.checked = !!value
        } else {
            el[this.attr] = utils.guard(value)
        }
    },

    updateSelect: function (value) {
        /* jshint eqeqeq: false */
        // setting <select>'s value in IE9 doesn't work
        // we have to manually loop through the options
        var options = this.el.options,
            i = options.length
        while (i--) {
            if (options[i].value == value) {
                options[i].selected = true
                break
            }
        }
    },

    unbind: function () {
        var el = this.el
        el.removeEventListener(this.event, this.set)
        el.removeEventListener('compositionstart', this.cLock)
        el.removeEventListener('compositionend', this.cUnlock)
        if (isIE9) {
            el.removeEventListener('cut', this.onCut)
            el.removeEventListener('keyup', this.onDel)
        }
    }
}
},{"../utils":102}],87:[function(require,module,exports){
var utils    = require('../utils')

/**
 *  Binding for event listeners
 */
module.exports = {

    isFn: true,

    bind: function () {
        this.context = this.binding.isExp
            ? this.vm
            : this.binding.compiler.vm
        if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
            var self = this
            this.iframeBind = function () {
                self.el.contentWindow.addEventListener(self.arg, self.handler)
            }
            this.el.addEventListener('load', this.iframeBind)
        }
    },

    update: function (handler) {
        if (typeof handler !== 'function') {
            utils.warn('Directive "v-on:' + this.expression + '" expects a method.')
            return
        }
        this.reset()
        var vm = this.vm,
            context = this.context
        this.handler = function (e) {
            e.targetVM = vm
            context.$event = e
            var res = handler.call(context, e)
            context.$event = null
            return res
        }
        if (this.iframeBind) {
            this.iframeBind()
        } else {
            this.el.addEventListener(this.arg, this.handler)
        }
    },

    reset: function () {
        var el = this.iframeBind
            ? this.el.contentWindow
            : this.el
        if (this.handler) {
            el.removeEventListener(this.arg, this.handler)
        }
    },

    unbind: function () {
        this.reset()
        this.el.removeEventListener('load', this.iframeBind)
    }
}
},{"../utils":102}],88:[function(require,module,exports){
var utils = require('../utils')

/**
 *  Binding for partials
 */
module.exports = {

    isLiteral: true,

    bind: function () {

        var id = this.expression
        if (!id) return

        var el       = this.el,
            compiler = this.compiler,
            partial  = compiler.getOption('partials', id)

        if (!partial) {
            if (id === 'yield') {
                utils.warn('{{>yield}} syntax has been deprecated. Use <content> tag instead.')
            }
            return
        }

        partial = partial.cloneNode(true)

        // comment ref node means inline partial
        if (el.nodeType === 8) {

            // keep a ref for the partial's content nodes
            var nodes = [].slice.call(partial.childNodes),
                parent = el.parentNode
            parent.insertBefore(partial, el)
            parent.removeChild(el)
            // compile partial after appending, because its children's parentNode
            // will change from the fragment to the correct parentNode.
            // This could affect directives that need access to its element's parentNode.
            nodes.forEach(compiler.compile, compiler)

        } else {

            // just set innerHTML...
            el.innerHTML = ''
            el.appendChild(partial)

        }
    }

}
},{"../utils":102}],89:[function(require,module,exports){
var utils      = require('../utils'),
    config     = require('../config')

/**
 *  Binding that manages VMs based on an Array
 */
module.exports = {

    bind: function () {

        this.identifier = '$r' + this.id

        // a hash to cache the same expressions on repeated instances
        // so they don't have to be compiled for every single instance
        this.expCache = utils.hash()

        var el   = this.el,
            ctn  = this.container = el.parentNode

        // extract child Id, if any
        this.childId = this.compiler.eval(utils.attr(el, 'ref'))

        // create a comment node as a reference node for DOM insertions
        this.ref = document.createComment(config.prefix + '-repeat-' + this.key)
        ctn.insertBefore(this.ref, el)
        ctn.removeChild(el)

        this.collection = null
        this.vms = null

    },

    update: function (collection) {

        if (!Array.isArray(collection)) {
            if (utils.isObject(collection)) {
                collection = utils.objectToArray(collection)
            } else {
                utils.warn('v-repeat only accepts Array or Object values.')
            }
        }

        // keep reference of old data and VMs
        // so we can reuse them if possible
        this.oldVMs = this.vms
        this.oldCollection = this.collection
        collection = this.collection = collection || []

        var isObject = collection[0] && utils.isObject(collection[0])
        this.vms = this.oldCollection
            ? this.diff(collection, isObject)
            : this.init(collection, isObject)

        if (this.childId) {
            this.vm.$[this.childId] = this.vms
        }

    },

    init: function (collection, isObject) {
        var vm, vms = []
        for (var i = 0, l = collection.length; i < l; i++) {
            vm = this.build(collection[i], i, isObject)
            vms.push(vm)
            if (this.compiler.init) {
                this.container.insertBefore(vm.$el, this.ref)
            } else {
                vm.$before(this.ref)
            }
        }
        return vms
    },

    /**
     *  Diff the new array with the old
     *  and determine the minimum amount of DOM manipulations.
     */
    diff: function (newCollection, isObject) {

        var i, l, item, vm,
            oldIndex,
            targetNext,
            currentNext,
            nextEl,
            ctn    = this.container,
            oldVMs = this.oldVMs,
            vms    = []

        vms.length = newCollection.length

        // first pass, collect new reused and new created
        for (i = 0, l = newCollection.length; i < l; i++) {
            item = newCollection[i]
            if (isObject) {
                item.$index = i
                if (item.__emitter__ && item.__emitter__[this.identifier]) {
                    // this piece of data is being reused.
                    // record its final position in reused vms
                    item.$reused = true
                } else {
                    vms[i] = this.build(item, i, isObject)
                }
            } else {
                // we can't attach an identifier to primitive values
                // so have to do an indexOf...
                oldIndex = indexOf(oldVMs, item)
                if (oldIndex > -1) {
                    // record the position on the existing vm
                    oldVMs[oldIndex].$reused = true
                    oldVMs[oldIndex].$data.$index = i
                } else {
                    vms[i] = this.build(item, i, isObject)
                }
            }
        }

        // second pass, collect old reused and destroy unused
        for (i = 0, l = oldVMs.length; i < l; i++) {
            vm = oldVMs[i]
            item = this.arg
                ? vm.$data[this.arg]
                : vm.$data
            if (item.$reused) {
                vm.$reused = true
                delete item.$reused
            }
            if (vm.$reused) {
                // update the index to latest
                vm.$index = item.$index
                // the item could have had a new key
                if (item.$key && item.$key !== vm.$key) {
                    vm.$key = item.$key
                }
                vms[vm.$index] = vm
            } else {
                // this one can be destroyed.
                if (item.__emitter__) {
                    delete item.__emitter__[this.identifier]
                }
                vm.$destroy()
            }
        }

        // final pass, move/insert DOM elements
        i = vms.length
        while (i--) {
            vm = vms[i]
            item = vm.$data
            targetNext = vms[i + 1]
            if (vm.$reused) {
                nextEl = vm.$el.nextSibling
                // destroyed VMs' element might still be in the DOM
                // due to transitions
                while (!nextEl.vue_vm && nextEl !== this.ref) {
                    nextEl = nextEl.nextSibling
                }
                currentNext = nextEl.vue_vm
                if (currentNext !== targetNext) {
                    if (!targetNext) {
                        ctn.insertBefore(vm.$el, this.ref)
                    } else {
                        nextEl = targetNext.$el
                        // new VMs' element might not be in the DOM yet
                        // due to transitions
                        while (!nextEl.parentNode) {
                            targetNext = vms[nextEl.vue_vm.$index + 1]
                            nextEl = targetNext
                                ? targetNext.$el
                                : this.ref
                        }
                        ctn.insertBefore(vm.$el, nextEl)
                    }
                }
                delete vm.$reused
                delete item.$index
                delete item.$key
            } else { // a new vm
                vm.$before(targetNext ? targetNext.$el : this.ref)
            }
        }

        return vms
    },

    build: function (data, index, isObject) {

        // wrap non-object values
        var raw, alias,
            wrap = !isObject || this.arg
        if (wrap) {
            raw = data
            alias = this.arg || '$value'
            data = {}
            data[alias] = raw
        }
        data.$index = index

        var el = this.el.cloneNode(true),
            Ctor = this.compiler.resolveComponent(el, data),
            vm = new Ctor({
                el: el,
                data: data,
                parent: this.vm,
                compilerOptions: {
                    repeat: true,
                    expCache: this.expCache
                }
            })

        if (isObject) {
            // attach an ienumerable identifier to the raw data
            (raw || data).__emitter__[this.identifier] = true
        }

        return vm

    },

    unbind: function () {
        if (this.childId) {
            delete this.vm.$[this.childId]
        }
        if (this.vms) {
            var i = this.vms.length
            while (i--) {
                this.vms[i].$destroy()
            }
        }
    }
}

// Helpers --------------------------------------------------------------------

/**
 *  Find an object or a wrapped data object
 *  from an Array
 */
function indexOf (vms, obj) {
    for (var vm, i = 0, l = vms.length; i < l; i++) {
        vm = vms[i]
        if (!vm.$reused && vm.$value === obj) {
            return i
        }
    }
    return -1
}
},{"../config":80,"../utils":102}],90:[function(require,module,exports){
var prefixes = ['-webkit-', '-moz-', '-ms-']

/**
 *  Binding for CSS styles
 */
module.exports = {

    bind: function () {
        var prop = this.arg
        if (!prop) return
        if (prop.charAt(0) === '$') {
            // properties that start with $ will be auto-prefixed
            prop = prop.slice(1)
            this.prefixed = true
        }
        this.prop = prop
    },

    update: function (value) {
        var prop = this.prop,
            isImportant
        /* jshint eqeqeq: true */
        // cast possible numbers/booleans into strings
        if (value != null) value += ''
        if (prop) {
            if (value) {
                isImportant = value.slice(-10) === '!important'
                    ? 'important'
                    : ''
                if (isImportant) {
                    value = value.slice(0, -10).trim()
                }
            }
            this.el.style.setProperty(prop, value, isImportant)
            if (this.prefixed) {
                var i = prefixes.length
                while (i--) {
                    this.el.style.setProperty(prefixes[i] + prop, value, isImportant)
                }
            }
        } else {
            this.el.style.cssText = value
        }
    }

}
},{}],91:[function(require,module,exports){
/**
 *  Manages a conditional child VM using the
 *  binding's value as the component ID.
 */
module.exports = {

    bind: function () {

        // track position in DOM with a ref node
        var el       = this.raw = this.el,
            parent   = el.parentNode,
            ref      = this.ref = document.createComment('v-view')
        parent.insertBefore(ref, el)
        parent.removeChild(el)

        // cache original content
        /* jshint boss: true */
        var node,
            frag = this.inner = document.createElement('div')
        while (node = el.firstChild) {
            frag.appendChild(node)
        }

    },

    update: function(value) {

        this.unbind()

        var Ctor  = this.compiler.getOption('components', value)
        if (!Ctor) return

        this.childVM = new Ctor({
            el: this.raw.cloneNode(true),
            parent: this.vm,
            compilerOptions: {
                rawContent: this.inner.cloneNode(true)
            }
        })

        this.el = this.childVM.$el
        if (this.compiler.init) {
            this.ref.parentNode.insertBefore(this.el, this.ref)
        } else {
            this.childVM.$before(this.ref)
        }

    },

    unbind: function() {
        if (this.childVM) {
            this.childVM.$destroy()
        }
    }

}
},{}],92:[function(require,module,exports){
var utils = require('../utils')

/**
 *  Binding for inheriting data from parent VMs.
 */
module.exports = {

    bind: function () {

        var self      = this,
            childKey  = self.arg,
            parentKey = self.key,
            compiler  = self.compiler,
            owner     = self.binding.compiler

        if (compiler === owner) {
            this.alone = true
            return
        }

        if (childKey) {
            if (!compiler.bindings[childKey]) {
                compiler.createBinding(childKey)
            }
            // sync changes on child back to parent
            compiler.observer.on('change:' + childKey, function (val) {
                if (compiler.init) return
                if (!self.lock) {
                    self.lock = true
                    utils.nextTick(function () {
                        self.lock = false
                    })
                }
                owner.vm.$set(parentKey, val)
            })
        }
    },

    update: function (value) {
        // sync from parent
        if (!this.alone && !this.lock) {
            if (this.arg) {
                this.vm.$set(this.arg, value)
            } else if (this.vm.$data !== value) {
                this.vm.$data = value
            }
        }
    }

}
},{"../utils":102}],93:[function(require,module,exports){
var slice = [].slice

function Emitter (ctx) {
    this._ctx = ctx || this
}

var EmitterProto = Emitter.prototype

EmitterProto.on = function (event, fn) {
    this._cbs = this._cbs || {}
    ;(this._cbs[event] = this._cbs[event] || [])
        .push(fn)
    return this
}

EmitterProto.once = function (event, fn) {
    var self = this
    this._cbs = this._cbs || {}

    function on () {
        self.off(event, on)
        fn.apply(this, arguments)
    }

    on.fn = fn
    this.on(event, on)
    return this
}

EmitterProto.off = function (event, fn) {
    this._cbs = this._cbs || {}

    // all
    if (!arguments.length) {
        this._cbs = {}
        return this
    }

    // specific event
    var callbacks = this._cbs[event]
    if (!callbacks) return this

    // remove all handlers
    if (arguments.length === 1) {
        delete this._cbs[event]
        return this
    }

    // remove specific handler
    var cb
    for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i]
        if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1)
            break
        }
    }
    return this
}

/**
 *  The internal, faster emit with fixed amount of arguments
 *  using Function.call
 */
EmitterProto.emit = function (event, a, b, c) {
    this._cbs = this._cbs || {}
    var callbacks = this._cbs[event]

    if (callbacks) {
        callbacks = callbacks.slice(0)
        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].call(this._ctx, a, b, c)
        }
    }

    return this
}

/**
 *  The external emit using Function.apply
 */
EmitterProto.applyEmit = function (event) {
    this._cbs = this._cbs || {}
    var callbacks = this._cbs[event], args

    if (callbacks) {
        callbacks = callbacks.slice(0)
        args = slice.call(arguments, 1)
        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].apply(this._ctx, args)
        }
    }

    return this
}

module.exports = Emitter
},{}],94:[function(require,module,exports){
var utils           = require('./utils'),
    STR_SAVE_RE     = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,
    STR_RESTORE_RE  = /"(\d+)"/g,
    NEWLINE_RE      = /\n/g,
    CTOR_RE         = new RegExp('constructor'.split('').join('[\'"+, ]*')),
    UNICODE_RE      = /\\u\d\d\d\d/

// Variable extraction scooped from https://github.com/RubyLouvre/avalon

var KEYWORDS =
        // keywords
        'break,case,catch,continue,debugger,default,delete,do,else,false' +
        ',finally,for,function,if,in,instanceof,new,null,return,switch,this' +
        ',throw,true,try,typeof,var,void,while,with,undefined' +
        // reserved
        ',abstract,boolean,byte,char,class,const,double,enum,export,extends' +
        ',final,float,goto,implements,import,int,interface,long,native' +
        ',package,private,protected,public,short,static,super,synchronized' +
        ',throws,transient,volatile' +
        // ECMA 5 - use strict
        ',arguments,let,yield' +
        // allow using Math in expressions
        ',Math',
        
    KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g'),
    REMOVE_RE   = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+|[\{,]\s*[\w\$_]+\s*:/g,
    SPLIT_RE    = /[^\w$]+/g,
    NUMBER_RE   = /\b\d[^,]*/g,
    BOUNDARY_RE = /^,+|,+$/g

/**
 *  Strip top level variable names from a snippet of JS expression
 */
function getVariables (code) {
    code = code
        .replace(REMOVE_RE, '')
        .replace(SPLIT_RE, ',')
        .replace(KEYWORDS_RE, '')
        .replace(NUMBER_RE, '')
        .replace(BOUNDARY_RE, '')
    return code
        ? code.split(/,+/)
        : []
}

/**
 *  A given path could potentially exist not on the
 *  current compiler, but up in the parent chain somewhere.
 *  This function generates an access relationship string
 *  that can be used in the getter function by walking up
 *  the parent chain to check for key existence.
 *
 *  It stops at top parent if no vm in the chain has the
 *  key. It then creates any missing bindings on the
 *  final resolved vm.
 */
function traceScope (path, compiler, data) {
    var rel  = '',
        dist = 0,
        self = compiler

    if (data && utils.get(data, path) !== undefined) {
        // hack: temporarily attached data
        return '$temp.'
    }

    while (compiler) {
        if (compiler.hasKey(path)) {
            break
        } else {
            compiler = compiler.parent
            dist++
        }
    }
    if (compiler) {
        while (dist--) {
            rel += '$parent.'
        }
        if (!compiler.bindings[path] && path.charAt(0) !== '$') {
            compiler.createBinding(path)
        }
    } else {
        self.createBinding(path)
    }
    return rel
}

/**
 *  Create a function from a string...
 *  this looks like evil magic but since all variables are limited
 *  to the VM's data it's actually properly sandboxed
 */
function makeGetter (exp, raw) {
    var fn
    try {
        fn = new Function(exp)
    } catch (e) {
        utils.warn('Error parsing expression: ' + raw)
    }
    return fn
}

/**
 *  Escape a leading dollar sign for regex construction
 */
function escapeDollar (v) {
    return v.charAt(0) === '$'
        ? '\\' + v
        : v
}

/**
 *  Parse and return an anonymous computed property getter function
 *  from an arbitrary expression, together with a list of paths to be
 *  created as bindings.
 */
exports.parse = function (exp, compiler, data) {
    // unicode and 'constructor' are not allowed for XSS security.
    if (UNICODE_RE.test(exp) || CTOR_RE.test(exp)) {
        utils.warn('Unsafe expression: ' + exp)
        return
    }
    // extract variable names
    var vars = getVariables(exp)
    if (!vars.length) {
        return makeGetter('return ' + exp, exp)
    }
    vars = utils.unique(vars)

    var accessors = '',
        has       = utils.hash(),
        strings   = [],
        // construct a regex to extract all valid variable paths
        // ones that begin with "$" are particularly tricky
        // because we can't use \b for them
        pathRE = new RegExp(
            "[^$\\w\\.](" +
            vars.map(escapeDollar).join('|') +
            ")[$\\w\\.]*\\b", 'g'
        ),
        body = (' ' + exp)
            .replace(STR_SAVE_RE, saveStrings)
            .replace(pathRE, replacePath)
            .replace(STR_RESTORE_RE, restoreStrings)

    body = accessors + 'return ' + body

    function saveStrings (str) {
        var i = strings.length
        // escape newlines in strings so the expression
        // can be correctly evaluated
        strings[i] = str.replace(NEWLINE_RE, '\\n')
        return '"' + i + '"'
    }

    function replacePath (path) {
        // keep track of the first char
        var c = path.charAt(0)
        path = path.slice(1)
        var val = 'this.' + traceScope(path, compiler, data) + path
        if (!has[path]) {
            accessors += val + ';'
            has[path] = 1
        }
        // don't forget to put that first char back
        return c + val
    }

    function restoreStrings (str, i) {
        return strings[i]
    }

    return makeGetter(body, exp)
}

/**
 *  Evaluate an expression in the context of a compiler.
 *  Accepts additional data.
 */
exports.eval = function (exp, compiler, data) {
    var getter = exports.parse(exp, compiler, data), res
    if (getter) {
        // hack: temporarily attach the additional data so
        // it can be accessed in the getter
        compiler.vm.$temp = data
        res = getter.call(compiler.vm)
        delete compiler.vm.$temp
    }
    return res
}
},{"./utils":102}],95:[function(require,module,exports){
var utils    = require('./utils'),
    get      = utils.get,
    slice    = [].slice,
    QUOTE_RE = /^'.*'$/,
    filters  = module.exports = utils.hash()

/**
 *  'abc' => 'Abc'
 */
filters.capitalize = function (value) {
    if (!value && value !== 0) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 *  'abc' => 'ABC'
 */
filters.uppercase = function (value) {
    return (value || value === 0)
        ? value.toString().toUpperCase()
        : ''
}

/**
 *  'AbC' => 'abc'
 */
filters.lowercase = function (value) {
    return (value || value === 0)
        ? value.toString().toLowerCase()
        : ''
}

/**
 *  12345 => $12,345.00
 */
filters.currency = function (value, sign) {
    value = parseFloat(value)
    if (!value && value !== 0) return ''
    sign = sign || '$'
    var s = Math.floor(value).toString(),
        i = s.length % 3,
        h = i > 0 ? (s.slice(0, i) + (s.length > 3 ? ',' : '')) : '',
        f = '.' + value.toFixed(2).slice(-2)
    return sign + h + s.slice(i).replace(/(\d{3})(?=\d)/g, '$1,') + f
}

/**
 *  args: an array of strings corresponding to
 *  the single, double, triple ... forms of the word to
 *  be pluralized. When the number to be pluralized
 *  exceeds the length of the args, it will use the last
 *  entry in the array.
 *
 *  e.g. ['single', 'double', 'triple', 'multiple']
 */
filters.pluralize = function (value) {
    var args = slice.call(arguments, 1)
    return args.length > 1
        ? (args[value - 1] || args[args.length - 1])
        : (args[value - 1] || args[0] + 's')
}

/**
 *  A special filter that takes a handler function,
 *  wraps it so it only gets triggered on specific keypresses.
 *
 *  v-on only
 */

var keyCodes = {
    enter    : 13,
    tab      : 9,
    'delete' : 46,
    up       : 38,
    left     : 37,
    right    : 39,
    down     : 40,
    esc      : 27
}

filters.key = function (handler, key) {
    if (!handler) return
    var code = keyCodes[key]
    if (!code) {
        code = parseInt(key, 10)
    }
    return function (e) {
        if (e.keyCode === code) {
            return handler.call(this, e)
        }
    }
}

/**
 *  Filter filter for v-repeat
 */
filters.filterBy = function (arr, searchKey, delimiter, dataKey) {

    // allow optional `in` delimiter
    // because why not
    if (delimiter && delimiter !== 'in') {
        dataKey = delimiter
    }

    // get the search string
    var search = stripQuotes(searchKey) || this.$get(searchKey)
    if (!search) return arr
    search = search.toLowerCase()

    // get the optional dataKey
    dataKey = dataKey && (stripQuotes(dataKey) || this.$get(dataKey))

    // convert object to array
    if (!Array.isArray(arr)) {
        arr = utils.objectToArray(arr)
    }

    return arr.filter(function (item) {
        return dataKey
            ? contains(get(item, dataKey), search)
            : contains(item, search)
    })

}

filters.filterBy.computed = true

/**
 *  Sort fitler for v-repeat
 */
filters.orderBy = function (arr, sortKey, reverseKey) {

    var key = stripQuotes(sortKey) || this.$get(sortKey)
    if (!key) return arr

    // convert object to array
    if (!Array.isArray(arr)) {
        arr = utils.objectToArray(arr)
    }

    var order = 1
    if (reverseKey) {
        if (reverseKey === '-1') {
            order = -1
        } else if (reverseKey.charAt(0) === '!') {
            reverseKey = reverseKey.slice(1)
            order = this.$get(reverseKey) ? 1 : -1
        } else {
            order = this.$get(reverseKey) ? -1 : 1
        }
    }

    // sort on a copy to avoid mutating original array
    return arr.slice().sort(function (a, b) {
        a = get(a, key)
        b = get(b, key)
        return a === b ? 0 : a > b ? order : -order
    })

}

filters.orderBy.computed = true

// Array filter helpers -------------------------------------------------------

/**
 *  String contain helper
 */
function contains (val, search) {
    /* jshint eqeqeq: false */
    if (utils.isObject(val)) {
        for (var key in val) {
            if (contains(val[key], search)) {
                return true
            }
        }
    } else if (val != null) {
        return val.toString().toLowerCase().indexOf(search) > -1
    }
}

/**
 *  Test whether a string is in quotes,
 *  if yes return stripped string
 */
function stripQuotes (str) {
    if (QUOTE_RE.test(str)) {
        return str.slice(1, -1)
    }
}
},{"./utils":102}],96:[function(require,module,exports){
// string -> DOM conversion
// wrappers originally from jQuery, scooped from component/domify
var map = {
    legend   : [1, '<fieldset>', '</fieldset>'],
    tr       : [2, '<table><tbody>', '</tbody></table>'],
    col      : [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
    _default : [0, '', '']
}

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>']

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>']

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>']

map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>']

var TAG_RE = /<([\w:]+)/

module.exports = function (templateString) {
    var frag = document.createDocumentFragment(),
        m = TAG_RE.exec(templateString)
    // text only
    if (!m) {
        frag.appendChild(document.createTextNode(templateString))
        return frag
    }

    var tag = m[1],
        wrap = map[tag] || map._default,
        depth = wrap[0],
        prefix = wrap[1],
        suffix = wrap[2],
        node = document.createElement('div')

    node.innerHTML = prefix + templateString.trim() + suffix
    while (depth--) node = node.lastChild

    // one element
    if (node.firstChild === node.lastChild) {
        frag.appendChild(node.firstChild)
        return frag
    }

    // multiple nodes, return a fragment
    var child
    /* jshint boss: true */
    while (child = node.firstChild) {
        if (node.nodeType === 1) {
            frag.appendChild(child)
        }
    }
    return frag
}
},{}],97:[function(require,module,exports){
var config      = require('./config'),
    ViewModel   = require('./viewmodel'),
    utils       = require('./utils'),
    makeHash    = utils.hash,
    assetTypes  = ['directive', 'filter', 'partial', 'effect', 'component'],
    // Internal modules that are exposed for plugins
    pluginAPI   = {
        utils: utils,
        config: config,
        transition: require('./transition'),
        observer: require('./observer')
    }

ViewModel.options = config.globalAssets = {
    directives  : require('./directives'),
    filters     : require('./filters'),
    partials    : makeHash(),
    effects     : makeHash(),
    components  : makeHash()
}

/**
 *  Expose asset registration methods
 */
assetTypes.forEach(function (type) {
    ViewModel[type] = function (id, value) {
        var hash = this.options[type + 's']
        if (!hash) {
            hash = this.options[type + 's'] = makeHash()
        }
        if (!value) return hash[id]
        if (type === 'partial') {
            value = utils.parseTemplateOption(value)
        } else if (type === 'component') {
            value = utils.toConstructor(value)
        } else if (type === 'filter') {
            utils.checkFilter(value)
        }
        hash[id] = value
        return this
    }
})

/**
 *  Set config options
 */
ViewModel.config = function (opts, val) {
    if (typeof opts === 'string') {
        if (val === undefined) {
            return config[opts]
        } else {
            config[opts] = val
        }
    } else {
        utils.extend(config, opts)
    }
    return this
}

/**
 *  Expose an interface for plugins
 */
ViewModel.use = function (plugin) {
    if (typeof plugin === 'string') {
        try {
            plugin = require(plugin)
        } catch (e) {
            utils.warn('Cannot find plugin: ' + plugin)
            return
        }
    }

    // additional parameters
    var args = [].slice.call(arguments, 1)
    args.unshift(this)

    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
    } else {
        plugin.apply(null, args)
    }
    return this
}

/**
 *  Expose internal modules for plugins
 */
ViewModel.require = function (module) {
    return pluginAPI[module]
}

ViewModel.extend = extend
ViewModel.nextTick = utils.nextTick

/**
 *  Expose the main ViewModel class
 *  and add extend method
 */
function extend (options) {

    var ParentVM = this

    // extend data options need to be copied
    // on instantiation
    if (options.data) {
        options.defaultData = options.data
        delete options.data
    }

    // inherit options
    // but only when the super class is not the native Vue.
    if (ParentVM !== ViewModel) {
        options = inheritOptions(options, ParentVM.options, true)
    }
    utils.processOptions(options)

    var ExtendedVM = function (opts, asParent) {
        if (!asParent) {
            opts = inheritOptions(opts, options, true)
        }
        ParentVM.call(this, opts, true)
    }

    // inherit prototype props
    var proto = ExtendedVM.prototype = Object.create(ParentVM.prototype)
    utils.defProtected(proto, 'constructor', ExtendedVM)

    // allow extended VM to be further extended
    ExtendedVM.extend  = extend
    ExtendedVM.super   = ParentVM
    ExtendedVM.options = options

    // allow extended VM to add its own assets
    assetTypes.forEach(function (type) {
        ExtendedVM[type] = ViewModel[type]
    })

    // allow extended VM to use plugins
    ExtendedVM.use     = ViewModel.use
    ExtendedVM.require = ViewModel.require

    return ExtendedVM
}

/**
 *  Inherit options
 *
 *  For options such as `data`, `vms`, `directives`, 'partials',
 *  they should be further extended. However extending should only
 *  be done at top level.
 *  
 *  `proto` is an exception because it's handled directly on the
 *  prototype.
 *
 *  `el` is an exception because it's not allowed as an
 *  extension option, but only as an instance option.
 */
function inheritOptions (child, parent, topLevel) {
    child = child || {}
    if (!parent) return child
    for (var key in parent) {
        if (key === 'el') continue
        var val = child[key],
            parentVal = parent[key]
        if (topLevel && typeof val === 'function' && parentVal) {
            // merge hook functions into an array
            child[key] = [val]
            if (Array.isArray(parentVal)) {
                child[key] = child[key].concat(parentVal)
            } else {
                child[key].push(parentVal)
            }
        } else if (
            topLevel &&
            (utils.isTrueObject(val) || utils.isTrueObject(parentVal))
            && !(parentVal instanceof ViewModel)
        ) {
            // merge toplevel object options
            child[key] = inheritOptions(val, parentVal)
        } else if (val === undefined) {
            // inherit if child doesn't override
            child[key] = parentVal
        }
    }
    return child
}

module.exports = ViewModel
},{"./config":80,"./directives":85,"./filters":95,"./observer":98,"./transition":101,"./utils":102,"./viewmodel":103}],98:[function(require,module,exports){
/* jshint proto:true */

var Emitter  = require('./emitter'),
    utils    = require('./utils'),
    // cache methods
    def      = utils.defProtected,
    isObject = utils.isObject,
    isArray  = Array.isArray,
    hasOwn   = ({}).hasOwnProperty,
    oDef     = Object.defineProperty,
    slice    = [].slice,
    // fix for IE + __proto__ problem
    // define methods as inenumerable if __proto__ is present,
    // otherwise enumerable so we can loop through and manually
    // attach to array instances
    hasProto = ({}).__proto__

// Array Mutation Handlers & Augmentations ------------------------------------

// The proxy prototype to replace the __proto__ of
// an observed array
var ArrayProxy = Object.create(Array.prototype)

// intercept mutation methods
;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(watchMutation)

// Augment the ArrayProxy with convenience methods
def(ArrayProxy, '$set', function (index, data) {
    return this.splice(index, 1, data)[0]
}, !hasProto)

def(ArrayProxy, '$remove', function (index) {
    if (typeof index !== 'number') {
        index = this.indexOf(index)
    }
    if (index > -1) {
        return this.splice(index, 1)[0]
    }
}, !hasProto)

/**
 *  Intercep a mutation event so we can emit the mutation info.
 *  we also analyze what elements are added/removed and link/unlink
 *  them with the parent Array.
 */
function watchMutation (method) {
    def(ArrayProxy, method, function () {

        var args = slice.call(arguments),
            result = Array.prototype[method].apply(this, args),
            inserted, removed

        // determine new / removed elements
        if (method === 'push' || method === 'unshift') {
            inserted = args
        } else if (method === 'pop' || method === 'shift') {
            removed = [result]
        } else if (method === 'splice') {
            inserted = args.slice(2)
            removed = result
        }
        
        // link & unlink
        linkArrayElements(this, inserted)
        unlinkArrayElements(this, removed)

        // emit the mutation event
        this.__emitter__.emit('mutate', '', this, {
            method   : method,
            args     : args,
            result   : result,
            inserted : inserted,
            removed  : removed
        })

        return result
        
    }, !hasProto)
}

/**
 *  Link new elements to an Array, so when they change
 *  and emit events, the owner Array can be notified.
 */
function linkArrayElements (arr, items) {
    if (items) {
        var i = items.length, item, owners
        while (i--) {
            item = items[i]
            if (isWatchable(item)) {
                // if object is not converted for observing
                // convert it...
                if (!item.__emitter__) {
                    convert(item)
                    watch(item)
                }
                owners = item.__emitter__.owners
                if (owners.indexOf(arr) < 0) {
                    owners.push(arr)
                }
            }
        }
    }
}

/**
 *  Unlink removed elements from the ex-owner Array.
 */
function unlinkArrayElements (arr, items) {
    if (items) {
        var i = items.length, item
        while (i--) {
            item = items[i]
            if (item && item.__emitter__) {
                var owners = item.__emitter__.owners
                if (owners) owners.splice(owners.indexOf(arr))
            }
        }
    }
}

// Object add/delete key augmentation -----------------------------------------

var ObjProxy = Object.create(Object.prototype)

def(ObjProxy, '$add', function (key, val) {
    if (hasOwn.call(this, key)) return
    this[key] = val
    convertKey(this, key, true)
}, !hasProto)

def(ObjProxy, '$delete', function (key) {
    if (!(hasOwn.call(this, key))) return
    // trigger set events
    this[key] = undefined
    delete this[key]
    this.__emitter__.emit('delete', key)
}, !hasProto)

// Watch Helpers --------------------------------------------------------------

/**
 *  Check if a value is watchable
 */
function isWatchable (obj) {
    return typeof obj === 'object' && obj && !obj.$compiler
}

/**
 *  Convert an Object/Array to give it a change emitter.
 */
function convert (obj) {
    if (obj.__emitter__) return true
    var emitter = new Emitter()
    def(obj, '__emitter__', emitter)
    emitter
        .on('set', function (key, val, propagate) {
            if (propagate) propagateChange(obj)
        })
        .on('mutate', function () {
            propagateChange(obj)
        })
    emitter.values = utils.hash()
    emitter.owners = []
    return false
}

/**
 *  Propagate an array element's change to its owner arrays
 */
function propagateChange (obj) {
    var owners = obj.__emitter__.owners,
        i = owners.length
    while (i--) {
        owners[i].__emitter__.emit('set', '', '', true)
    }
}

/**
 *  Watch target based on its type
 */
function watch (obj) {
    if (isArray(obj)) {
        watchArray(obj)
    } else {
        watchObject(obj)
    }
}

/**
 *  Augment target objects with modified
 *  methods
 */
function augment (target, src) {
    if (hasProto) {
        target.__proto__ = src
    } else {
        for (var key in src) {
            def(target, key, src[key])
        }
    }
}

/**
 *  Watch an Object, recursive.
 */
function watchObject (obj) {
    augment(obj, ObjProxy)
    for (var key in obj) {
        convertKey(obj, key)
    }
}

/**
 *  Watch an Array, overload mutation methods
 *  and add augmentations by intercepting the prototype chain
 */
function watchArray (arr) {
    augment(arr, ArrayProxy)
    linkArrayElements(arr, arr)
}

/**
 *  Define accessors for a property on an Object
 *  so it emits get/set events.
 *  Then watch the value itself.
 */
function convertKey (obj, key, propagate) {
    var keyPrefix = key.charAt(0)
    if (keyPrefix === '$' || keyPrefix === '_') {
        return
    }
    // emit set on bind
    // this means when an object is observed it will emit
    // a first batch of set events.
    var emitter = obj.__emitter__,
        values  = emitter.values

    init(obj[key], propagate)

    oDef(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            var value = values[key]
            // only emit get on tip values
            if (pub.shouldGet) {
                emitter.emit('get', key)
            }
            return value
        },
        set: function (newVal) {
            var oldVal = values[key]
            unobserve(oldVal, key, emitter)
            copyPaths(newVal, oldVal)
            // an immediate property should notify its parent
            // to emit set for itself too
            init(newVal, true)
        }
    })

    function init (val, propagate) {
        values[key] = val
        emitter.emit('set', key, val, propagate)
        if (isArray(val)) {
            emitter.emit('set', key + '.length', val.length, propagate)
        }
        observe(val, key, emitter)
    }
}

/**
 *  When a value that is already converted is
 *  observed again by another observer, we can skip
 *  the watch conversion and simply emit set event for
 *  all of its properties.
 */
function emitSet (obj) {
    var emitter = obj && obj.__emitter__
    if (!emitter) return
    if (isArray(obj)) {
        emitter.emit('set', 'length', obj.length)
    } else {
        var key, val
        for (key in obj) {
            val = obj[key]
            emitter.emit('set', key, val)
            emitSet(val)
        }
    }
}

/**
 *  Make sure all the paths in an old object exists
 *  in a new object.
 *  So when an object changes, all missing keys will
 *  emit a set event with undefined value.
 */
function copyPaths (newObj, oldObj) {
    if (!isObject(newObj) || !isObject(oldObj)) {
        return
    }
    var path, oldVal, newVal
    for (path in oldObj) {
        if (!(hasOwn.call(newObj, path))) {
            oldVal = oldObj[path]
            if (isArray(oldVal)) {
                newObj[path] = []
            } else if (isObject(oldVal)) {
                newVal = newObj[path] = {}
                copyPaths(newVal, oldVal)
            } else {
                newObj[path] = undefined
            }
        }
    }
}

/**
 *  walk along a path and make sure it can be accessed
 *  and enumerated in that object
 */
function ensurePath (obj, key) {
    var path = key.split('.'), sec
    for (var i = 0, d = path.length - 1; i < d; i++) {
        sec = path[i]
        if (!obj[sec]) {
            obj[sec] = {}
            if (obj.__emitter__) convertKey(obj, sec)
        }
        obj = obj[sec]
    }
    if (isObject(obj)) {
        sec = path[i]
        if (!(hasOwn.call(obj, sec))) {
            obj[sec] = undefined
            if (obj.__emitter__) convertKey(obj, sec)
        }
    }
}

// Main API Methods -----------------------------------------------------------

/**
 *  Observe an object with a given path,
 *  and proxy get/set/mutate events to the provided observer.
 */
function observe (obj, rawPath, observer) {

    if (!isWatchable(obj)) return

    var path = rawPath ? rawPath + '.' : '',
        alreadyConverted = convert(obj),
        emitter = obj.__emitter__

    // setup proxy listeners on the parent observer.
    // we need to keep reference to them so that they
    // can be removed when the object is un-observed.
    observer.proxies = observer.proxies || {}
    var proxies = observer.proxies[path] = {
        get: function (key) {
            observer.emit('get', path + key)
        },
        set: function (key, val, propagate) {
            if (key) observer.emit('set', path + key, val)
            // also notify observer that the object itself changed
            // but only do so when it's a immediate property. this
            // avoids duplicate event firing.
            if (rawPath && propagate) {
                observer.emit('set', rawPath, obj, true)
            }
        },
        mutate: function (key, val, mutation) {
            // if the Array is a root value
            // the key will be null
            var fixedPath = key ? path + key : rawPath
            observer.emit('mutate', fixedPath, val, mutation)
            // also emit set for Array's length when it mutates
            var m = mutation.method
            if (m !== 'sort' && m !== 'reverse') {
                observer.emit('set', fixedPath + '.length', val.length)
            }
        }
    }

    // attach the listeners to the child observer.
    // now all the events will propagate upwards.
    emitter
        .on('get', proxies.get)
        .on('set', proxies.set)
        .on('mutate', proxies.mutate)

    if (alreadyConverted) {
        // for objects that have already been converted,
        // emit set events for everything inside
        emitSet(obj)
    } else {
        watch(obj)
    }
}

/**
 *  Cancel observation, turn off the listeners.
 */
function unobserve (obj, path, observer) {

    if (!obj || !obj.__emitter__) return

    path = path ? path + '.' : ''
    var proxies = observer.proxies[path]
    if (!proxies) return

    // turn off listeners
    obj.__emitter__
        .off('get', proxies.get)
        .off('set', proxies.set)
        .off('mutate', proxies.mutate)

    // remove reference
    observer.proxies[path] = null
}

// Expose API -----------------------------------------------------------------

var pub = module.exports = {

    // whether to emit get events
    // only enabled during dependency parsing
    shouldGet   : false,

    observe     : observe,
    unobserve   : unobserve,
    ensurePath  : ensurePath,
    copyPaths   : copyPaths,
    watch       : watch,
    convert     : convert,
    convertKey  : convertKey
}
},{"./emitter":93,"./utils":102}],99:[function(require,module,exports){
var toFragment = require('./fragment');

/**
 * Parses a template string or node and normalizes it into a
 * a node that can be used as a partial of a template option
 *
 * Possible values include
 * id selector: '#some-template-id'
 * template string: '<div><span>my template</span></div>'
 * DocumentFragment object
 * Node object of type Template
 */
module.exports = function(template) {
    var templateNode;

    if (template instanceof window.DocumentFragment) {
        // if the template is already a document fragment -- do nothing
        return template
    }

    if (typeof template === 'string') {
        // template by ID
        if (template.charAt(0) === '#') {
            templateNode = document.getElementById(template.slice(1))
            if (!templateNode) return
        } else {
            return toFragment(template)
        }
    } else if (template.nodeType) {
        templateNode = template
    } else {
        return
    }

    // if its a template tag and the browser supports it,
    // its content is already a document fragment!
    if (templateNode.tagName === 'TEMPLATE' && templateNode.content) {
        return templateNode.content
    }

    if (templateNode.tagName === 'SCRIPT') {
        return toFragment(templateNode.innerHTML)
    }

    return toFragment(templateNode.outerHTML);
}

},{"./fragment":96}],100:[function(require,module,exports){
var openChar        = '{',
    endChar         = '}',
    ESCAPE_RE       = /[-.*+?^${}()|[\]\/\\]/g,
    // lazy require
    Directive

exports.Regex = buildInterpolationRegex()

function buildInterpolationRegex () {
    var open = escapeRegex(openChar),
        end  = escapeRegex(endChar)
    return new RegExp(open + open + open + '?(.+?)' + end + '?' + end + end)
}

function escapeRegex (str) {
    return str.replace(ESCAPE_RE, '\\$&')
}

function setDelimiters (delimiters) {
    openChar = delimiters[0]
    endChar = delimiters[1]
    exports.delimiters = delimiters
    exports.Regex = buildInterpolationRegex()
}

/** 
 *  Parse a piece of text, return an array of tokens
 *  token types:
 *  1. plain string
 *  2. object with key = binding key
 *  3. object with key & html = true
 */
function parse (text) {
    if (!exports.Regex.test(text)) return null
    var m, i, token, match, tokens = []
    /* jshint boss: true */
    while (m = text.match(exports.Regex)) {
        i = m.index
        if (i > 0) tokens.push(text.slice(0, i))
        token = { key: m[1].trim() }
        match = m[0]
        token.html =
            match.charAt(2) === openChar &&
            match.charAt(match.length - 3) === endChar
        tokens.push(token)
        text = text.slice(i + m[0].length)
    }
    if (text.length) tokens.push(text)
    return tokens
}

/**
 *  Parse an attribute value with possible interpolation tags
 *  return a Directive-friendly expression
 *
 *  e.g.  a {{b}} c  =>  "a " + b + " c"
 */
function parseAttr (attr) {
    Directive = Directive || require('./directive')
    var tokens = parse(attr)
    if (!tokens) return null
    if (tokens.length === 1) return tokens[0].key
    var res = [], token
    for (var i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i]
        res.push(
            token.key
                ? inlineFilters(token.key)
                : ('"' + token + '"')
        )
    }
    return res.join('+')
}

/**
 *  Inlines any possible filters in a binding
 *  so that we can combine everything into a huge expression
 */
function inlineFilters (key) {
    if (key.indexOf('|') > -1) {
        var dirs = Directive.parse(key),
            dir = dirs && dirs[0]
        if (dir && dir.filters) {
            key = Directive.inlineFilters(
                dir.key,
                dir.filters
            )
        }
    }
    return '(' + key + ')'
}

exports.parse         = parse
exports.parseAttr     = parseAttr
exports.setDelimiters = setDelimiters
exports.delimiters    = [openChar, endChar]
},{"./directive":82}],101:[function(require,module,exports){
var endEvents  = sniffEndEvents(),
    config     = require('./config'),
    // batch enter animations so we only force the layout once
    Batcher    = require('./batcher'),
    batcher    = new Batcher(),
    // cache timer functions
    setTO      = window.setTimeout,
    clearTO    = window.clearTimeout,
    // exit codes for testing
    codes = {
        CSS_E     : 1,
        CSS_L     : 2,
        JS_E      : 3,
        JS_L      : 4,
        CSS_SKIP  : -1,
        JS_SKIP   : -2,
        JS_SKIP_E : -3,
        JS_SKIP_L : -4,
        INIT      : -5,
        SKIP      : -6
    }

// force layout before triggering transitions/animations
batcher._preFlush = function () {
    /* jshint unused: false */
    var f = document.body.offsetHeight
}

/**
 *  stage:
 *    1 = enter
 *    2 = leave
 */
var transition = module.exports = function (el, stage, cb, compiler) {

    var changeState = function () {
        cb()
        compiler.execHook(stage > 0 ? 'attached' : 'detached')
    }

    if (compiler.init) {
        changeState()
        return codes.INIT
    }

    var hasTransition = el.vue_trans === '',
        hasAnimation  = el.vue_anim === '',
        effectId      = el.vue_effect

    if (effectId) {
        return applyTransitionFunctions(
            el,
            stage,
            changeState,
            effectId,
            compiler
        )
    } else if (hasTransition || hasAnimation) {
        return applyTransitionClass(
            el,
            stage,
            changeState,
            hasAnimation
        )
    } else {
        changeState()
        return codes.SKIP
    }

}

/**
 *  Togggle a CSS class to trigger transition
 */
function applyTransitionClass (el, stage, changeState, hasAnimation) {

    if (!endEvents.trans) {
        changeState()
        return codes.CSS_SKIP
    }

    // if the browser supports transition,
    // it must have classList...
    var onEnd,
        classList        = el.classList,
        existingCallback = el.vue_trans_cb,
        enterClass       = config.enterClass,
        leaveClass       = config.leaveClass,
        endEvent         = hasAnimation ? endEvents.anim : endEvents.trans

    // cancel unfinished callbacks and jobs
    if (existingCallback) {
        el.removeEventListener(endEvent, existingCallback)
        classList.remove(enterClass)
        classList.remove(leaveClass)
        el.vue_trans_cb = null
    }

    if (stage > 0) { // enter

        // set to enter state before appending
        classList.add(enterClass)
        // append
        changeState()
        // trigger transition
        if (!hasAnimation) {
            batcher.push({
                execute: function () {
                    classList.remove(enterClass)
                }
            })
        } else {
            onEnd = function (e) {
                if (e.target === el) {
                    el.removeEventListener(endEvent, onEnd)
                    el.vue_trans_cb = null
                    classList.remove(enterClass)
                }
            }
            el.addEventListener(endEvent, onEnd)
            el.vue_trans_cb = onEnd
        }
        return codes.CSS_E

    } else { // leave

        if (el.offsetWidth || el.offsetHeight) {
            // trigger hide transition
            classList.add(leaveClass)
            onEnd = function (e) {
                if (e.target === el) {
                    el.removeEventListener(endEvent, onEnd)
                    el.vue_trans_cb = null
                    // actually remove node here
                    changeState()
                    classList.remove(leaveClass)
                }
            }
            // attach transition end listener
            el.addEventListener(endEvent, onEnd)
            el.vue_trans_cb = onEnd
        } else {
            // directly remove invisible elements
            changeState()
        }
        return codes.CSS_L
        
    }

}

function applyTransitionFunctions (el, stage, changeState, effectId, compiler) {

    var funcs = compiler.getOption('effects', effectId)
    if (!funcs) {
        changeState()
        return codes.JS_SKIP
    }

    var enter = funcs.enter,
        leave = funcs.leave,
        timeouts = el.vue_timeouts

    // clear previous timeouts
    if (timeouts) {
        var i = timeouts.length
        while (i--) {
            clearTO(timeouts[i])
        }
    }

    timeouts = el.vue_timeouts = []
    function timeout (cb, delay) {
        var id = setTO(function () {
            cb()
            timeouts.splice(timeouts.indexOf(id), 1)
            if (!timeouts.length) {
                el.vue_timeouts = null
            }
        }, delay)
        timeouts.push(id)
    }

    if (stage > 0) { // enter
        if (typeof enter !== 'function') {
            changeState()
            return codes.JS_SKIP_E
        }
        enter(el, changeState, timeout)
        return codes.JS_E
    } else { // leave
        if (typeof leave !== 'function') {
            changeState()
            return codes.JS_SKIP_L
        }
        leave(el, changeState, timeout)
        return codes.JS_L
    }

}

/**
 *  Sniff proper transition end event name
 */
function sniffEndEvents () {
    var el = document.createElement('vue'),
        defaultEvent = 'transitionend',
        events = {
            'webkitTransition' : 'webkitTransitionEnd',
            'transition'       : defaultEvent,
            'mozTransition'    : defaultEvent
        },
        ret = {}
    for (var name in events) {
        if (el.style[name] !== undefined) {
            ret.trans = events[name]
            break
        }
    }
    ret.anim = el.style.animation === ''
        ? 'animationend'
        : 'webkitAnimationEnd'
    return ret
}

// Expose some stuff for testing purposes
transition.codes = codes
transition.sniff = sniffEndEvents
},{"./batcher":77,"./config":80}],102:[function(require,module,exports){
var config       = require('./config'),
    toString     = ({}).toString,
    win          = window,
    console      = win.console,
    def          = Object.defineProperty,
    OBJECT       = 'object',
    THIS_RE      = /[^\w]this[^\w]/,
    BRACKET_RE_S = /\['([^']+)'\]/g,
    BRACKET_RE_D = /\["([^"]+)"\]/g,
    hasClassList = 'classList' in document.documentElement,
    ViewModel // late def

var defer =
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.setTimeout

/**
 *  Normalize keypath with possible brackets into dot notations
 */
function normalizeKeypath (key) {
    return key.indexOf('[') < 0
        ? key
        : key.replace(BRACKET_RE_S, '.$1')
             .replace(BRACKET_RE_D, '.$1')
}

var utils = module.exports = {

    /**
     *  Convert a string template to a dom fragment
     */
    toFragment: require('./fragment'),

    /**
     *  Parse the various types of template options
     */
    parseTemplateOption: require('./template-parser.js'),

    /**
     *  get a value from an object keypath
     */
    get: function (obj, key) {
        /* jshint eqeqeq: false */
        key = normalizeKeypath(key)
        if (key.indexOf('.') < 0) {
            return obj[key]
        }
        var path = key.split('.'),
            d = -1, l = path.length
        while (++d < l && obj != null) {
            obj = obj[path[d]]
        }
        return obj
    },

    /**
     *  set a value to an object keypath
     */
    set: function (obj, key, val) {
        /* jshint eqeqeq: false */
        key = normalizeKeypath(key)
        if (key.indexOf('.') < 0) {
            obj[key] = val
            return
        }
        var path = key.split('.'),
            d = -1, l = path.length - 1
        while (++d < l) {
            if (obj[path[d]] == null) {
                obj[path[d]] = {}
            }
            obj = obj[path[d]]
        }
        obj[path[d]] = val
    },

    /**
     *  return the base segment of a keypath
     */
    baseKey: function (key) {
        return key.indexOf('.') > 0
            ? key.split('.')[0]
            : key
    },

    /**
     *  Create a prototype-less object
     *  which is a better hash/map
     */
    hash: function () {
        return Object.create(null)
    },

    /**
     *  get an attribute and remove it.
     */
    attr: function (el, type) {
        var attr = config.prefix + '-' + type,
            val = el.getAttribute(attr)
        if (val !== null) {
            el.removeAttribute(attr)
        }
        return val
    },

    /**
     *  Define an ienumerable property
     *  This avoids it being included in JSON.stringify
     *  or for...in loops.
     */
    defProtected: function (obj, key, val, enumerable, writable) {
        def(obj, key, {
            value        : val,
            enumerable   : enumerable,
            writable     : writable,
            configurable : true
        })
    },

    /**
     *  A less bullet-proof but more efficient type check
     *  than Object.prototype.toString
     */
    isObject: function (obj) {
        return typeof obj === OBJECT && obj && !Array.isArray(obj)
    },

    /**
     *  A more accurate but less efficient type check
     */
    isTrueObject: function (obj) {
        return toString.call(obj) === '[object Object]'
    },

    /**
     *  Most simple bind
     *  enough for the usecase and fast than native bind()
     */
    bind: function (fn, ctx) {
        return function (arg) {
            return fn.call(ctx, arg)
        }
    },

    /**
     *  Make sure null and undefined output empty string
     */
    guard: function (value) {
        /* jshint eqeqeq: false, eqnull: true */
        return value == null
            ? ''
            : (typeof value == 'object')
                ? JSON.stringify(value)
                : value
    },

    /**
     *  When setting value on the VM, parse possible numbers
     */
    checkNumber: function (value) {
        return (isNaN(value) || value === null || typeof value === 'boolean')
            ? value
            : Number(value)
    },

    /**
     *  simple extend
     */
    extend: function (obj, ext) {
        for (var key in ext) {
            if (obj[key] !== ext[key]) {
                obj[key] = ext[key]
            }
        }
        return obj
    },

    /**
     *  filter an array with duplicates into uniques
     */
    unique: function (arr) {
        var hash = utils.hash(),
            i = arr.length,
            key, res = []
        while (i--) {
            key = arr[i]
            if (hash[key]) continue
            hash[key] = 1
            res.push(key)
        }
        return res
    },

    /**
     *  Convert the object to a ViewModel constructor
     *  if it is not already one
     */
    toConstructor: function (obj) {
        ViewModel = ViewModel || require('./viewmodel')
        return utils.isObject(obj)
            ? ViewModel.extend(obj)
            : typeof obj === 'function'
                ? obj
                : null
    },

    /**
     *  Check if a filter function contains references to `this`
     *  If yes, mark it as a computed filter.
     */
    checkFilter: function (filter) {
        if (THIS_RE.test(filter.toString())) {
            filter.computed = true
        }
    },

    /**
     *  convert certain option values to the desired format.
     */
    processOptions: function (options) {
        var components = options.components,
            partials   = options.partials,
            template   = options.template,
            filters    = options.filters,
            key
        if (components) {
            for (key in components) {
                components[key] = utils.toConstructor(components[key])
            }
        }
        if (partials) {
            for (key in partials) {
                partials[key] = utils.parseTemplateOption(partials[key])
            }
        }
        if (filters) {
            for (key in filters) {
                utils.checkFilter(filters[key])
            }
        }
        if (template) {
            options.template = utils.parseTemplateOption(template)
        }
    },

    /**
     *  used to defer batch updates
     */
    nextTick: function (cb) {
        defer(cb, 0)
    },

    /**
     *  add class for IE9
     *  uses classList if available
     */
    addClass: function (el, cls) {
        if (hasClassList) {
            el.classList.add(cls)
        } else {
            var cur = ' ' + el.className + ' '
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                el.className = (cur + cls).trim()
            }
        }
    },

    /**
     *  remove class for IE9
     */
    removeClass: function (el, cls) {
        if (hasClassList) {
            el.classList.remove(cls)
        } else {
            var cur = ' ' + el.className + ' ',
                tar = ' ' + cls + ' '
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ')
            }
            el.className = cur.trim()
        }
    },

    /**
     *  Convert an object to Array
     *  used in v-repeat and array filters
     */
    objectToArray: function (obj) {
        var res = [], val, data
        for (var key in obj) {
            val = obj[key]
            data = utils.isObject(val)
                ? val
                : { $value: val }
            data.$key = key
            res.push(data)
        }
        return res
    }
}

enableDebug()
function enableDebug () {
    /**
     *  log for debugging
     */
    utils.log = function (msg) {
        if (config.debug && console) {
            console.log(msg)
        }
    }
    
    /**
     *  warnings, traces by default
     *  can be suppressed by `silent` option.
     */
    utils.warn = function (msg) {
        if (!config.silent && console) {
            console.warn(msg)
            if (config.debug && console.trace) {
                console.trace()
            }
        }
    }
}
},{"./config":80,"./fragment":96,"./template-parser.js":99,"./viewmodel":103}],103:[function(require,module,exports){
var Compiler   = require('./compiler'),
    utils      = require('./utils'),
    transition = require('./transition'),
    Batcher    = require('./batcher'),
    slice      = [].slice,
    def        = utils.defProtected,
    nextTick   = utils.nextTick,

    // batch $watch callbacks
    watcherBatcher = new Batcher(),
    watcherId      = 1

/**
 *  ViewModel exposed to the user that holds data,
 *  computed properties, event handlers
 *  and a few reserved methods
 */
function ViewModel (options) {
    // compile if options passed, if false return. options are passed directly to compiler
    if (options === false) return
    new Compiler(this, options)
}

// All VM prototype methods are inenumerable
// so it can be stringified/looped through as raw data
var VMProto = ViewModel.prototype

/**
 *  init allows config compilation after instantiation:
 *    var a = new Vue(false)
 *    a.init(config)
 */
def(VMProto, '$init', function (options) {
    new Compiler(this, options)
})

/**
 *  Convenience function to get a value from
 *  a keypath
 */
def(VMProto, '$get', function (key) {
    var val = utils.get(this, key)
    return val === undefined && this.$parent
        ? this.$parent.$get(key)
        : val
})

/**
 *  Convenience function to set an actual nested value
 *  from a flat key string. Used in directives.
 */
def(VMProto, '$set', function (key, value) {
    utils.set(this, key, value)
})

/**
 *  watch a key on the viewmodel for changes
 *  fire callback with new value
 */
def(VMProto, '$watch', function (key, callback) {
    // save a unique id for each watcher
    var id = watcherId++,
        self = this
    function on () {
        var args = slice.call(arguments)
        watcherBatcher.push({
            id: id,
            override: true,
            execute: function () {
                callback.apply(self, args)
            }
        })
    }
    callback._fn = on
    self.$compiler.observer.on('change:' + key, on)
})

/**
 *  unwatch a key
 */
def(VMProto, '$unwatch', function (key, callback) {
    // workaround here
    // since the emitter module checks callback existence
    // by checking the length of arguments
    var args = ['change:' + key],
        ob = this.$compiler.observer
    if (callback) args.push(callback._fn)
    ob.off.apply(ob, args)
})

/**
 *  unbind everything, remove everything
 */
def(VMProto, '$destroy', function (noRemove) {
    this.$compiler.destroy(noRemove)
})

/**
 *  broadcast an event to all child VMs recursively.
 */
def(VMProto, '$broadcast', function () {
    var children = this.$compiler.children,
        i = children.length,
        child
    while (i--) {
        child = children[i]
        child.emitter.applyEmit.apply(child.emitter, arguments)
        child.vm.$broadcast.apply(child.vm, arguments)
    }
})

/**
 *  emit an event that propagates all the way up to parent VMs.
 */
def(VMProto, '$dispatch', function () {
    var compiler = this.$compiler,
        emitter = compiler.emitter,
        parent = compiler.parent
    emitter.applyEmit.apply(emitter, arguments)
    if (parent) {
        parent.vm.$dispatch.apply(parent.vm, arguments)
    }
})

/**
 *  delegate on/off/once to the compiler's emitter
 */
;['emit', 'on', 'off', 'once'].forEach(function (method) {
    // internal emit has fixed number of arguments.
    // exposed emit uses the external version
    // with fn.apply.
    var realMethod = method === 'emit'
        ? 'applyEmit'
        : method
    def(VMProto, '$' + method, function () {
        var emitter = this.$compiler.emitter
        emitter[realMethod].apply(emitter, arguments)
    })
})

// DOM convenience methods

def(VMProto, '$appendTo', function (target, cb) {
    target = query(target)
    var el = this.$el
    transition(el, 1, function () {
        target.appendChild(el)
        if (cb) nextTick(cb)
    }, this.$compiler)
})

def(VMProto, '$remove', function (cb) {
    var el = this.$el
    transition(el, -1, function () {
        if (el.parentNode) {
            el.parentNode.removeChild(el)
        }
        if (cb) nextTick(cb)
    }, this.$compiler)
})

def(VMProto, '$before', function (target, cb) {
    target = query(target)
    var el = this.$el
    transition(el, 1, function () {
        target.parentNode.insertBefore(el, target)
        if (cb) nextTick(cb)
    }, this.$compiler)
})

def(VMProto, '$after', function (target, cb) {
    target = query(target)
    var el = this.$el
    transition(el, 1, function () {
        if (target.nextSibling) {
            target.parentNode.insertBefore(el, target.nextSibling)
        } else {
            target.parentNode.appendChild(el)
        }
        if (cb) nextTick(cb)
    }, this.$compiler)
})

function query (el) {
    return typeof el === 'string'
        ? document.querySelector(el)
        : el
}

module.exports = ViewModel

},{"./batcher":77,"./compiler":79,"./transition":101,"./utils":102}],104:[function(require,module,exports){
/**
 * DEVELOPED BY
 * GIL LOPES BUENO
 * gilbueno.mail@gmail.com
 *
 * WORKS WITH:
 * IE 9+, FF 4+, SF 5+, WebKit, CH 7+, OP 12+, BESEN, Rhino 1.7+
 *
 * FORK:
 * https://github.com/melanke/Watch.JS
 */

"use strict";
(function (factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        window.WatchJS = factory();
        window.watch = window.WatchJS.watch;
        window.unwatch = window.WatchJS.unwatch;
        window.callWatchers = window.WatchJS.callWatchers;
    }
}(function () {

    var WatchJS = {
        noMore: false
    },
    defineWatcher,
    unwatchOne,
    callWatchers;

    var isFunction = function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    };

    var isInt = function (x) {
        return x % 1 === 0;
    };

    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var isModernBrowser = function () {
        return Object.defineProperty || Object.prototype.__defineGetter__;
    };

    var defineGetAndSet = function (obj, propName, getter, setter) {
        try {
                Object.defineProperty(obj, propName, {
                        get: getter,
                        set: setter,
                        enumerable: true,
                        configurable: true
                });
        } catch(error) {
            try{
                Object.prototype.__defineGetter__.call(obj, propName, getter);
                Object.prototype.__defineSetter__.call(obj, propName, setter);
            }catch(error2){
                throw "watchJS error: browser not supported :/"
            }
        }
    };

    var defineProp = function (obj, propName, value) {
        try {
            Object.defineProperty(obj, propName, {
                enumerable: false,
                configurable: true,
                writable: false,
                value: value
            });
        } catch(error) {
            obj[propName] = value;
        }
    };

    var watch = function () {

        if (isFunction(arguments[1])) {
            watchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            watchMany.apply(this, arguments);
        } else {
            watchOne.apply(this, arguments);
        }

    };


    var watchAll = function (obj, watcher, level) {

        if (obj instanceof String || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        var props = [];


        if(isArray(obj)) {
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
        } else {
            for (var prop2 in obj) { //for each attribute if obj is an object
                props.push(prop2); //put in the props
            }
        }

        watchMany(obj, props, watcher, level); //watch all itens of the props
    };


    var watchMany = function (obj, props, watcher, level) {

        for (var prop in props) { //watch each attribute of "props" if is an object
            watchOne(obj, props[prop], watcher, level);
        }

    };

    var watchOne = function (obj, prop, watcher, level) {

        if(isFunction(obj[prop])) { //dont watch if it is a function
            return;
        }

        if(obj[prop] != null && (level === undefined || level > 0)){
            if(level !== undefined){
                level--;
            }
            watchAll(obj[prop], watcher, level); //recursively watch all attributes of this
        }

        defineWatcher(obj, prop, watcher);

    };

    var unwatch = function () {

        if (isFunction(arguments[1])) {
            unwatchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            unwatchMany.apply(this, arguments);
        } else {
            unwatchOne.apply(this, arguments);
        }

    };

    var unwatchAll = function (obj, watcher) {

        if (obj instanceof String || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        var props = [];


        if (isArray(obj)) {
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
        } else {
            for (var prop2 in obj) { //for each attribute if obj is an object
                props.push(prop2); //put in the props
            }
        }

        unwatchMany(obj, props, watcher); //watch all itens of the props
    };


    var unwatchMany = function (obj, props, watcher) {

        for (var prop2 in props) { //watch each attribute of "props" if is an object
            unwatchOne(obj, props[prop2], watcher);
        }
    };

    if(isModernBrowser()){

        defineWatcher = function (obj, prop, watcher) {

            var val = obj[prop];

            watchFunctions(obj, prop);

            if (!obj.watchers) {
                defineProp(obj, "watchers", {});
            }

            if (!obj.watchers[prop]) {
                obj.watchers[prop] = [];
            }


            obj.watchers[prop].push(watcher); //add the new watcher in the watchers array


            var getter = function () {
                return val;
            };


            var setter = function (newval) {
                var oldval = val;
                val = newval;

                if (obj[prop]){
                    watchAll(obj[prop], watcher);
                }

                watchFunctions(obj, prop);

                if (!WatchJS.noMore){
                    if (JSON.stringify(oldval) !== JSON.stringify(newval)) {
                        callWatchers(obj, prop, "set", newval, oldval);
                        WatchJS.noMore = false;
                    }
                }
            };

            defineGetAndSet(obj, prop, getter, setter);

        };

        callWatchers = function (obj, prop, action, newval, oldval) {

            for (var wr in obj.watchers[prop]) {
                if (isInt(wr)){
                    obj.watchers[prop][wr].call(obj, prop, action, newval, oldval);
                }
            }
        };

        // @todo code related to "watchFunctions" is certainly buggy
        var methodNames = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift'];
        var defineArrayMethodWatcher = function (obj, prop, original, methodName) {
            defineProp(obj[prop], methodName, function () {
                var response = original.apply(obj[prop], arguments);
                watchOne(obj, obj[prop]);
                if (methodName !== 'slice') {
                    callWatchers(obj, prop, methodName,arguments);
                }
                return response;
            });
        };

        var watchFunctions = function(obj, prop) {

            if ((!obj[prop]) || (obj[prop] instanceof String) || (!isArray(obj[prop]))) {
                return;
            }

            for (var i = methodNames.length, methodName; i--;) {
                methodName = methodNames[i];
                defineArrayMethodWatcher(obj, prop, obj[prop][methodName], methodName);
            }

        };

        unwatchOne = function (obj, prop, watcher) {
            for(var i in obj.watchers[prop]){
                var w = obj.watchers[prop][i];

                if(w == watcher) {
                    obj.watchers[prop].splice(i, 1);
                }
            }
        };

    } else {
        //this implementation dont work because it cant handle the gap between "settings".
        //I mean, if you use a setter for an attribute after another setter of the same attribute it will only fire the second
        //but I think we could think something to fix it

        var subjects = [];

        defineWatcher = function(obj, prop, watcher){

            subjects.push({
                obj: obj,
                prop: prop,
                serialized: JSON.stringify(obj[prop]),
                watcher: watcher
            });

        };

        unwatchOne = function (obj, prop, watcher) {

            for (var i in subjects) {
                var subj = subjects[i];

                if (subj.obj == obj && subj.prop == prop && subj.watcher == watcher) {
                    subjects.splice(i, 1);
                }

            }

        };

        callWatchers = function (obj, prop, action, value) {

            for (var i in subjects) {
                var subj = subjects[i];

                if (subj.obj == obj && subj.prop == prop) {
                    subj.watcher.call(obj, prop, action, value);
                }

            }

        };

        var loop = function(){

            for(var i in subjects){

                var subj = subjects[i];
                var newSer = JSON.stringify(subj.obj[subj.prop]);
                if(newSer != subj.serialized){
                    subj.watcher.call(subj.obj, subj.prop, subj.obj[subj.prop], JSON.parse(subj.serialized));
                    subj.serialized = newSer;
                }

            }

        };

        setInterval(loop, 50);

    }

    WatchJS.watch = watch;
    WatchJS.unwatch = unwatch;
    WatchJS.callWatchers = callWatchers;

    return WatchJS;

}));

},{}],105:[function(require,module,exports){

/// Serialize the a name value pair into a cookie string suitable for
/// http headers. An optional options object specified cookie parameters
///
/// serialize('foo', 'bar', { httpOnly: true })
///   => "foo=bar; httpOnly"
///
/// @param {String} name
/// @param {String} val
/// @param {Object} options
/// @return {String}
var serialize = function(name, val, opt){
    opt = opt || {};
    var enc = opt.encode || encode;
    var pairs = [name + '=' + enc(val)];

    if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
        pairs.push('Max-Age=' + maxAge);
    }

    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');

    return pairs.join('; ');
};

/// Parse the given cookie header string into an object
/// The object has the various cookies as keys(names) => values
/// @param {String} str
/// @return {Object}
var parse = function(str, opt) {
    opt = opt || {};
    var obj = {}
    var pairs = str.split(/; */);
    var dec = opt.decode || decode;

    pairs.forEach(function(pair) {
        var eq_idx = pair.indexOf('=')

        // skip things that don't look like key=value
        if (eq_idx < 0) {
            return;
        }

        var key = pair.substr(0, eq_idx).trim()
        var val = pair.substr(++eq_idx, pair.length).trim();

        // quoted values
        if ('"' == val[0]) {
            val = val.slice(1, -1);
        }

        // only assign once
        if (undefined == obj[key]) {
            try {
                obj[key] = dec(val);
            } catch (e) {
                obj[key] = val;
            }
        }
    });

    return obj;
};

var encode = encodeURIComponent;
var decode = decodeURIComponent;

module.exports.serialize = serialize;
module.exports.parse = parse;

},{}],106:[function(require,module,exports){
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  }
  else if (typeof module === "object" && module && typeof module.exports === "object") {
    module.exports = factory();
  } else {
    global.analytics = factory();
  }
}(this, function() {

  // Make sure _gaq is on the global so we don't die trying to access it
  if(!this._gaq) {
    this._gaq = [];
  }

  // Make sure optimizely is on the global so we don't die trying to access it
  if(!this.optimizely) {
    this.optimizely = [];
  }

  // Use hostname for GA Category
  var _category = location.hostname,
      _redacted = "REDACTED (Potential Email Address)";

  /**
   * To Title Case 2.1 - http://individed.com/code/to-title-case/
   * Copyright 2008-2013 David Gouch. Licensed under the MIT License.
   * https://github.com/gouch/to-title-case
   */
  function toTitleCase(s){
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    s = trim(s);

    return s.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
      if (index > 0 &&
          index + match.length !== title.length &&
          match.search(smallWords) > -1 &&
          title.charAt(index - 2) !== ":" &&
          (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
          title.charAt(index - 1).search(/[^\s-]/) < 0) {
        return match.toLowerCase();
      }

      if (match.substr(1).search(/[A-Z]|\../) > -1) {
        return match;
      }

      return match.charAt(0).toUpperCase() + match.substr(1);
    });
  }

  // GA strings need to have leading/trailing whitespace trimmed, and not all
  // browsers have String.prototoype.trim().
  function trim(s) {
    return s.replace(/^\s+|\s+$/g, '');
  }

  // See if s could be an email address. We don't want to send personal data like email.
  function mightBeEmail(s) {
    // There's no point trying to validate rfc822 fully, just look for ...@...
    return (/[^@]+@[^@]+/).test(s);
  }

  function warn(msg) {
    console.warn("[analytics] " + msg);
  }

  // Support both types of Google Analytics Event Tracking, see:
  // ga.js - https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
  // analytics.js - https://developers.google.com/analytics/devguides/collection/analyticsjs/events
  function _gaEvent(options) {
    // If the new analytics.js API is present, fire this event using ga().
    if(typeof ga === "function") {
      // Transform the argument array to match the expected call signature for ga(), see:
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/events#overview
      var fieldObject = {
        'hitType': 'event',
        'eventCategory': _category,
        'eventAction': options.action
      };
      if(options.label) {
        fieldObject['eventLabel'] = options.label;
      }
      if(options.value || options.value === 0) {
        fieldObject['eventValue'] = options.value;
      }
      if(options.nonInteraction === true) {
        fieldObject['nonInteraction'] = 1;
      }
      ga('send', fieldObject);
    }

    // Also support the old API. Google suggests firing data at both to be the right thing.
    var eventArgs = ['_trackEvent', _category, options.action];
    if(options.label) {
      eventArgs[3] = options.label;
    }
    if(options.value || options.value === 0) {
      eventArgs[4] = options.value;
    }
    if(options.nonInteraction === true) {
      eventArgs[5] = true;
    }
    _gaq.push(eventArgs);
  }

  function event(action, options) {
    options = options || {};
    var eventOptions = {},
        label = options.label,
        value = options.value,
        // Support both forms to deal with typos between the 2 APIs
        nonInteraction = options.noninteraction || options.nonInteraction;

    if(!action) {
      warn("Expected `action` arg.");
      return;
    }
    if(mightBeEmail(action)) {
      warn("`action` arg looks like an email address, redacting.");
      action = _redacted;
    }
    eventOptions.action = toTitleCase(action);

    // label: An optional string to provide additional dimensions to the event data.
    if(label) {
      if(typeof label !== "string") {
        warn("Expected `label` arg to be a String.");
      } else {
        if(mightBeEmail(label)) {
          warn("`label` arg looks like an email address, redacting.");
          label = _redacted;
        }
        eventOptions.label = trim(label);
      }
    }

    // value: An optional integer that you can use to provide numerical data about
    // the user event.
    if(value || value === 0) {
      if(typeof value !== "number") {
        warn("Expected `value` arg to be a Number.");
      } else {
        // Force value to int
        eventOptions.value = value|0;
      }
    }

    // noninteraction: An optional boolean that when set to true, indicates that
    // the event hit will not be used in bounce-rate calculation.
    if(nonInteraction) {
      if(typeof nonInteraction !== "boolean") {
        warn("Expected `noninteraction` arg to be a Boolean.");
      } else {
        eventOptions.nonInteraction = nonInteraction === true;
      }
    }

    _gaEvent(eventOptions);
  }

  // Use a consistent prefix and check if arg starts with a forward slash
  function prefixVirtualPageview(s) {
    // Bail if s is already prefixed.
    if(/^\/virtual\//.test(s)) {
      return s;
    }
    // Make sure s has a leading / then add prefix and return
    s = s.replace(/^[/]?/, '/');
    return '/virtual' + s;
  }

  // Support both types of Google Analytics Tracking, see:
  // ga.js - https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._trackPageview
  // analytics.js - https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
  function _gaVirtualPageView(options) {
    // If the new analytics.js API is present, fire this event using ga().
    if(typeof ga === "function") {
      // Transform the argument array to match the expected call signature for ga():
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
      var fieldObject = {
        'hitType': 'pageview',
        'page': options.virtualPagePath
      };
      ga('send', fieldObject);
    }

    // Also support the old API. Google suggests firing data at both to be the right thing.
    var eventArgs = ['_trackPageview', options.virtualPagePath];
    _gaq.push(eventArgs);
  }

  function virtualPageview(virtualPagePath) {
    if(!virtualPagePath) {
      warn("Expected `virtualPagePath` arg.");
      return;
    }
    virtualPagePath = trim(virtualPagePath);

    var eventOptions = {};
    eventOptions.virtualPagePath = prefixVirtualPageview(virtualPagePath);

    _gaVirtualPageView(eventOptions);
  }


  function _optimizely(options) {
    var eventArgs = ['trackEvent', options.action];

    // check if we are giving this conversion financial value
    if (options.revenue) {
      var args = {
        revenue: options.revenue
      };
      eventArgs[2] = args;
    }

    optimizely.push(eventArgs);
  }

  function conversionGoal(action, options) {
    options = options || {};
    var eventOptions = {},
        valueInCents = options.valueInCents;

    if(!action) {
      warn("Expected `action` arg.");
      return;
    }
    eventOptions.action = trim(action);

    // valueInCents: An optional integer to track revenue - for example from fundraising appeal.
    if(valueInCents) {
      if((typeof valueInCents === 'number') && (valueInCents % 1 === 0)) {
        eventOptions.revenue = valueInCents;
      } else {
        warn("Expected `valueInCents` arg to be an integer.");
      }
    }

    _optimizely(eventOptions);
  }

  return {
    event: event,
    virtualPageview: virtualPageview,
    conversionGoal: conversionGoal
  };

}));

},{}],107:[function(require,module,exports){
/*global localStorage, location, define*/

(function (window) {
  var usernameRegex = /^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\-]{1,20}$/;

  function webmakerAuthClientDefinition(EventEmitter, cookiejs, analytics) {

    return function WebmakerAuthClient(options) {

      if (!window.localStorage) {
        console.error('Local storage must be supported for instant login.');
      }

      var self = this;

      var referralCookieSettings = {
        // grab only the first two parts of the hostname
        domain: location.hostname.split('.').slice(-2).join('.'),
        path: '/',
        // secure cookie if connection uses TLS
        secure: location.protocol === 'https:',
        // expire in one week
        expires: new Date((Date.now() + 60 * 1000 * 60 * 24 * 7))
      };
      var refValue = /ref=((?:\w|-)+)/.exec(window.location.search);
      var cookieRefValue = cookiejs.parse(document.cookie).webmakerReferral;

      if (refValue) {
        refValue = refValue[1];
      }

      options = options || {};
      options.paths = options.paths || {};

      // For handling events
      self.emitter = new EventEmitter();

      // Config
      self.host = options.host || '';
      self.paths = options.paths || {};
      self.paths.authenticate = options.paths.authenticate || '/authenticate';
      self.paths.create = options.paths.create || '/create';
      self.paths.verify = options.paths.verify || '/verify';
      self.paths.logout = options.paths.logout || '/logout';
      self.paths.checkUsername = options.paths.checkUsername || '/check-username';
      self.urls = {
        authenticate: self.host + self.paths.authenticate,
        create: self.host + self.paths.create,
        verify: self.host + self.paths.verify,
        logout: self.host + self.paths.logout,
        checkUsername: self.host + self.paths.checkUsername
      };
      self.audience = options.audience || (window.location.protocol + '//' + window.location.host);
      self.prefix = options.prefix || 'webmaker-';
      self.timeout = options.timeout || 10;
      self.localStorageKey = self.prefix + 'login';
      self.csrfToken = options.csrfToken;
      // Needed when cookie-issuing server is on a different port than the client
      self.withCredentials = options.withCredentials === false ? false : true;

      // save referrer value
      if (refValue) {
        if (cookieRefValue !== refValue) {
          document.cookie = cookiejs.serialize('webmakerReferral', refValue, referralCookieSettings);
          cookieRefValue = refValue;
        }
      }

      // remove the cookie after the referrer value has been saved
      self.clearReferrerCookie = function () {
        var expireReferralCookieSettings = referralCookieSettings;
        // set this to a past date so that it is removed
        expireReferralCookieSettings.expires = new Date((Date.now() - 10000));
        document.cookie = cookiejs.serialize('webmakerReferral', 'expire', expireReferralCookieSettings);
      };

      // Create New User Modal
      self.handleNewUserUI = options.handleNewUserUI === false ? false : true;

      // This is a separate function because Angular apps use their own modal
      self.analytics = {};
      self.analytics.webmakerNewUserCancelled = function () {
        analytics.event('Webmaker New User Cancelled');
      };

      // You can override any of these if necessary
      self.modal = {};
      self.modal.element = document.getElementById('webmaker-login-new-user');
      self.modal.dismissSelector = '[data-dismiss]';
      self.modal.createSelector = '.create-user';
      self.modal.createBtnOnClick = function () {};

      self.modal.checkUsernameOnChange = function () {
        var usernameTakenError = self.modal.element.querySelector('.username-taken-error');
        var usernameInvalidError = self.modal.element.querySelector('.username-invalid-error');
        var usernameRequiredError = self.modal.element.querySelector('.username-required-error');
        var usernameGroup = self.modal.element.querySelector('.username-group');
        var username = this.value;
        if (!username) {
          usernameGroup.classList.remove('has-success');
          usernameGroup.classList.add('has-error');
          usernameTakenError.classList.add('hidden');
          usernameRequiredError.classList.remove('hidden');
          usernameInvalidError.classList.add('hidden');
          return;
        }
        self.checkUsername(username, function (error, message) {
          if (error && message === 'Username taken') {
            usernameGroup.classList.add('has-error');
            usernameGroup.classList.remove('has-success');
            usernameTakenError.classList.remove('hidden');
            usernameRequiredError.classList.add('hidden');
            usernameInvalidError.classList.add('hidden');
          } else if (error && message === 'Username invalid') {
            usernameGroup.classList.add('has-error');
            usernameGroup.classList.remove('has-success');
            usernameInvalidError.classList.remove('hidden');
            usernameTakenError.classList.add('hidden');
            usernameRequiredError.classList.add('hidden');
          } else {
            usernameGroup.classList.remove('has-error');
            usernameGroup.classList.add('has-success');
            usernameTakenError.classList.add('hidden');
            usernameRequiredError.classList.add('hidden');
            usernameInvalidError.classList.add('hidden');
          }
        });
      };

      self.modal.setup = function (assertion, email) {
        var createBtn = self.modal.element.querySelector(self.modal.createSelector);
        var closeBtns = self.modal.element.querySelectorAll(self.modal.dismissSelector);

        var usernameGroup = self.modal.element.querySelector('.username-group');
        var agreeGroup = self.modal.element.querySelector('.agree-group');

        var usernameTakenError = self.modal.element.querySelector('.username-taken-error');
        var usernameRequiredError = self.modal.element.querySelector('.username-required-error');
        var usernameInvalidError = self.modal.element.querySelector('.username-invalid-error');
        var agreeError = self.modal.element.querySelector('.agree-error');

        var usernameInput = self.modal.element.querySelector('[name="username"]');
        var agreeInput = self.modal.element.querySelector('[name="agreeToTerms"]');
        var mailingListInput = self.modal.element.querySelector('[name="mailingList"]');
        var languagePreference = self.modal.element.querySelector('[name=supportedLocales]');

        createBtn.removeEventListener('click', self.modal.createBtnOnClick, false);
        usernameInput.addEventListener('change', self.modal.checkUsernameOnChange, false);

        self.modal.createBtnOnClick = function () {
          var hasError = false;

          if (!agreeInput.checked) {
            agreeGroup.classList.add('has-error');
            agreeError.classList.remove('hidden');
            hasError = true;
          }

          if (!usernameInput.value) {
            usernameGroup.classList.remove('has-success');
            usernameGroup.classList.add('has-error');
            usernameTakenError.classList.add('hidden');
            usernameRequiredError.classList.remove('hidden');
            usernameInvalidError.classList.add('hidden');
            hasError = true;
          }

          if (hasError) {
            return;
          }

          self.checkUsername(usernameInput.value, function (error, message) {
            if (error && message === 'Username taken') {
              usernameGroup.classList.add('has-error');
              usernameGroup.classList.remove('has-success');
              usernameTakenError.classList.remove('hidden');
              usernameRequiredError.classList.add('hidden');
              usernameInvalidError.classList.add('hidden');
            } else if (error && message === 'Username invalid') {
              usernameGroup.classList.add('has-error');
              usernameGroup.classList.remove('has-success');
              usernameInvalidError.classList.remove('hidden');
              usernameTakenError.classList.add('hidden');
              usernameRequiredError.classList.add('hidden');
            } else {
              self.createUser({
                assertion: assertion,
                user: {
                  username: usernameInput.value,
                  mailingList: mailingListInput.checked,
                  prefLocale: languagePreference.value
                }
              }, function (err) {
                if (err) {
                  console.error(err);
                  return;
                }

                usernameTakenError.classList.add('hidden');
                usernameRequiredError.classList.add('hidden');
                usernameInvalidError.classList.add('hidden');
                agreeError.classList.add('hidden');

                usernameGroup.classList.remove('has-error');
                usernameGroup.classList.remove('has-success');
                agreeGroup.classList.remove('has-error');

                self.modal.close();
              });
            }
          });

        };

        for (var i = 0; i < closeBtns.length; i++) {
          closeBtns[i].removeEventListener('click', self.modal.close, false);
          closeBtns[i].addEventListener('click', self.modal.close, false);
        }
        createBtn.addEventListener('click', self.modal.createBtnOnClick, false);
      };

      self.modal.open = function () {
        self.modal.element.classList.add('in');
        self.modal.element.style.display = 'block';
        self.modal.element.setAttribute('aria-hidden', false);
      };

      self.modal.close = function (event) {
        // If close is called by the user via addEventListener we'll get the event object
        if (event) {
          self.analytics.webmakerNewUserCancelled();
        }

        self.modal.element.classList.remove('in');
        self.modal.element.style.display = 'none';
        self.modal.element.setAttribute('aria-hidden', true);
      };

      self.on = function (event, cb) {
        self.emitter.addListener(event, cb);
      };

      self.off = function (event, cb) {
        self.emitter.removeListener(event, cb);
      };

      self.checkUsername = function (username, callback) {
        if (!usernameRegex.test(username)) {
          return callback(true, 'Username invalid');
        }
        var http = new XMLHttpRequest();
        var body = JSON.stringify({
          username: username
        });

        http.open('POST', self.urls.checkUsername, true);
        http.withCredentials = self.withCredentials;
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('X-CSRF-Token', self.csrfToken);

        http.onreadystatechange = function () {
          if (http.readyState === 4 && http.status === 200) {
            var response = JSON.parse(http.responseText);

            // Username exists;
            if (response.exists) {
              callback(true, 'Username taken');
            } else {
              callback(false, 'Username not taken');
            }

          }
          // Some other error
          else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
            self.emitter.emit('error', http.responseText);
            callback(false, 'Error checking username');
          }

          // No response
          else if (http.readyState === 4) {
            self.emitter.emit('error', 'Looks like ' + self.urls.checkUsername + ' is not responding...');
            callback(false, 'Error checking username');
          }

        };

        http.send(body);

      };

      self.createUser = function (data, callback) {

        // capture the referrer ID if it exists
        data.user.referrer = cookieRefValue;

        var http = new XMLHttpRequest();
        var body = JSON.stringify({
          assertion: data.assertion,
          audience: self.audience,
          user: data.user
        });
        callback = callback || function () {};

        http.open('POST', self.urls.create, true);
        http.withCredentials = self.withCredentials;
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('X-CSRF-Token', self.csrfToken);

        http.onreadystatechange = function () {
          if (http.readyState === 4 && http.status === 200) {
            var data = JSON.parse(http.responseText);

            // User creation successful
            if (data.user) {
              self.storage.set(data.user);
              self.emitter.emit('login', data.user, 'user created');
              analytics.event('Webmaker New User Created', {
                nonInteraction: true
              });
              analytics.conversionGoal('WebmakerNewUserCreated');
              self.clearReferrerCookie();
              callback(null, data.user);
            } else {
              self.emitter.emit('error', http.responseText);
              callback(http.responseText);
            }

          }

          // Some other error
          else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
            self.emitter.emit('error', http.responseText);
            callback(http.responseText);
          }

          // No response
          else if (http.readyState === 4) {
            self.emitter.emit('error', 'Looks like ' + self.urls.create + ' is not responding...');
            callback(http.responseText);
          }

        };

        http.send(body);

      };

      self.verify = function () {

        if (self.storage.get()) {
          self.emitter.emit('login', self.storage.get(), 'restored');
        }

        var email = self.storage.get('email');

        var http = new XMLHttpRequest();

        http.open('POST', self.urls.verify, true);
        http.withCredentials = self.withCredentials;
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('X-CSRF-Token', self.csrfToken);
        http.onreadystatechange = function () {
          if (http.readyState === 4 && http.status === 200) {
            var data = JSON.parse(http.responseText);

            // Email is the same as response.
            if (email && data.email === email) {
              self.emitter.emit('login', data.user, 'verified');
              self.storage.set(data.user);
            }

            // Email is not the same, but is a cookie
            else if (data.user) {
              self.emitter.emit('login', data.user, 'email mismatch');
              self.storage.set(data.user);
            }

            // No cookie
            else {
              self.emitter.emit('logout');
              self.storage.clear();
            }

          }

          // Some other error
          else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
            self.emitter.emit('error', http.responseText);
          }

          // No response
          else if (http.readyState === 4) {
            self.emitter.emit('error', 'Looks like ' + self.urls.verify + ' is not responding...');
          }

        };

        http.send();

      };

      self.login = function () {

        if (!window.navigator.id) {
          console.error('No persona found. Did you include include.js?');
          return;
        }

        analytics.event('Webmaker Login Clicked');

        window.removeEventListener('focus', self.verify, false);

        window.navigator.id.get(function (assertion) {

          if (!assertion) {
            self.emitter.emit('error', 'No assertion was received');

            analytics.event('Persona Login Cancelled');

            return;
          }

          analytics.event('Persona Login Succeeded');

          // capture the referrer ID if it exists, using the 'user' value
          // for consistency with self.createUser
          var user = {
            referrer: cookieRefValue
          };

          var http = new XMLHttpRequest();
          var body = JSON.stringify({
            audience: self.audience,
            assertion: assertion,
            user: user
          });

          if (self.timeout) {
            var timeoutInstance = setTimeout(function () {
              http.abort();
              self.emitter.emit('error', 'The request for a token timed out after ' + self.timeout + ' seconds');
            }, self.timeout * 1000);
          }

          http.open('POST', self.urls.authenticate, true);
          http.withCredentials = self.withCredentials;
          http.setRequestHeader('Content-type', 'application/json');
          http.setRequestHeader('X-CSRF-Token', self.csrfToken);
          http.onreadystatechange = function () {

            // Clear the timeout
            if (self.timeout && timeoutInstance) {
              clearTimeout(timeoutInstance);
            }

            if (http.readyState === 4 && http.status === 200) {
              var data = JSON.parse(http.responseText);

              // There was an error
              if (data.error) {
                self.emitter.emit('error', data.error);
              }

              // User exists
              if (data.user) {
                self.storage.set(data.user);
                self.emitter.emit('login', data.user);
                analytics.event('Webmaker Login Succeeded');
                self.clearReferrerCookie();
                window.addEventListener('focus', self.verify, false);
              }

              // Email valid, user does not exist
              if (data.email && !data.user) {
                self.emitter.emit('newuser', assertion, data.email);
                analytics.event('Webmaker New User Started');

                // If handleNewUserUI is true, show the modal with correct data
                if (self.handleNewUserUI) {
                  self.modal.setup(assertion, data.email);
                  self.modal.open();
                }
              }

              if (data.err) {
                self.emitter.emit('error', data.err);
              }

            }

            // Some other error
            else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
              self.emitter.emit('error', http.responseText);
            }

            // No response
            else if (http.readyState === 4) {
              self.emitter.emit('error', 'Looks like ' + self.urls.authenticate + ' is not responding...');
            }

          };

          http.send(body);

        }, {
          backgroundColor: '#E3EAEE',
          privacyPolicy: 'https://webmaker.org/privacy',
          siteLogo: 'https://stuff.webmaker.org/persona-assets/logo-webmaker.png',
          siteName: 'Mozilla Webmaker',
          termsOfService: 'https://webmaker.org/terms'
        });

      };

      self.logout = function () {

        analytics.event('Webmaker Logout Clicked');

        window.removeEventListener('focus', self.verify, false);

        var http = new XMLHttpRequest();
        http.open('POST', self.urls.logout, true);
        http.withCredentials = self.withCredentials;
        http.setRequestHeader('X-CSRF-Token', self.csrfToken);
        http.onreadystatechange = function () {

          if (http.readyState === 4 && http.status === 200) {
            self.emitter.emit('logout');
            self.storage.clear();
            window.addEventListener('focus', self.verify, false);
          }

          // Some other error
          else if (http.readyState === 4 && http.status && (http.status >= 400 || http.status < 200)) {
            self.emitter.emit('error', http.responseText);
          }

          // No response
          else if (http.readyState === 4) {
            self.emitter.emit('error', 'Looks like ' + self.urls.logout + ' is not responding...');
          }
        };
        http.send(null);

      };

      // Utilities for accessing local storage
      self.storage = {
        get: function (key) {
          var data = JSON.parse(localStorage.getItem(self.localStorageKey));
          if (!data) {
            return;
          }
          if (key) {
            return data[key];
          } else {
            return data;
          }
        },
        set: function (data) {
          var userObj = JSON.parse(localStorage.getItem(self.localStorageKey)) || {};
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              userObj[key] = data[key];
            }
          }
          localStorage.setItem(self.localStorageKey, JSON.stringify(userObj));
        },
        clear: function () {
          delete localStorage[self.localStorageKey];
        }
      };

    };
  }

  // AMD
  if (typeof define === 'function' && define.amd) {
    define(['eventEmitter/EventEmitter', 'cookie-js/cookie', 'analytics'], webmakerAuthClientDefinition);
  }

  // CommonJS
  else if (typeof module === 'object' && module.exports) {
    var cookiejs = require('cookie');
    var EventEmitter = require('events').EventEmitter;
    var analytics = require('webmaker-analytics');
    module.exports = webmakerAuthClientDefinition(EventEmitter, cookiejs, analytics);
  }

  // Global
  else {
    window.WebmakerAuthClient = webmakerAuthClientDefinition(window.EventEmitter, window.cookiejs, window.analytics);
  }

})(window);

},{"cookie":105,"events":21,"webmaker-analytics":106}],108:[function(require,module,exports){
var Vue = require('vue');
var clone = require('clone');


// Todo: replace with subset
var i18n = require('../lib/i18n');
var locale = require('../locale');

var block = require('../lib/block');
var blocks = clone(({"image":(function () {var f = require("/Users/k88hudson/github/webmaker-app/blocks/image/index.js");f["index"]=require("/Users/k88hudson/github/webmaker-app/blocks/image/index.js");return f;})(),"phone":(function () {var f = require("/Users/k88hudson/github/webmaker-app/blocks/phone/index.js");f["index"]=require("/Users/k88hudson/github/webmaker-app/blocks/phone/index.js");return f;})(),"sms":(function () {var f = require("/Users/k88hudson/github/webmaker-app/blocks/sms/index.js");f["index"]=require("/Users/k88hudson/github/webmaker-app/blocks/sms/index.js");return f;})(),"text":(function () {var f = require("/Users/k88hudson/github/webmaker-app/blocks/text/index.js");f["index"]=require("/Users/k88hudson/github/webmaker-app/blocks/text/index.js");return f;})()}));
var componentList = {};
componentList.navigationBar = require('../components/navigationBar');

// Load all components
for (var id in blocks) {
    componentList[id] = block.extend(blocks[id]);
}

// Register localization
i18n.bind(locale, Vue);

// App json
var json = window.App;

i18n.setLocale('en-US', true);

var app = new Vue({
    el: '#app',
    components: componentList,
    data: {
        title: json.name,
        app: json
    }
});


},{"../components/navigationBar":10,"../lib/block":12,"../lib/i18n":13,"../locale":16,"/Users/k88hudson/github/webmaker-app/blocks/image/index.js":2,"/Users/k88hudson/github/webmaker-app/blocks/phone/index.js":4,"/Users/k88hudson/github/webmaker-app/blocks/sms/index.js":6,"/Users/k88hudson/github/webmaker-app/blocks/text/index.js":8,"clone":17,"vue":97}]},{},[108])
