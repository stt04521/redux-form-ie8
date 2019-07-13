import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldArrayProps from './createFieldArrayProps'
import { mapValues, isFunction } from 'lodash'
import plain from './structure/plain'

const propsToNotUpdateFor = [
  'value'
]

const createConnectedFieldArray = ({
  arrayInsert,
  arrayMove,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
  arrayShift,
  arraySplice,
  arraySwap,
  arrayUnshift,
  asyncValidate,
  blur,
  change,
  focus,
  getFormState,
  initialValues
}, { deepEqual, getIn, size }, name) => {

  const propInitialValue = initialValues && getIn(initialValues, name)

  const getSyncError = syncErrors => {
    // For an array, the error can _ONLY_ be under _error.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return plain.getIn(syncErrors, `${name}._error`)
  }

  class ConnectedFieldArray extends Component {
    constructor(props, context) {
      super(props, context)
      this.dirty = this.props.dirty
      this.pristine = this.props.pristine
      this.value = this.props.value
    }

    shouldComponentUpdate(nextProps) {
      return Object.keys(nextProps).some(prop => {
        // useful to debug rerenders
        // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
        //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
        // }
        return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(this.props[ prop ], nextProps[ prop ])
      })
    }

    getRenderedComponent() {
      return this.refs.renderedComponent
    }

    render() {
      const { component, withRef, ...rest } = this.props
      const props = createFieldArrayProps(
        getIn,
        name,
        rest
      )
      if (withRef) {
        props.ref = 'renderedComponent'
      }
      return createElement(component, props)
    }
  }

  ConnectedFieldArray.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    props: PropTypes.object
  }

  ConnectedFieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  const actions = mapValues({
    arrayInsert,
    arrayMove,
    arrayPop,
    arrayPush,
    arrayRemove,
    arrayRemoveAll,
    arrayShift,
    arraySplice,
    arraySwap,
    arrayUnshift
  }, actionCreator => isFunction(actionCreator) && actionCreator.bind(null, name))
  const connector = connect(
    state => {
      const formState = getFormState(state)
      const initial = getIn(formState, `initial.${name}`) || propInitialValue
      const value = getIn(formState, `values.${name}`)
      const submitting = getIn(formState, 'submitting')
      const syncError = getSyncError(getIn(formState, 'syncErrors'))
      const pristine = deepEqual(value, initial)
      return {
        asyncError: getIn(formState, `asyncErrors.${name}._error`),
        dirty: !pristine,
        pristine,
        submitError: getIn(formState, `submitErrors.${name}._error`),
        submitting,
        syncError,
        value,
        length: size(value)
      }
    },
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedFieldArray)
}

export default createConnectedFieldArray
