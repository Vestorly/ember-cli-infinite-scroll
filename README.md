# Ember Infinite Scroller

Ember Infinite Scroller is a component that sits at the bottom of a page of content. It will
make a REST call to get more content when a user scrolls to the bottom.

## Installation

* Install addon `npm install ember-infinite-scroller --save-dev`
* Generate template and styles `ember g infinite-scroller`

## Implementation
Drop the infinite scroller component into any template. There is one required param: `contextController`.
In most cases it will be `this`.

```
{{infinite-scroller contextController=this}}
```

Other parameters are optional.

* `limit` default: 12

```
{{infinite-scroller  contextController=this limit=30}}
```

* `beginInfinite` default: `true`

Use `beginInfinite` to start or stop manually. For example:

Template:
```
<button {{action 'toggleBeginInfinite'}}>Begin</button>
{{infinite-scroller  contextController=this beginInfinite=beginInfinite}}
```

Controller:
```
actions: {
  toggleBeginInfinite: function() {
    this.toggleProperty('beginInfinite')
  }
}
```

* `content` default: the content of the contextController

The `content` can be customized if the content of the infinite scroller is not the model
of the controller.

```
{{infinite-scroller contextController=this content=otherModel}}
```

* `modelName` default: the name of the model of the content

If the infinite scroller should query a different model than the content of the content,
it can be overwritten.

For example, if the content model type is `'note'` but the query should be for `'comment'`:

```
{{infinite-scroller contextController=this modelName='comment'}}
```

* `query` default:
```
{model: this.get('modelName'), params: {}, callback: null}
```

The `query` has a required `modelName` and `params` and an optional `callback`.

```
{{infinite-scroller contextController=this query=query}}
```

Controller:
```
query: function() {
  var query = {
    model: 'post',
    params: {published: true}
    callback: function(posts) {
      // do cool things with posts when they come back.
    }
  }
  return query
}
```

