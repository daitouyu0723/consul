import Controller from '@ember/controller';
import { get, set } from '@ember/object';

import Changeset from 'ember-changeset';
import validations from 'consul-ui/validations/kv';
import lookupValidator from 'ember-changeset-validations';
// TODO: encoder
const btoa = window.btoa;
export default Controller.extend({
  setProperties: function(model) {
    this.changeset = new Changeset(model.item, lookupValidator(validations), validations);
    this._super({
      ...model,
      ...{
        item: this.changeset,
      },
    });
  },
  json: false,
  actions: {
    change: function(e) {
      const target = e.target || { name: 'value', value: e };
      switch (target.name) {
        case 'additional':
          const parent = get(this, 'parent.Key');
          set(this.changeset, 'Key', `${parent !== '/' ? parent : ''}${target.value}`);
          break;
        case 'json':
          set(this, 'json', !get(this, 'json'));
          break;
        case 'value':
          set(this, 'item.Value', btoa(target.value));
          break;
        // case 'key':
        //   set(this, 'item.Key', target.value);
        //   break;
      }
    },
  },
});