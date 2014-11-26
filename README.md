# Ember Infinite Scroller

Ember Infinite Scroller is a component that sits at the bottom of a page of content. It calls
`store.find` to get more content and pushes the content into a model when a user scrolls to
the bottom.

## Installation

* Install addon `npm install ember-infinite-scroller --save-dev`
* Generate template and styles `ember g infinite-scroller`

## Implementation
Drop the infinite scroller component into any template. There is one required param: `contextController`.
In most cases it will be `this`.

```handlebars
{{infinite-scroller contextController=this}}
```

Other parameters are optional.

* `limit` default: 12

```handlebars
{{infinite-scroller contextController=this limit=30}}
```

* `beginInfinite` default: `true`

Use `beginInfinite` to start or stop manually. For example:

Template:

```handlebars
<button {{action 'toggleBeginInfinite'}}>Begin</button>
{{infinite-scroller  contextController=this beginInfinite=beginInfinite}}
```

Controller:

```javascript
actions: {
  toggleBeginInfinite: function() {
    this.toggleProperty('beginInfinite')
  }
}
```

* `content` default: the content of the contextController

The `content` can be customized if the content of the infinite scroller is not the model
of the controller.

```handlebars
{{infinite-scroller contextController=this content=otherModel}}
```

* `modelName` default: the name of the model of the content

If the infinite scroller should query a different model than the content of the content,
it can be overwritten.

For example, if the content model type is `'note'` but the query should be for `'comment'`:

```handlebars
{{infinite-scroller contextController=this modelName='comment'}}
```

* `query` default:

```javascript
{model: this.get('modelName'), params: {}, callback: null}
```

The `query` has a required `modelName` and `params` and an optional `callback`.

```handlebars
{{infinite-scroller contextController=this query=query}}
```

Controller:

```javascript
query: function() {
  var query = {
    model: 'post',
    params: {published: true},
    callback: function(posts) {
      // do cool things with posts when they come back.
    }
  };
  return query;
}
```

## Blueprint

The blueprint template comes with some handy features, including a `yield` that is
displayed when the infinite scroller is out of content.

```handlebars
{{infinite-scroller contextController=this}}
  <span>No more content!</span>
{{/infinite-scroller}}
```

It also includes a loading spnner When the scroller is fetching content, it displays a spinner.
The default is an image, but you can customize the css to change the spinner.
