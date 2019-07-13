import { Component, PropTypes, createElement } from 'react'
import invariant from 'invariant'
import createConnectedFieldArray from './ConnectedFieldArray'
import shallowCompare from './util/shallowCompare'

const createFieldArray = ({ deepEqual, getIn, size }) => {

  class FieldArray extends Component {
    constructor(props, context) {
      super(props, context)
      this.name = this.props.name
      this.dirty = this.refs.connected && this.refs.connected.getWrappedInstance().dirty
      this.pristine = this.refs.connected && this.refs.connected.getWrappedInstance().pristine
      this.value = this.refs.connected && this.refs.connected.getWrappedInstance().value
      if (!context._reduxForm) {
        throw new Error('FieldArray must be inside a component decorated with reduxForm()')
      }
      this.ConnectedFieldArray =
        createConnectedFieldArray(context._reduxForm, { deepEqual, getIn, size }, props.name)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }

    componentWillMount() {
      this.context._reduxForm.register(this.name, 'FieldArray')
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // name changed, regenerate connected field
        this.ConnectedFieldArray =
          createConnectedFieldArray(this.context._reduxForm, {
            deepEqual,
            getIn,
            size
          }, nextProps.name)
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.name)
    }

    getRenderedComponent() {
      invariant(this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
        'you must specify a withRef prop to FieldArray')
      return this.refs.connected.getWrappedInstance().getRenderedComponent()
    }

    render() {
      return createElement(this.ConnectedFieldArray, {
        ...this.props,
        syncError: this.syncError,
        ref: 'connected'
      })
    }
  }

  FieldArray.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired,
    props: PropTypes.object
  }
  FieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return FieldArray
}

export default createFieldArray
