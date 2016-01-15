# cycle-redux


If you are familiar with [Redux](https://github.com/rackt/redux) and [Cycle.js](https://github.com/cyclejs), you already know how this works.


First we include the necessary modules.

```js
import makeStateDriver from "cycle-redux"

import { run } from "@cycle/core"
import { div, button, p } from "@cycle/dom"


```

Then we create our reducer. This is a very simple one, but you could also combine multiple reducers using redux's `combineReducers` function.

```js

// This is a reducer
function counter(state = 0, action) {

  switch(action.type) {
    case "INCREMENT":
      return state + 1
    case "DECREMENT":
      return state - 1
    default:
      return state
  }

}

```

Here we create our main method.
Notice how each click-event maps to a state action, which changes the state, which then changes the DOM.

```js

function main(sources) {

  // Create increment action stream.
  const increment$ = sources.DOM
    .select(".increment")
    .events("click")
    .map(e => ({type: "INCREMENT"}))

  // Create decrement action stream.
  const decrement$ = sources.DOM
    .select(".decrement")
    .events("click")
    .map(e => ({type: "DECREMENT"}))


  // Merge the two action streams.
  const state$ = increment$.merge(decrement$)


  // Create virtual DOM tree.
  const vtree$ = sources.state
    .map(count => (
      div([
        button(".decrement", "Decrement"),
        button(".increment", "Increment"),
        p("Counter: " + count)
      ])

    ))

  // Return virtual DOM and action stream
  return {
    DOM: vtree$,
    state: state$
  }


}

```

At last, we run our app.

The `makeStateDriver` function takes a reducer and an optional initial state. Here we start with 1.

```js
run(main, {
  DOM: makeDOMDriver(document.getElementById("app")),
  state: makeStateDriver(counter, 1)
})

```
