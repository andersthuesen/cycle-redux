export default function makeStateDriver(reducer, initialState) {
  let state = reducer(initialState, {type: null})
  return function(action$) {

    const state$ = action$
      .startWith(state)
      .map(action => {
        state = reducer(state, action)
        return state
      })

    return state$

  }
}
