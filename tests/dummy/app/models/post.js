import DS from 'ember-data';

const { attr, Model } = DS;

export default Model.extend({
  title: attr('string'),
  imageUrl: attr('string'),
  summary: attr('string'),
  body: attr('string'),
  logoUrl: attr('string')
});