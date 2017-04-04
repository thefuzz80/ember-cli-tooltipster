/* jshint node: true */
'use strict';

var path = require('path');
var util = require('util');
var extend = util._extend;
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var defaultOptions = {
  importTooltipsterDefaultStyles: true,
  importTooltipsterBorderless: false,
  importTooltipsterLight: false,
  importTooltipsterNoir: false,
  importTooltipsterPunk: false,
  importTooltipsterShadow: false
};

function isFastBoot() {
  return process.env.EMBER_CLI_FASTBOOT === 'true';
}

module.exports = {
  name: 'ember-cli-tooltipster',

  included: function (app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;
    this.tooltipsterOptions = extend(defaultOptions, app.options['ember-cli-tooltipster']);

    if (!isFastBoot()) {
      this.importDependencies(app);
    }

    return app;
  },

  importDependencies(app) {
    app.import('vendor/tooltipster/tooltipster.bundle.js');

    if (this.tooltipsterOptions.importTooltipsterDefaultStyles) {
      app.import('vendor/tooltipster/tooltipster.bundle.css');
    }
    if (this.tooltipsterOptions.importTooltipsterBorderless) {
      app.import('vendor/tooltipster/tooltipster-sideTip-borderless.min.css');
    }
    if (this.tooltipsterOptions.importTooltipsterLight) {
      app.import('vendor/tooltipster/tooltipster-sideTip-light.min.css');
    }
    if (this.tooltipsterOptions.importTooltipsterNoir) {
      app.import('vendor/tooltipster/tooltipster-sideTip-noir.min.css');
    }
    if (this.tooltipsterOptions.importTooltipsterPunk) {
      app.import('vendor/tooltipster/tooltipster-sideTip-punk.min.css');
    }
    if (this.tooltipsterOptions.importTooltipsterShadow) {
      app.import('vendor/tooltipster/tooltipster-sideTip-shadow.min.css');
    }
  },

  treeForVendor(vendorTree) {
    var trees = [];
    var themes = [];
    var tooltipsterPath = path.dirname(require.resolve('tooltipster'));
    var tooltipsterCssPath = path.join(this.project.root, 'node_modules', 'tooltipster/dist/css');
    var tooltipsterThemePath = path.join(this.project.root, 'node_modules', 'tooltipster/dist/css/plugins/tooltipster/sideTip/themes/');

    if (vendorTree) {
      trees.push(vendorTree);
    }

    trees.push(new Funnel(tooltipsterPath, {
      destDir: 'tooltipster',
      files: ['tooltipster.bundle.js']
    }));

    if (this.tooltipsterOptions.importTooltipsterDefaultStyles) {
      trees.push(new Funnel(tooltipsterCssPath, {
        destDir: 'tooltipster',
        files: ['tooltipster.bundle.css']
      }));
    }
    if (this.tooltipsterOptions.importTooltipsterBorderless) {
      themes.push('tooltipster-sideTip-borderless.min.css');
    }
    if (this.tooltipsterOptions.importTooltipsterLight) {
      themes.push('tooltipster-sideTip-light.min.css');
    }
    if (this.tooltipsterOptions.importTooltipsterNoir) {
      themes.push('tooltipster-sideTip-noir.min.css');
    }
    if (this.tooltipsterOptions.importTooltipsterPunk) {
      themes.push('tooltipster-sideTip-punk.min.css');
    }
    if (this.tooltipsterOptions.importTooltipsterShadow) {
      themes.push('tooltipster-sideTip-shadow.min.css');
    }

    trees.push(new Funnel(tooltipsterThemePath, {
      destDir: 'tooltipster',
      files: themes
    }));

    return mergeTrees(trees);
  },
};
