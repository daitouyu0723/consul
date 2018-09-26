import Controller from '@ember/controller';
import { get, set } from '@ember/object';
import Changeset from 'ember-changeset';
import validations from 'consul-ui/validations/token';
import lookupValidator from 'ember-changeset-validations';
const normalizeEmberTarget = function(e, value, target) {
  return e.target || { ...target, ...{ name: e, value: value } };
};
export default Controller.extend({
  isScoped: false,
  setProperties: function(model) {
    this.changeset = new Changeset(model.item, lookupValidator(validations), validations);
    this._super({
      ...model,
      ...{
        item: this.changeset,
      },
    });
  },
  actions: {
    change: function(e, value, _target) {
      const target = normalizeEmberTarget(e, value, _target);
      switch (target.name) {
        case 'Description':
          set(this.changeset, target.name, target.value);
          break;
        case 'Local':
          set(this.changeset, target.name, !get(this.item, target.name));
          break;
        case 'isScoped':
          set(this, target.name, !get(this, target.name));
          break;
        case 'Policy':
          this.send('addPolicy', target.value);
          break;
        // Legacy
        case 'Type':
          set(this.changeset, target.name, target.value);
          break;
        case 'Rules':
          set(this, 'item.Rules', target.value);
          break;
      }
      this.changeset.validate();
    },
  },
});